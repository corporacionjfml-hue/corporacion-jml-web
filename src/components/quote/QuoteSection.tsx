"use client";

import Link from "next/link";
import { useId, useRef, type KeyboardEvent } from "react";
import { useCableSheet } from "@/components/catalog/CableSheetProvider";
import { Icon } from "@/components/ui/Icon";
import { company, telHref } from "@/data/company";
import { trackEvent } from "@/lib/analytics";
import { categoryColors } from "@/lib/catalog/categories";
import { findCable } from "@/lib/quote/catalog";
import { buildQuoteUrl, formatQuantity } from "@/lib/quote/message";
import type { BuyerType } from "@/lib/quote/types";
import { CallbackForm } from "./CallbackForm";
import { useQuote } from "./QuoteProvider";

const BUYER_OPTIONS: { value: BuyerType; label: string }[] = [
  { value: "mayorista", label: "Mayorista" },
  { value: "minorista", label: "Minorista" },
];

const contactLink =
  "inline-flex min-h-11 items-center gap-2 text-on-navy-2 no-underline hover:text-white";

function BuyerTypeToggle() {
  const { buyerType, setBuyerType } = useQuote();
  const labelId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Radio-group keyboard model: arrows move and select, only one tab stop.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const move =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!move) return;
    event.preventDefault();
    const next = (index + move + BUYER_OPTIONS.length) % BUYER_OPTIONS.length;
    setBuyerType(BUYER_OPTIONS[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-2.5">
      <span id={labelId} className="text-[16px] font-bold text-white">
        ¿Qué tipo de compra deseas hacer?
      </span>
      <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-2.5">
        {BUYER_OPTIONS.map((option, index) => {
          const checked = buyerType === option.value;
          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (buyerType === null && index === 0) ? 0 : -1}
              onClick={() => setBuyerType(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`inline-flex min-h-12 min-w-[140px] flex-1 items-center justify-center gap-2 rounded-md border-2 px-5 text-[15px] font-bold transition-colors sm:flex-none ${
                checked
                  ? "border-lime bg-lime text-ink"
                  : "border-white/35 bg-transparent text-white hover:border-white hover:bg-white/10"
              }`}
            >
              {checked && <Icon name="check" size={16} strokeWidth={2.8} />}
              {option.label}
            </button>
          );
        })}
      </div>
      {buyerType === null && (
        <p className="m-0 text-[13.5px] text-lime-hover">
          Elige una opción y la incluimos en tu mensaje.
        </p>
      )}
    </div>
  );
}

function QuoteList() {
  const { items, openQuantity, remove, buyerType } = useQuote();
  const sheet = useCableSheet();

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-3.5 rounded-2xl border-2 border-dashed border-white/30 p-[22px]">
        <span className="text-[18px] font-bold text-white">Tu lista está vacía</span>
        <span className="text-[15px] leading-[1.55] text-on-navy-2">
          Usa el asistente para saber qué cable necesitas, o toca “+ Cotizar” en cualquier cable
          del catálogo.
        </span>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/#asistente" className="btn btn-lime">
            Usar el asistente
          </Link>
          <Link href="/#catalogo" className="btn btn-wline">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((item) => {
          const cable = findCable(item.cableId);
          if (!cable) return null;
          return (
            <li
              key={item.cableId}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-white/15 bg-white/8 py-3.5 pl-4 pr-3.5"
            >
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-[3px]"
                style={{ background: categoryColors(cable.categoryId).fill }}
              />
              <button
                type="button"
                onClick={() => sheet.open(cable.id)}
                className="flex min-h-11 min-w-11 flex-1 basis-[160px] cursor-pointer flex-col justify-center gap-0.5 border-0 bg-transparent p-0 text-left font-[inherit] text-white"
              >
                <span className="text-[18px] font-extrabold">{cable.name}</span>
                <span className="text-[13px] text-on-navy-3">{cable.fullName}</span>
                <span className="sr-only"> (abrir ficha técnica)</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/12 px-3 py-1.5 font-mono text-[13.5px] font-semibold text-white">
                  {formatQuantity(item)}
                </span>
                <button
                  type="button"
                  onClick={() => openQuantity(cable.id)}
                  aria-label={`Editar cantidad de ${cable.name}`}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-white/25 bg-transparent px-3.5 text-[14px] font-bold text-white hover:bg-white/15"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(cable.id)}
                  aria-label={`Quitar ${cable.name} de la cotización`}
                  className="inline-flex size-11 cursor-pointer items-center justify-center rounded-sm border border-white/25 bg-transparent text-[20px] leading-none text-white hover:bg-white/15"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={buildQuoteUrl(items, buyerType)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-lime btn-lg text-[17px]"
          onClick={() =>
            trackEvent("quote_sent", {
              item_count: items.length,
              buyer_type: buyerType ?? "sin_definir",
            })
          }
        >
          <Icon name="whatsapp" size={22} />
          Enviar lista por WhatsApp
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <Link href="/#catalogo" className="btn btn-wline">
          Agregar más cables
        </Link>
      </div>
    </>
  );
}

export function QuoteSection() {
  return (
    <section id="cotizar" aria-label="Tu cotización" className="scroll-mt-20 pb-[88px] pt-14">
      <div className="wrap">
        <div className="relative grid grid-cols-1 gap-7 overflow-hidden rounded-band bg-navy p-[clamp(24px,4.5vw,56px)] lg:grid-cols-2">
          <div
            aria-hidden="true"
            className="absolute -left-[120px] -top-[120px] size-[320px] rounded-full bg-lime/14"
          />
          <div className="relative flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="kicker self-start text-lime-hover">Tu cotización</span>
              <h2 className="h2 text-white">Envíanos tu lista y te cotizamos hoy</h2>
              <p className="m-0 text-[17px] leading-[1.6] text-on-navy-2">
                Arma tu lista con el asistente o con el botón “+ Cotizar” de cada cable.{" "}
                {company.slogan}.
              </p>
            </div>
            <BuyerTypeToggle />
            <QuoteList />
            <ul className="m-0 flex list-none flex-wrap gap-x-[18px] gap-y-1 p-0 pt-2 text-[15px]">
              {company.phones.map((phone) => (
                <li key={phone.whatsapp}>
                  <a href={telHref(phone.whatsapp)} className={`${contactLink} font-bold text-white`}>
                    <Icon name="phone" size={20} className="text-lime" strokeWidth={1.8} />
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                {/* Social handle is provisional until the client confirms it. */}
                <span className="inline-flex min-h-11 items-center gap-2 text-on-navy-2">
                  <Icon name="at" size={20} className="text-lime" strokeWidth={1.8} />
                  {company.social.handle}
                  {company.social.pendingConfirmation && (
                    <span className="text-on-navy-3"> (por confirmar)</span>
                  )}
                </span>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className={contactLink}>
                  <Icon name="mail" size={20} className="text-lime" strokeWidth={1.8} />
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="relative min-w-0 rounded-card bg-white p-[clamp(20px,3vw,32px)]">
            <CallbackForm />
          </div>
        </div>
      </div>
    </section>
  );
}
