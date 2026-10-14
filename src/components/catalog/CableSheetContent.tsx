"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Cable, CableVariant } from "@/data/types";
import {
  applicationIcon,
  featureIcon,
  getGaugeRange,
} from "@/lib/catalog/display";
import { brands } from "@/data/brands";
import { QuoteButton } from "./QuoteButton";

const KICKER = "kicker m-0";

interface CableSheetContentProps {
  cable: Cable;
  /** Heading level of the section titles: h3 inside the modal (h2 title), h2 on the page (h1 title). */
  headingLevel: "h2" | "h3";
  /** Replaces the default padding of the content wrapper. */
  className?: string;
  /** Rendered after the last section (call-to-action rows differ per surface). */
  children?: ReactNode;
}

/**
 * Presentational body of a technical sheet (specs, description, features, data
 * tables, applications). Shared by the modal and the `/cables/[slug]` page.
 */
export function CableSheetContent({
  cable,
  headingLevel: Heading,
  className = "px-6 pb-[30px] pt-[26px]",
  children,
}: CableSheetContentProps) {
  const tabsId = useId();
  const [variantIndex, setVariantIndex] = useState(0);

  // Defensive: the type guarantees one variant, but data edits must never crash the sheet.
  const variant: CableVariant | undefined =
    cable.variants[variantIndex] ?? cable.variants[0];
  const hasTabs = cable.variants.length > 1;

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const count = cable.variants.length;
    let next = variantIndex;
    if (e.key === "ArrowRight") next = (variantIndex + 1) % count;
    else if (e.key === "ArrowLeft") next = (variantIndex - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setVariantIndex(next);
    e.currentTarget
      .querySelectorAll<HTMLElement>("[role='tab']")
      [next]?.focus();
  };

  const temperature = cable.temperature;
  const specCandidates: [string, string | undefined][] = [
    ["Marca", brands[cable.brand].label],
    ["Tensión nominal", cable.voltage],
    ["T° operación", temperature?.operation],
    ["Rango", getGaugeRange(cable)],
    ["Cortocircuito", temperature?.shortCircuit],
    ["T° emergencia", temperature?.emergency],
  ];
  const specs = specCandidates
    .filter(
      (entry): entry is [string, string] =>
        Boolean(entry[1]) && entry[1] !== "—",
    )
    .slice(0, 4);

  const applications = [
    ...cable.applications,
    ...(variant?.applications ?? []).filter(
      (text) => !cable.applications.includes(text),
    ),
  ];

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-6">
        {cable.image && (
          <div className="flex h-[130px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line-soft bg-page p-2 shadow-sm md:h-auto md:w-[150px]">
            <img
              src={cable.image}
              alt={`Cable ${cable.name}`}
              className="h-full w-full object-contain"
              width={150}
              height={150}
            />
          </div>
        )}
        {specs.length > 0 && (
          <dl className="m-0 grid grow grid-cols-2 gap-2.5 sm:grid-cols-4">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col justify-center rounded-xl border border-line-soft bg-page p-4"
              >
                <dt className="font-mono text-[10.5px] uppercase tracking-[1.2px] text-mute-2">
                  {label}
                </dt>
                {label === "Marca" ? (
                  <dd className="m-0 mt-1.5 flex items-center gap-2">
                    <span className="flex h-7 shrink-0 items-center justify-center rounded-xs border border-line-soft bg-white px-2 py-0.5 shadow-2xs">
                      <img
                        src={brands[cable.brand].logo}
                        alt={brands[cable.brand].logoAlt}
                        className="h-full w-auto max-w-[72px] object-contain"
                        height={22}
                      />
                    </span>
                    <span className="font-mono text-[14px] font-bold text-navy">
                      {value}
                    </span>
                  </dd>
                ) : (
                  <dd className="m-0 mt-1.5 text-[20px] font-extrabold text-navy">
                    {value}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="grid grid-cols-1 gap-[30px] band:grid-cols-2">
        <section className="flex flex-col gap-3.5">
          <Heading className={KICKER}>Descripción</Heading>
          <p className="m-0 text-[16.5px] leading-[1.65] text-mute-3">
            {cable.description}
          </p>
          {cable.construction.length > 0 && (
            <>
              <Heading className={`${KICKER} mt-2`}>Construcción</Heading>
              <ol className="m-0 flex list-none flex-col gap-2 p-0">
                {cable.construction.map((text, i) => (
                  <li
                    key={text}
                    className="flex items-baseline gap-3 text-[15px] leading-[1.45] text-mute-3"
                  >
                    <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-xs bg-navy font-mono text-[12px] font-semibold text-lime">
                      {i + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <section className="flex flex-col gap-3.5">
          <Heading className={KICKER}>Características</Heading>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 p-0">
            {cable.features.map((text) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-lg border border-line-soft bg-white px-3.5 py-3"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-lime-soft text-lime-dark">
                  <Icon
                    name={featureIcon(text)}
                    size={20}
                    strokeWidth={1.8}
                  />
                </span>
                <span className="text-[14.5px] font-medium leading-[1.3] text-ink">
                  {text}
                </span>
              </li>
            ))}
          </ul>
          {cable.standards.length > 0 && (
            <>
              <Heading className={`${KICKER} mt-2`}>Normas de fabricación</Heading>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {cable.standards.map((text) => (
                  <li
                    key={text}
                    className="rounded-sm bg-navy px-3 py-2 font-mono text-[12.5px] text-white"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </>
          )}
          {cable.certificates && cable.certificates.length > 0 && (
            <>
              <Heading className={`${KICKER} mt-2`}>Certificados</Heading>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {cable.certificates.map((text) => (
                  <li
                    key={text}
                    className="rounded-sm bg-lime-soft px-3 py-2 text-[13px] font-semibold text-lime-deep"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading className={KICKER}>Hoja de datos técnicos</Heading>
          {hasTabs && (
            <div
              role="tablist"
              aria-label="Tablas de datos técnicos"
              className="flex flex-wrap gap-2"
              onKeyDown={onTabKeyDown}
            >
              {cable.variants.map((item, i) => {
                const active = i === variantIndex;
                return (
                  <button
                    key={item.id}
                    id={`${tabsId}-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`${tabsId}-panel`}
                    tabIndex={active ? 0 : -1}
                    className={`tab ${active ? "tab-on" : "tab-off"}`}
                    onClick={() => setVariantIndex(i)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          id={`${tabsId}-panel`}
          role={hasTabs ? "tabpanel" : undefined}
          aria-labelledby={
            hasTabs ? `${tabsId}-tab-${variantIndex}` : undefined
          }
          className="flex flex-col gap-3.5"
        >
          {variant?.description && (
            <p className="m-0 text-[15px] leading-[1.6] text-mute-3">
              {variant?.description}
            </p>
          )}
          {variant && variant.tableStatus === "available" ? (
            <SpecTableView
              cable={cable}
              variant={variant}
              table={variant.table}
            />
          ) : (
            <div className="flex flex-col items-start gap-3.5 rounded-xl border-2 border-dashed border-line-dashed bg-page p-6">
              <p className="m-0 text-[22px] font-extrabold text-ink">
                Calibres a pedido
              </p>
              <p className="m-0 text-[15px] leading-[1.55] text-mute">
                Esta ficha aún no tiene tabla de calibres. Cuéntanos qué
                necesitas y te cotizamos los calibres disponibles.
              </p>
              <QuoteButton cable={cable} />
            </div>
          )}
          {variant?.notes && variant.notes.length > 0 && (
            <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-[14px] leading-[1.5] text-mute-3">
              {variant.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>
        <p className="m-0 text-[12.5px] text-mute-2">
          Valores referenciales de ficha técnica del fabricante. Confirme
          con un asesor antes de especificar.
        </p>
      </section>

      {applications.length > 0 && (
        <section className="flex flex-col gap-3.5">
          <Heading className={KICKER}>Aplicaciones</Heading>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 p-0">
            {applications.map((text) => (
              <li
                key={text}
                className="flex flex-col gap-3.5 rounded-2xl bg-lime-soft p-5"
              >
                <span className="inline-flex size-[54px] items-center justify-center rounded-lg bg-navy text-lime">
                  <Icon
                    name={applicationIcon(text)}
                    size={26}
                    strokeWidth={1.8}
                  />
                </span>
                <span className="text-[15.5px] font-semibold leading-[1.35] text-ink">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {children}
    </div>
  );
}

function SpecTableView({
  cable,
  variant,
  table,
}: {
  cable: Cable;
  variant: CableVariant;
  table: { columns: string[]; rows: (string | null)[][] };
}) {
  const columnCount = table.columns.length;
  const minWidth = columnCount === 2 ? 400 : 140 + (columnCount - 1) * 100;
  const caption = `${cable.name} · ${variant.label}`;
  // Column proportions of the mockup grid: 2 cols 1fr/1.4fr, otherwise 1.3fr + 1fr each.
  const weights = table.columns.map((_, index) =>
    columnCount === 2 ? (index === 0 ? 1 : 1.4) : index === 0 ? 1.3 : 1,
  );
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const columnShares = weights.map((weight) => (weight / totalWeight) * 100);

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex justify-between gap-2.5 border-b border-line bg-page px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[1px] text-mute">
        <span>{caption}</span>
        <span>{table.rows.length} filas</span>
      </div>
      <div
        className="overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"
        role="region"
        aria-label={`Tabla técnica: ${caption}`}
        tabIndex={0}
      >
        <table className="sheet-table table-fixed [&_tbody_th]:shadow-none" style={{ minWidth }}>
          <colgroup>
            {table.columns.map((column, index) => (
              <col key={column} style={{ width: `${columnShares[index]}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${row[0] ?? "row"}-${rowIndex}`}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th key={cellIndex} scope="row">
                      {cell ?? "—"}
                    </th>
                  ) : (
                    <td key={cellIndex}>{cell ?? "—"}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
