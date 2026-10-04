import type { QuantityUnit } from "@/data/types";

export type BuyerType = "mayorista" | "minorista";

export interface QuoteItem {
  cableId: string;
  quantity: number;
  unit: QuantityUnit;
}

/** Optional contact details appended to the WhatsApp message when provided. */
export interface QuoteExtras {
  name?: string;
  city?: string;
  details?: string;
}
