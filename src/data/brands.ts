import type { Brand } from "./types";

export interface BrandMeta {
  label: string;
  /** Highlighted brand: rendered with a stronger visual treatment. */
  featured?: boolean;
}

/** Display order of the brand filter. */
export const brandOrder: Brand[] = ["INDECO", "COEPER", "CELSA"];

export const brands: Record<Brand, BrandMeta> = {
  COEPER: { label: "COEPER" },
  CELSA: { label: "CELSA" },
  INDECO: { label: "INDECO", featured: true },
};
