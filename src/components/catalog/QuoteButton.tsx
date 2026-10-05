"use client";

import { useQuote } from "@/components/quote/QuoteProvider";
import { Icon } from "@/components/ui/Icon";
import type { Cable } from "@/data/types";

/** "+ Cotizar" / "Agregado": both open the quantity modal (add or edit). */
export function QuoteButton({
  cable,
  className = "",
  tone = "lime",
}: {
  cable: Cable;
  className?: string;
  /** "navy" is the compact toggle used in the assistant results (mockup `.tg-go`). */
  tone?: "lime" | "navy";
}) {
  const { hasItem, openQuantity } = useQuote();
  const added = hasItem(cable.id);
  const compact = tone === "navy" ? "gap-1.5 rounded-md shadow-none" : "";

  return added ? (
    <button
      type="button"
      className={`btn btn-added ${compact} ${className}`}
      onClick={() => openQuantity(cable.id)}
    >
      <Icon name="check" size={15} strokeWidth={2.6} />
      Agregado
      <span className="sr-only"> — editar cantidad de {cable.name}</span>
    </button>
  ) : (
    <button
      type="button"
      className={`btn ${
        tone === "navy"
          ? "border-2 border-navy bg-navy text-white shadow-none hover:border-lime hover:bg-lime hover:text-ink"
          : "btn-lime"
      } ${compact} ${className}`}
      onClick={() => openQuantity(cable.id)}
    >
      + Cotizar<span className="sr-only"> {cable.name}</span>
    </button>
  );
}
