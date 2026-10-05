"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { cables, categories } from "@/data/cables";
import { categoryColors, categoryMeta } from "@/lib/catalog/categories";
import { filterCables } from "@/lib/catalog/search";
import { CableCard } from "./CableCard";
import { useCatalogFilter } from "./CatalogFilterProvider";

const COUNT_CLASS = "font-mono text-[12px]";

export function CatalogSection() {
  const { query, category, setQuery, setCategory, reset } = useCatalogFilter();

  // Chip counts reflect the search only, so users see where results live.
  const searched = useMemo(() => filterCables(cables, query, "all"), [query]);
  const counts = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const cable of searched) {
      byCategory.set(
        cable.categoryId,
        (byCategory.get(cable.categoryId) ?? 0) + 1,
      );
    }
    return byCategory;
  }, [searched]);
  const visible = useMemo(
    () =>
      category === "all"
        ? searched
        : searched.filter((cable) => cable.categoryId === category),
    [searched, category],
  );

  const resultText =
    visible.length === 1
      ? "1 cable encontrado"
      : `${visible.length} cables encontrados`;

  return (
    <section id="catalogo" className="defer-render scroll-mt-20 pb-10 pt-14">
      <div className="wrap flex flex-col gap-[26px]">
        <div className="flex max-w-[780px] flex-col gap-3.5">
          <span className="kicker self-start">Catálogo</span>
          <h2 className="h2">Encuentra tu cable y agrégalo a tu cotización</h2>
          <p className="m-0 text-[18px] leading-[1.6] text-mute">
            Busca, filtra y abre la ficha técnica. Con “+ Cotizar” armas tu
            lista para enviarla por WhatsApp.
          </p>
        </div>

        <div
          id="productos"
          className="sticky top-[78px] z-20 -mx-4 flex scroll-mt-[90px] flex-col gap-3.5 rounded-3xl bg-[rgba(244,246,241,.92)] p-4 backdrop-blur-[14px]"
        >
          <label htmlFor="catalog-search" className="sr-only">
            Buscar cable
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-[17px] top-[19px] inline-flex text-navy">
              <Icon name="search" />
            </span>
            <input
              id="catalog-search"
              type="search"
              className="search"
              placeholder="Buscar: halógenos, soldadura, 0.6/1 kV, NA2XY…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div
            role="group"
            aria-label="Filtrar por categoría"
            className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin]"
          >
            <button
              type="button"
              aria-pressed={category === "all"}
              className={`chip ${category === "all" ? "chip-on" : "chip-off"}`}
              onClick={() => setCategory("all")}
            >
              Todos
              {category === "all" ? (
                <span
                  className={`${COUNT_CLASS} rounded-full bg-lime px-2 py-0.5 text-ink`}
                >
                  {searched.length}
                </span>
              ) : (
                <span className={`${COUNT_CLASS} text-mute-2`}>
                  {searched.length}
                </span>
              )}
            </button>
            {categories.map((item) => {
              const active = category === item.id;
              const count = counts.get(item.id) ?? 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  className={`chip ${active ? "chip-on" : "chip-off"}`}
                  onClick={() => setCategory(item.id)}
                >
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ background: categoryColors(item.id).fill }}
                    />
                  )}
                  {categoryMeta[item.id].shortName}
                  {active ? (
                    <span
                      className={`${COUNT_CLASS} rounded-full bg-lime px-2 py-0.5 text-ink`}
                    >
                      {count}
                    </span>
                  ) : (
                    <span className={`${COUNT_CLASS} text-mute-2`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p
          className="m-0 text-[14.5px] font-medium text-mute"
          aria-live="polite"
        >
          {resultText}
        </p>

        {visible.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-[22px] p-0">
            {visible.map((cable) => (
              <li key={cable.id} className="flex *:w-full">
                <CableCard cable={cable} index={cables.indexOf(cable)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-tile border-2 border-dashed border-line-dashed bg-white px-6 py-11 text-center">
            <p className="m-0 text-[26px] font-extrabold text-ink">
              No encontramos ese cable… pero siempre hay opción
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <button type="button" className="btn btn-line" onClick={reset}>
                Limpiar filtros
              </button>
              <Link href="/#asistente" className="btn btn-navy">
                Usar el asistente
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
