import { categories } from "@/data/cables";
import type { Cable, CategoryId } from "@/data/types";
import { categoryMeta } from "./categories";

export type CategoryFilter = CategoryId | "all";

/** Lowercase and strip diacritics so "halogenos" matches "Halógenos". */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const categoryById = new Map(
  categories.map((category) => [category.id, category]),
);

function buildHaystack(cable: Cable): string {
  const category = categoryById.get(cable.categoryId);
  const parts: (string | undefined)[] = [
    cable.name,
    cable.fullName,
    category?.name,
    category?.description,
    categoryMeta[cable.categoryId].shortName,
    cable.description,
    cable.voltage,
    cable.manufacturer,
    cable.gaugeRange,
    cable.temperature?.operation,
    cable.temperature?.emergency,
    cable.temperature?.shortCircuit,
    cable.unit,
    ...cable.standards,
    ...(cable.certificates ?? []),
    ...cable.construction,
    ...cable.applications,
    ...cable.features,
    ...cable.tags.installation,
    ...cable.tags.priority,
  ];
  for (const variant of cable.variants) {
    parts.push(
      variant.label,
      variant.description,
      ...(variant.applications ?? []),
      ...(variant.notes ?? []),
    );
    if (variant.tableStatus === "available")
      parts.push(...variant.table.columns);
  }
  // Hyphens are also searchable as spaces ("seguridad incendio" finds "seguridad-incendio").
  const text = normalizeText(parts.filter(Boolean).join(" "));
  return `${text} ${text.replace(/-/g, " ")}`;
}

const haystacks = new Map<string, string>();

function haystackOf(cable: Cable): string {
  let value = haystacks.get(cable.id);
  if (value === undefined) {
    value = buildHaystack(cable);
    haystacks.set(cable.id, value);
  }
  return value;
}

/** Every whitespace-separated term of the query must appear somewhere in the cable's text. */
export function matchesQuery(cable: Cable, query: string): boolean {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = haystackOf(cable);
  return terms.every((term) => haystack.includes(term));
}

export function filterCables(
  list: Cable[],
  query: string,
  category: CategoryFilter,
): Cable[] {
  return list.filter(
    (cable) =>
      (category === "all" || cable.categoryId === category) &&
      matchesQuery(cable, query),
  );
}
