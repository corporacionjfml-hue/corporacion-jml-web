"use client";

import { Icon } from "@/components/ui/Icon";
import type { Cable } from "@/data/types";
import { categoryColors, categoryMeta } from "@/lib/catalog/categories";
import {
  featureIcon,
  formatIndex,
  getCardFeatures,
  getRangeLabel,
} from "@/lib/catalog/display";
import { CableSectionArt } from "./CableSectionArt";
import { useCableSheet } from "./CableSheetProvider";
import { QuoteButton } from "./QuoteButton";

const SPEC_LABEL =
  "font-mono text-[10.5px] uppercase tracking-[1.2px] text-mute-2";
const SPEC_VALUE = "mt-[3px] text-[18px] font-extrabold text-navy";

export function CableCard({ cable, index }: { cable: Cable; index: number }) {
  const { open } = useCableSheet();
  const colors = categoryColors(cable.categoryId);
  const meta = categoryMeta[cable.categoryId];
  const features = getCardFeatures(cable);

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow,border-color] duration-[350ms] ease-design hover:border-line-hover hover:shadow-card-hover motion-safe:hover:-translate-y-2">
      <div
        className="relative flex min-h-[124px] items-center justify-between px-5 py-[18px]"
        style={{ background: colors.bg }}
      >
        <div className="flex flex-col gap-2">
          <span
            aria-hidden="true"
            className="font-mono text-[44px] font-semibold leading-none opacity-90"
            style={{ color: colors.fg }}
          >
            {formatIndex(index)}
          </span>
          <span
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-2.5 py-[5px] text-[12px] font-bold"
            style={{ color: colors.fg }}
          >
            <Icon name={meta.icon} size={15} strokeWidth={1.8} />
            {meta.shortName}
          </span>
        </div>
        <div className="transition-transform duration-700 ease-design motion-safe:group-hover:rotate-[60deg] motion-safe:group-hover:scale-[1.08]">
          <CableSectionArt fill={colors.fill} />
        </div>
      </div>

      <div className="flex grow flex-col gap-4 px-5 pb-[22px] pt-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="m-0 text-[28px] font-extrabold leading-[1.05] tracking-[-0.5px] text-ink">
            {cable.name}
          </h3>
          <p className="m-0 line-clamp-3 text-[14px] leading-[1.45] text-mute">
            {cable.description}
          </p>
        </div>

        <dl className="m-0 grid grid-cols-2 overflow-hidden rounded-lg border border-line-soft">
          <div className="border-r border-line-soft px-3.5 py-3">
            <dt className={SPEC_LABEL}>Tensión</dt>
            <dd className={`m-0 ${SPEC_VALUE}`}>
              {cable.voltage ?? "Consultar"}
            </dd>
          </div>
          <div className="px-3.5 py-3">
            <dt className={SPEC_LABEL}>T° operación</dt>
            <dd className={`m-0 ${SPEC_VALUE}`}>
              {cable.temperature?.operation ?? "Consultar"}
            </dd>
          </div>
          <div className="col-span-full flex justify-between gap-2.5 border-t border-line-soft bg-field px-3.5 py-2.5 text-[13px]">
            <dt className="text-mute-2">Rango</dt>
            <dd className="m-0 text-right font-mono font-semibold text-ink">
              {getRangeLabel(cable)}
            </dd>
          </div>
        </dl>

        {features.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {features.map((text) => (
              <li
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full bg-chip px-2.5 py-1.5 text-[12.5px] font-medium text-mute-3"
              >
                <span className="inline-flex text-lime-dark">
                  <Icon name={featureIcon(text)} size={14} strokeWidth={1.8} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => open(cable.id)}
            className="btn min-h-12 bg-navy px-3 text-[15px] text-white group-hover:bg-lime group-hover:text-ink"
          >
            Ver ficha<span className="sr-only"> de {cable.name}</span>
          </button>
          <QuoteButton
            cable={cable}
            className="min-h-12 w-full px-2.5 text-[15px]"
          />
        </div>
      </div>
    </article>
  );
}
