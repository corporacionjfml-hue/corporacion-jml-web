"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { QuoteButton } from "@/components/catalog/QuoteButton";
import { useCableSheet } from "@/components/catalog/CableSheetProvider";
import { useQuote } from "@/components/quote/QuoteProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cables } from "@/data/cables";
import {
  buyerOptions,
  findPlace,
  findPriority,
  getRecommendation,
  getStep,
  placeOptions,
  priorityOptions,
  stepNumber,
  type PlaceId,
  type PriorityId,
} from "@/lib/assistant/assistant";

interface OptionButtonProps {
  icon: IconName;
  title: string;
  hint: string;
  onPick: () => void;
}

function OptionButton({ icon, title, hint, onPick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex min-h-[112px] cursor-pointer flex-col items-start gap-2 rounded-xl border-2 border-transparent bg-page p-3.5 text-left text-ink transition-[border-color,background,transform] duration-200 hover:border-navy hover:bg-white motion-safe:hover:-translate-y-0.5"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-md bg-navy text-lime transition-colors duration-200 group-hover:bg-lime group-hover:text-ink">
        <Icon name={icon} size={21} strokeWidth={1.8} />
      </span>
      <span className="text-[15.5px] font-bold leading-[1.2]">{title}</span>
      <span className="text-[12.5px] leading-[1.35] text-mute-2">{hint}</span>
    </button>
  );
}

function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex min-h-11 cursor-pointer items-center self-start text-left text-sm font-semibold text-navy"
    >
      <span aria-hidden="true">←&nbsp;</span>
      {children}
    </button>
  );
}

