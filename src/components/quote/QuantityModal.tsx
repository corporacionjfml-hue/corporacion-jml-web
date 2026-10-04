"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { getUnit } from "@/data/cables";
import { findCable } from "@/lib/quote/catalog";
import {
  clampQuantity,
  defaultQuantity,
  getQuantityRule,
  parseQuantityInput,
  stepQuantity,
} from "@/lib/quote/rules";
import { useQuote } from "./QuoteProvider";

const FOCUSABLE =
  "button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";

/** Renders the dialog only while a cable is selected; keyed so state resets per cable. */
export function QuantityModal() {
  const { modalCableId } = useQuote();
  if (!modalCableId) return null;
  return <QuantityDialog key={modalCableId} cableId={modalCableId} />;
}

function QuantityDialog({ cableId }: { cableId: string }) {
  const { items, setQuantity, remove, closeQuantity } = useQuote();
  const cable = findCable(cableId);
  const existing = items.find((item) => item.cableId === cableId);
  const titleId = useId();
  const hintId = useId();
  const inputId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const unit = cable ? getUnit(cable) : "metros";
  const rule = getQuantityRule(unit);
  const [draft, setDraft] = useState(() => String(existing?.quantity ?? defaultQuantity(unit)));

  // Focus management and scroll lock; restore both on unmount.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  if (!cable) return null;

  const current = clampQuantity(parseQuantityInput(draft), unit);
  const atMin = current <= rule.min;
  const atMax = current >= rule.max;
  const maxLength = String(rule.max).length;

  const commit = () => {
    setQuantity(cableId, current);
    closeQuantity();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeQuantity();
      return;
    }
    if (e.key === "Enter" && e.target === inputRef.current) {
      e.preventDefault();
      commit();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const step = (direction: 1 | -1) => setDraft(String(stepQuantity(current, unit, direction)));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(20,38,58,.55)] backdrop-blur-[8px] md:items-center md:p-7"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeQuantity();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hintId}
        onKeyDown={onKeyDown}
        className="animate-rise max-h-[94vh] w-full max-w-[460px] overflow-y-auto rounded-t-panel bg-white p-6 shadow-panel md:rounded-panel"
      >
        <p className="kicker m-0 mb-2">
          {existing ? "Editar cantidad" : "Agregar a tu cotización"}
        </p>
        <h2
          id={titleId}
          className="m-0 text-[28px] font-extrabold leading-[1.05] tracking-[-0.5px] text-ink"
        >
          {cable.name}
        </h2>
        <p className="m-0 mt-1 text-[14px] text-mute-2">{cable.fullName}</p>

        <label htmlFor={inputId} className="lbl mt-6">
          Cantidad ({unit})
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="iconbtn shrink-0 text-[22px] font-bold aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            aria-label="Disminuir cantidad"
            // aria-disabled (not disabled) keeps focus inside the dialog at the minimum.
            aria-disabled={atMin}
            onClick={() => {
              if (!atMin) step(-1);
            }}
          >
            −
          </button>
          <input
            ref={inputRef}
            id={inputId}
            className="field text-center text-[20px] font-bold"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby={hintId}
            value={draft}
            maxLength={maxLength}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, maxLength))}
            onBlur={() => setDraft(String(current))}
          />
          <button
            type="button"
            className="iconbtn shrink-0 text-[22px] font-bold aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            aria-label="Aumentar cantidad"
            aria-disabled={atMax}
            onClick={() => {
              if (!atMax) step(1);
            }}
          >
            +
          </button>
          <span className="min-w-[52px] font-mono text-[13px] font-semibold uppercase tracking-[1px] text-mute-2">
            {unit}
          </span>
        </div>
        <p id={hintId} className="m-0 mt-2 text-[13.5px] text-mute-2">
          {rule.hint}
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button type="button" className="btn btn-lime btn-lg w-full" onClick={commit}>
            {existing ? "Guardar" : "Agregar"}
          </button>
          <button type="button" className="btn btn-line w-full" onClick={closeQuantity}>
            Cancelar
          </button>
          {existing && (
            <button
              type="button"
              className="min-h-11 cursor-pointer border-0 bg-transparent text-[14.5px] font-semibold text-warn underline"
              onClick={() => {
                remove(cableId);
                closeQuantity();
              }}
            >
              Quitar de la cotización
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
