import type { IconName } from "@/components/ui/Icon";
import type { Cable, InstallationTag, PriorityTag } from "@/data/types";
import type { BuyerType } from "@/lib/quote/types";

/*
 * Pure logic for the 3-question assistant (buyer type -> installation place ->
 * priority). No React and no runtime imports so it can be checked with
 * `node --experimental-strip-types`.
 */

export type PlaceId =
  | "aerea"
  | "subterranea"
  | "edificios"
  | "industria"
  | "equipos"
  | "tierra";

export type PriorityId = "incendio" | "flexibilidad" | "resistencia" | "ninguna";

export interface BuyerOption {
  id: BuyerType;
  title: string;
  hint: string;
  icon: IconName;
}

export interface PlaceOption {
  id: PlaceId;
  title: string;
  hint: string;
  icon: IconName;
  /** A cable is a candidate when its `tags.installation` includes this tag. */
  tag: InstallationTag;
}

export interface PriorityOption {
  id: PriorityId;
  title: string;
  hint: string;
  icon: IconName;
  /** A candidate passes when it has any of these tags; `null` keeps every candidate. */
  tags: PriorityTag[] | null;
}

export const buyerOptions: BuyerOption[] = [
  {
    id: "mayorista",
    title: "Mayorista",
    hint: "Volumen para obra, reventa o distribución",
    icon: "boxes",
  },
  {
    id: "minorista",
    title: "Minorista",
    hint: "Cantidades menores para tu proyecto",
    icon: "bag",
  },
];

export const placeOptions: PlaceOption[] = [
  {
    id: "aerea",
    title: "Red aérea",
    hint: "Postes, vanos, electrificación",
    icon: "aerial",
    tag: "aerea",
  },
  {
    id: "subterranea",
    title: "Subterránea",
    hint: "Ductos o directamente enterrado",
    icon: "underground",
    tag: "subterranea",
  },
  {
    id: "edificios",
    title: "Edificios e interiores",
    hint: "Oficinas, hospitales, viviendas",
    icon: "building",
    tag: "interior",
  },
  {
    id: "industria",
    title: "Industria y talleres",
    hint: "Plantas, bombas, soldadura",
    icon: "industry",
    tag: "industrial",
  },
  {
    id: "equipos",
    title: "Equipos y vehículos",
    hint: "Herramientas, tableros, autos",
    icon: "vehicle",
    tag: "vehiculos",
  },
  {
    id: "tierra",
    title: "Puesta a tierra",
    hint: "Mallas y conexiones a tierra",
    icon: "ground",
    tag: "tierra",
  },
];

export const priorityOptions: PriorityOption[] = [
  {
    id: "incendio",
    title: "Seguridad ante incendio",
    hint: "Libre de halógenos, baja emisión de humos",
    icon: "fire",
    tags: ["seguridad-incendio"],
  },
  {
    id: "flexibilidad",
    title: "Flexibilidad",
    hint: "Movimiento, vibración, equipos portátiles",
    icon: "wave",
    tags: ["flexibilidad"],
  },
  {
    id: "resistencia",
    title: "Resistencia",
    hint: "Intemperie, abrasión, esfuerzo mecánico",
    icon: "shield",
    tags: ["intemperie", "resistencia-mecanica"],
  },
  {
    id: "ninguna",
    title: "Sin preferencia",
    hint: "Muéstrame todas las opciones",
    icon: "bolt",
    tags: null,
  },
];

export function findPlace(id: PlaceId): PlaceOption {
  const option = placeOptions.find((place) => place.id === id);
  if (!option) throw new Error(`Unknown place: ${id}`);
  return option;
}

export function findPriority(id: PriorityId): PriorityOption {
  const option = priorityOptions.find((priority) => priority.id === id);
  if (!option) throw new Error(`Unknown priority: ${id}`);
  return option;
}

/**
 * Step-2 candidates: every cable installable in the chosen place, in catalog
 * order. Defensive: when no cable carries the tag, the whole catalog is
 * returned so the assistant never dead-ends on an empty list.
 */
export function getPlaceCandidates(cables: readonly Cable[], placeId: PlaceId): Cable[] {
  const { tag } = findPlace(placeId);
  const tagged = cables.filter((cable) => cable.tags.installation.includes(tag));
  return tagged.length > 0 ? tagged : [...cables];
}

export interface Recommendation {
  cables: Cable[];
  /** True when no candidate met the priority and the step-2 candidates are shown instead. */
  fallback: boolean;
}

/**
 * Narrows the place candidates by priority; falls back to all of them when none
 * match. `getPlaceCandidates` already guarantees a non-empty list for a
 * non-empty catalog.
 */
export function getRecommendation(
  cables: readonly Cable[],
  placeId: PlaceId,
  priorityId: PriorityId,
): Recommendation {
  const candidates = getPlaceCandidates(cables, placeId);
  const { tags } = findPriority(priorityId);
  if (tags === null) return { cables: candidates, fallback: false };
  const matching = candidates.filter((cable) =>
    cable.tags.priority.some((tag) => tags.includes(tag)),
  );
  return matching.length > 0
    ? { cables: matching, fallback: false }
    : { cables: candidates, fallback: true };
}

export type AssistantStep = "buyer" | "place" | "priority" | "result";

/** The step is derived from the answers; a known buyer type skips question 1. */
export function getStep(
  buyer: BuyerType | null,
  place: PlaceId | null,
  priority: PriorityId | null,
): AssistantStep {
  if (!buyer) return "buyer";
  if (!place) return "place";
  if (!priority) return "priority";
  return "result";
}

/** 1-based number of the active question, or 4 for the result. */
export const stepNumber: Record<AssistantStep, number> = {
  buyer: 1,
  place: 2,
  priority: 3,
  result: 4,
};
