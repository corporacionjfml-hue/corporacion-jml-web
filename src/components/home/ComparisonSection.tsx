"use client";

import { useCableSheet } from "@/components/catalog/CableSheetProvider";
import { Icon } from "@/components/ui/Icon";
import { cables } from "@/data/cables";
import { categoryColors, categoryMeta } from "@/lib/catalog/categories";
import { MISSING, toComparisonRow } from "@/lib/catalog/comparison";

const rows = cables.map(toComparisonRow);

/** Column header plus a minimum width so the 1330px table keeps the design proportions. */
const COLUMNS = [
  { label: "Cable", width: 150 },
  { label: "Categoría", width: 150 },
  { label: "Tensión", width: 110 },
  { label: "T° op.", width: 96 },
  { label: "Cortocircuito", width: 110 },
  { label: "Rango", width: 190 },
  { label: "Libre halóg.", width: 96 },
  { label: "Flexible", width: 86 },
  { label: "Uso principal", width: 240 },
] as const;

function Cell({ value }: { value: string }) {
  return value === MISSING ? (
    <span className="text-dash" aria-label="No disponible">
      {MISSING}
    </span>
  ) : (
    <>{value}</>
  );
}

function Flag({ on, label }: { on: boolean; label: string }) {
  return on ? (
    <span className="inline-flex text-lime-dark">
      <Icon name="check" size={18} strokeWidth={2.6} />
      <span className="sr-only">Sí, {label}</span>
    </span>
  ) : (
    <span className="text-dash" aria-label={`No, ${label}`}>
      {MISSING}
    </span>
  );
}

export function ComparisonSection() {
  const { open } = useCableSheet();

  return (
    <section id="comparativa" className="scroll-mt-20 pb-10 pt-[72px]">
      <div className="wrap flex flex-col gap-[30px]">
        <div className="flex max-w-[780px] flex-col gap-3.5">
          <span className="kicker self-start">Comparativa</span>
          <h2 className="h2">Los {cables.length} cables, lado a lado</h2>
          <p className="m-0 text-[18px] leading-[1.6] text-mute">
            Tensión, temperatura, rango de calibres y propiedades clave. Toca el nombre para abrir
            la ficha completa.
          </p>
        </div>

        <div className="-mb-3.5 text-[13.5px] font-semibold text-mute min-[1410px]:hidden">
          Desliza la tabla para ver más →
        </div>
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-table">
          <div
            role="region"
            aria-label="Tabla comparativa de cables, se desplaza horizontalmente"
            tabIndex={0}
            className="overflow-x-auto [scrollbar-width:thin]"
          >
            {/* `relative` keeps sr-only descendants inside the scroller (absolute children escape its clipping otherwise). */}
            <table className="sheet-table relative min-w-[1330px]">
              <caption className="sr-only">
                Comparativa de los {cables.length} cables: categoría, tensión, temperatura de
                operación, cortocircuito, rango de calibres, libre de halógenos, flexibilidad y
                uso principal.
              </caption>
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <th
                      key={column.label}
                      scope="col"
                      style={{ minWidth: column.width }}
                      className="text-left"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const { cable } = row;
                  const colors = categoryColors(cable.categoryId);
                  return (
                    <tr key={cable.id}>
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => open(cable.id)}
                          className="min-h-11 cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[15.5px] font-extrabold text-navy underline decoration-lime decoration-[3px] underline-offset-[5px]"
                        >
                          {cable.name}
                          <span className="sr-only"> (abrir ficha técnica)</span>
                        </button>
                      </th>
                      <td>
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[13px] font-semibold"
                          style={{ background: colors.bg, color: colors.fg }}
                        >
                          {categoryMeta[cable.categoryId].shortName}
                        </span>
                      </td>
                      <td>
                        <Cell value={row.voltage} />
                      </td>
                      <td>
                        <Cell value={row.operationTemp} />
                      </td>
                      <td>
                        <Cell value={row.shortCircuit} />
                      </td>
                      <td>
                        <Cell value={row.range} />
                      </td>
                      <td>
                        <Flag on={row.halogenFree} label="libre de halógenos" />
                      </td>
                      <td>
                        <Flag on={row.flexible} label="flexible" />
                      </td>
                      <td className="font-sans text-[14px]">
                        <Cell value={row.mainUse} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
