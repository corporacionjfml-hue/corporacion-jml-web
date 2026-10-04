import type { IconName } from "@/components/ui/Icon";
import type { CategoryId } from "@/data/types";

interface CategoryMeta {
  /** Short label used by tiles, chips and card pills. */
  shortName: string;
  icon: IconName;
}

export const categoryMeta: Record<CategoryId, CategoryMeta> = {
  autosoportados: { shortName: "Autosoportados", icon: "aerial" },
  "conductores-aluminio": {
    shortName: "Conductores de Aluminio",
    icon: "tower",
  },
  "distribucion-subterranea": {
    shortName: "Subterráneos",
    icon: "underground",
  },
  "baja-tension": { shortName: "Baja Tensión", icon: "plug" },
  especiales: { shortName: "Especiales", icon: "bolt" },
};

/** CSS custom properties (declared in globals.css) for a category's colors. */
export function categoryColors(id: CategoryId) {
  return {
    fg: `var(--color-cat-${id}-fg)`,
    bg: `var(--color-cat-${id}-bg)`,
    fill: `var(--color-cat-${id}-fill)`,
  };
}
