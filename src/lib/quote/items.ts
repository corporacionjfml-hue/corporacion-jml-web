import { getUnit } from "@/data/cables";
import { findCable } from "./catalog";
import { clampQuantity, defaultQuantity } from "./rules";
import type { QuoteItem } from "./types";

/** Adds or replaces an item with a normalized quantity. Unknown cables are ignored. */
export function upsertItem(
  items: QuoteItem[],
  cableId: string,
  quantity?: number,
): QuoteItem[] {
  const cable = findCable(cableId);
  if (!cable) return items;
  const unit = getUnit(cable);
  const next: QuoteItem = {
    cableId,
    unit,
    quantity: quantity === undefined ? defaultQuantity(unit) : clampQuantity(quantity, unit),
  };
  return items.some((item) => item.cableId === cableId)
    ? items.map((item) => (item.cableId === cableId ? next : item))
    : [...items, next];
}

export function removeItem(items: QuoteItem[], cableId: string): QuoteItem[] {
  return items.filter((item) => item.cableId !== cableId);
}

/** Adds each cable with its default quantity, skipping the ones already present. */
export function addManyItems(items: QuoteItem[], cableIds: string[]): QuoteItem[] {
  return cableIds.reduce(
    (acc, id) => (acc.some((item) => item.cableId === id) ? acc : upsertItem(acc, id)),
    items,
  );
}
