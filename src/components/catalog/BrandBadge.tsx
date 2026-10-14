import { brands } from "@/data/brands";
import type { Brand } from "@/data/types";

interface BrandBadgeProps {
  brand: Brand;
  /** `onDark` adapts the neutral badge to the navy header of the detail page. */
  onDark?: boolean;
  className?: string;
}

/**
 * Clean typographic badge for cards and compact lists.
 * Ensures 100% legibility and zero aspect-ratio distortion on any screen size.
 * INDECO is highlighted with navy fill and lime accents.
 */
export function BrandBadge({
  brand,
  onDark = false,
  className = "",
}: BrandBadgeProps) {
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

/**
 * Dedicated Brand Logo component for prominent display in technical sheets,
 * modals, or partner sections where the official logo is shown at high resolution.
 */
export function BrandLogo({
  brand,
  className = "",
  size = "md",
}: {
  brand: Brand;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const meta = brands[brand];
  const sizeClasses = {
    sm: "h-6 max-w-[90px]",
    md: "h-8 max-w-[120px]",
    lg: "h-11 max-w-[160px]",
  };
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xs border border-line-soft bg-white px-2.5 py-1 shadow-2xs ${className}`}
      title={meta.fullName}
    >
      <img
        src={meta.logo}
        alt={meta.logoAlt}
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}
