"use client";

import { Icon } from "@/components/ui/Icon";
import { categories, getCablesByCategory } from "@/data/cables";
import { categoryColors, categoryMeta } from "@/lib/catalog/categories";
import { useCatalogFilter } from "./CatalogFilterProvider";

export function CategoriesSection() {
  const { jumpToCategory } = useCatalogFilter();

  return (
    <section id="categorias" className="scroll-mt-20 pb-10 pt-16">
      <div className="wrap flex flex-col gap-9">
        <div className="flex max-w-[780px] flex-col gap-3.5">
          <span className="kicker self-start">Categorías</span>
          <h2 className="h2">Explora por tipo de instalación</h2>
          <p className="m-0 text-[18px] leading-[1.6] text-mute">
            Cinco familias de cables para distribución aérea, subterránea,
            instalaciones interiores y usos especiales.
          </p>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 bento:grid-cols-2 bento3:grid-cols-3">
          {categories.map((category, index) => {
            const colors = categoryColors(category.id);
            const meta = categoryMeta[category.id];
            const members = getCablesByCategory(category.id);
            return (
              <li
                key={category.id}
                className={index === 0 ? "bento3:row-span-2" : undefined}
              >
                <a
                  href="#productos"
                  onClick={(e) => {
                    e.preventDefault();
                    jumpToCategory(category.id);
                  }}
                  className="group relative flex h-full min-h-[220px] flex-col justify-between gap-[26px] overflow-hidden rounded-tile border border-line bg-white p-[26px] text-ink no-underline transition-[translate,box-shadow,border-color] duration-300 [transition-timing-function:var(--ease-design),ease,ease] hover:border-navy hover:text-ink hover:shadow-tile-hover motion-safe:hover:-translate-y-1.5"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 size-[170px] rounded-full"
                    style={{ background: colors.bg }}
                  />
                  <div className="relative flex items-start justify-between">
                    <span
                      className="inline-flex size-[58px] items-center justify-center rounded-[16px] text-ink"
                      style={{ background: colors.fill }}
                    >
                      <Icon name={meta.icon} size={28} strokeWidth={1.8} />
                    </span>
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-white text-navy transition-all duration-300 group-hover:bg-navy group-hover:text-lime motion-safe:group-hover:-rotate-45">
                      <Icon name="arrow" size={16} strokeWidth={2.2} />
                    </span>
                  </div>
                  <div className="relative flex flex-col gap-2">
                    <span
                      className="font-mono text-[13px] font-semibold"
                      style={{ color: colors.fg }}
                    >
                      {members.length} {members.length === 1 ? "tipo" : "tipos"}
                    </span>
                    <span className="text-[27px] font-extrabold leading-[1.05] tracking-[-0.5px]">
                      {meta.shortName}
                    </span>
                    <span className="text-[14.5px] leading-[1.5] text-mute">
                      {members.map((cable) => cable.name).join(" · ")}
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