/** Hero assistant: buyer type, installation place, priority, then recommendations. */
export function Assistant() {
  const { buyerType, setBuyerType, count, addMany, hasItem } = useQuote();
  const { open: openSheet } = useCableSheet();
  const [place, setPlace] = useState<PlaceId | null>(null);
  const [priority, setPriority] = useState<PriorityId | null>(null);

  const step = getStep(buyerType, place, priority);
  const number = stepNumber[step];

  const recommendation = useMemo(
    () => (place && priority ? getRecommendation(cables, place, priority) : null),
    [place, priority],
  );

  // Move focus to the new heading after a user-driven step change (never on first render
  // or when the stored buyer type hydrates), so keyboard users do not lose their place.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusPending = useRef(false);
  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);
  const go = (action: () => void) => {
    focusPending.current = true;
    action();
  };

  const placeLabel = place ? findPlace(place).title : "";
  const priorityLabel = priority ? findPriority(priority).title : "";
  const buyerLabel = buyerOptions.find((option) => option.id === buyerType)?.title ?? "";
  const allAdded = recommendation?.cables.every((cable) => hasItem(cable.id)) ?? false;

  const status =
    step === "result" && recommendation
      ? `Resultados: ${recommendation.cables.length} ${
          recommendation.cables.length === 1 ? "cable recomendado" : "cables recomendados"
        }.`
      : `Pregunta ${number} de 3.`;

  const headingClass =
    "m-0 text-[26px] font-extrabold leading-[1.15] tracking-[-0.5px] outline-none";

  return (
    <div className="relative rounded-panel bg-white p-[clamp(20px,3vw,30px)] text-ink shadow-wizard">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-semibold tracking-[2px] text-lime-dark">
          ASISTENTE · 3 PREGUNTAS
        </span>
        <div aria-hidden="true" className="flex w-[190px] items-center gap-1.5">
          {[1, 2, 3, 4].map((dot) => (
            <span key={dot} className="contents">
              {dot > 1 && <span className="h-0.5 grow bg-line-soft" />}
              <span
                className={`inline-flex size-[30px] shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-semibold ${
                  dot <= number ? "bg-navy text-lime" : "bg-line-track text-mute-2"
                }`}
              >
                {dot === 4 ? <Icon name="check" size={14} strokeWidth={2.6} /> : dot}
              </span>
            </span>
          ))}
        </div>
      </div>
      <p role="status" className="sr-only">
        {status}
      </p>

      {step === "buyer" && (
        <div role="group" aria-labelledby="wiz-title">
          <h2 id="wiz-title" ref={headingRef} tabIndex={-1} className={`${headingClass} mb-4 mt-2`}>
            ¿Qué tipo de compra deseas hacer?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {buyerOptions.map((option) => (
              <OptionButton
                key={option.id}
                icon={option.icon}
                title={option.title}
                hint={option.hint}
                onPick={() => go(() => setBuyerType(option.id))}
              />
            ))}
          </div>
        </div>
      )}

      {step === "place" && (
        <div role="group" aria-labelledby="wiz-title" className="flex flex-col">
          <BackLink onClick={() => go(() => setBuyerType(null))}>{buyerLabel}</BackLink>
          <h2 id="wiz-title" ref={headingRef} tabIndex={-1} className={`${headingClass} mb-4 mt-1`}>
            ¿Dónde vas a instalar el cable?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {placeOptions.map((option) => (
              <OptionButton
                key={option.id}
                icon={option.icon}
                title={option.title}
                hint={option.hint}
                onPick={() => go(() => setPlace(option.id))}
              />
            ))}
          </div>
        </div>
      )}

      {step === "priority" && (
        <div role="group" aria-labelledby="wiz-title" className="flex flex-col">
          <BackLink onClick={() => go(() => setPlace(null))}>{placeLabel}</BackLink>
          <h2 id="wiz-title" ref={headingRef} tabIndex={-1} className={`${headingClass} mb-4 mt-1`}>
            ¿Qué es lo más importante?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {priorityOptions.map((option) => (
              <OptionButton
                key={option.id}
                icon={option.icon}
                title={option.title}
                hint={option.hint}
                onPick={() => go(() => setPriority(option.id))}
              />
            ))}
          </div>
        </div>
      )}

      {step === "result" && recommendation && (
        <div role="group" aria-labelledby="wiz-title" className="flex flex-col">
          <BackLink onClick={() => go(() => setPriority(null))}>
            {placeLabel} · {priorityLabel}
          </BackLink>
          <h2 id="wiz-title" ref={headingRef} tabIndex={-1} className={`${headingClass} mb-1.5 mt-1`}>
            Te recomendamos
          </h2>
          {recommendation.fallback && (
            <p className="m-0 mb-2 text-sm text-warn">
              Ninguno cumple exactamente, pero siempre hay opción: estas son las alternativas
              más cercanas.
            </p>
          )}
          <ul className="m-0 mt-2.5 flex list-none flex-col gap-2.5 p-0">
            {recommendation.cables.map((cable) => (
              <li
                key={cable.id}
                className="flex items-center gap-2.5 rounded-xl border-2 border-transparent bg-page py-3 pl-4 pr-3 transition-[border-color,background] duration-200 hover:border-navy hover:bg-white"
              >
                <button
                  type="button"
                  onClick={() => openSheet(cable.id)}
                  className="flex min-h-11 min-w-0 grow cursor-pointer flex-col gap-0.5 text-left text-ink"
                >
                  <span className="text-lg font-extrabold">{cable.name}</span>
                  <span className="font-mono text-[12.5px] text-mute-2">
                    {cable.voltage ?? "Consultar"} · {cable.temperature?.operation ?? "Consultar"}{" "}
                    · ver ficha <span aria-hidden="true">→</span>
                    <span className="sr-only"> de {cable.name}</span>
                  </span>
                </button>
                <QuoteButton
                  cable={cable}
                  className="min-h-11 shrink-0 px-3.5 text-[13.5px] whitespace-nowrap"
                />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              className={`btn min-h-12 text-[15px] ${allAdded ? "btn-added" : "btn-lime"}`}
              disabled={allAdded}
              onClick={() => addMany(recommendation.cables.map((cable) => cable.id))}
            >
              {allAdded ? (
                <>
                  <Icon name="check" size={15} strokeWidth={2.6} />
                  Todos en tu cotización
                </>
              ) : (
                "Agregar todos a mi cotización"
              )}
            </button>
            <a href="#cotizar" className="btn btn-navy min-h-12 text-[15px]">
              Ver mi cotización
              {count > 0 && (
                <span className="badge bg-lime text-ink">
                  {count}
                  <span className="sr-only">
                    {count === 1 ? " cable" : " cables"}
                  </span>
                </span>
              )}
              <Icon name="arrow" size={16} strokeWidth={2.2} />
            </a>
          </div>
          <button
            type="button"
            onClick={() =>
              go(() => {
                setPlace(null);
                setPriority(null);
              })
            }
            className="mt-3 inline-flex min-h-11 cursor-pointer items-center self-start text-sm text-mute-2 underline"
          >
            Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
