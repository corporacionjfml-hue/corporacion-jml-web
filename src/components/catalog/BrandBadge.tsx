import { brands } from "@/data/brands";
import type { Brand } from "@/data/types";

interface BrandBadgeProps {
  brand: Brand;
  /** `onDark` adapts the neutral badge to the navy header of the detail page. */
  onDark?: boolean;
  className?: string;
}

/**
 * Text logo of a brand. The featured brand (INDECO) is filled and larger so it
 * stands out; the others are outlined and neutral.
 */
export function BrandBadge({ brand, onDark = false, className = "" }: BrandBadgeProps) {
  const meta = brands[brand];
  const base = "inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full font-mono uppercase";

  if (meta.featured) {
    return (
      <span
        className={`${base} bg-navy px-3.5 py-1.5 text-[14px] font-extrabold tracking-[1.6px] text-lime ring-2 ring-lime ${className}`}
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-lime" />
        <span className="sr-only">Marca: </span>
        {meta.label}
      </span>
    );
  }

  const tone = onDark
    ? "border-white/50 text-white"
    : "border-line-hover text-mute-3";
  return (
    <span
      className={`${base} border px-2.5 py-1 text-[11.5px] font-semibold tracking-[1.2px] ${tone} ${className}`}
    >
      <span className="sr-only">Marca: </span>
      {meta.label}
    </span>
  );
}
