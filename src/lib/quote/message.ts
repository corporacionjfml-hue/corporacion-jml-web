import { brands } from "@/data/brands";
import { company, whatsappUrl } from "@/data/company";
import { findCable } from "./catalog";
import type { BuyerType, QuoteExtras, QuoteItem } from "./types";

export function formatQuantity(item: QuoteItem): string {
  const label = item.unit === "rollos" && item.quantity === 1 ? "rollo" : item.unit;
  return `${item.quantity} ${label}`;
}

/**
 * Builds the WhatsApp quote text. Lines for name/city/details are added after
 * a blank line, only when provided. The buyer parenthesis is omitted when unset.
 */
export function buildQuoteMessage(
  items: QuoteItem[],
  buyerType: BuyerType | null,
  extras: QuoteExtras = {},
): string {
  const buyer = buyerType ? ` (compra ${buyerType})` : "";
  const lines = [`Hola ${company.tradeName}, quisiera cotizar${buyer}:`];
  for (const item of items) {
    const cable = findCable(item.cableId);
    const name = cable ? `${cable.name} (${brands[cable.brand].label})` : item.cableId;
    lines.push(`- ${name}: ${formatQuantity(item)}`);
  }
  const extraLines = [
    ["Nombre", extras.name],
    ["Ciudad", extras.city],
    ["Detalle", extras.details],
  ]
    .map(([label, value]) => [label, value?.trim()] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);
  if (extraLines.length > 0) lines.push("", ...extraLines);
  return lines.join("\n");
}

export function buildQuoteUrl(
  items: QuoteItem[],
  buyerType: BuyerType | null,
  extras?: QuoteExtras,
): string {
  return whatsappUrl(company.quotesWhatsApp, buildQuoteMessage(items, buyerType, extras));
}
