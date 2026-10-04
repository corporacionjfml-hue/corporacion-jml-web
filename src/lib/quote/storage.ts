import { getUnit } from "@/data/cables";
import { findCable } from "./catalog";
import { clampQuantity } from "./rules";
import type { BuyerType, QuoteItem } from "./types";

export const QUOTE_STORAGE_KEY = "jfsac.quote.v1";

export interface StoredQuote {
  items: QuoteItem[];
  buyerType: BuyerType | null;
}

export const EMPTY_QUOTE: StoredQuote = { items: [], buyerType: null };

export function isBuyerType(value: unknown): value is BuyerType {
  return value === "mayorista" || value === "minorista";
}

export function serializeQuote(quote: StoredQuote): string {
  return JSON.stringify({ v: 1, items: quote.items, buyerType: quote.buyerType });
}

/**
 * Reads persisted data defensively: corrupted JSON or wrong shapes yield an
 * empty quote; unknown cable ids and duplicates are dropped; quantities are
 * re-normalized and the unit always comes from the catalog.
 */
export function parseStoredQuote(raw: string | null): StoredQuote {
  if (!raw) return EMPTY_QUOTE;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_QUOTE;
  }
  if (typeof data !== "object" || data === null) return EMPTY_QUOTE;
  const record = data as Record<string, unknown>;
  const items: QuoteItem[] = [];
  if (Array.isArray(record.items)) {
    for (const entry of record.items) {
      if (typeof entry !== "object" || entry === null) continue;
      const { cableId, quantity } = entry as Record<string, unknown>;
      if (typeof cableId !== "string" || typeof quantity !== "number") continue;
      const cable = findCable(cableId);
      if (!cable || items.some((item) => item.cableId === cableId)) continue;
      const unit = getUnit(cable);
      items.push({ cableId, unit, quantity: clampQuantity(quantity, unit) });
    }
  }
  return { items, buyerType: isBuyerType(record.buyerType) ? record.buyerType : null };
}
