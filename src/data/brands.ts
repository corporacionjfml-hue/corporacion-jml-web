import type { Brand } from "./types";

export interface BrandMeta {
  label: string;
  fullName: string;
  logo: string;
  logoAlt: string;
  /** Highlighted brand: rendered with a stronger visual treatment. */
  featured?: boolean;
}

/** Display order of the brand filter. */
export const brandOrder: Brand[] = ["INDECO", "COEPER", "CELSA"];

export const brands: Record<Brand, BrandMeta> = {
  COEPER: {
    label: "COEPER",
    fullName: "COEPER CABLE",
    logo: "/images/brands/coeper.svg",
    logoAlt: "Logo oficial COEPER CABLE",
  },
  CELSA: {
    label: "CELSA",
    fullName: "CELSA Conductores Eléctricos",
    logo: "/images/brands/celsa.svg",
    logoAlt: "Logo oficial CELSA Conductores Eléctricos",
  },
  INDECO: {
    label: "INDECO",
    fullName: "INDECO by Nexans",
    logo: "/images/brands/indeco.svg",
    logoAlt: "Logo oficial INDECO by Nexans",
    featured: true,
  },
};
