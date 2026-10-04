"use client";

import { useQuote } from "@/components/quote/QuoteProvider";
import { Icon } from "@/components/ui/Icon";
import type { Cable } from "@/data/types";

/** "+ Cotizar" / "Agregado": both open the quantity modal (add or edit). */
export function QuoteButton({
  cable,
  className = "",
}: {
  cable: Cable;
  className?: string;
}) {
  const { hasItem, openQuantity } = useQuote();
  const added = hasItem(cable.id);

  return added ? (
    <button
      type="button"
      className={`btn btn-added ${className}`}
      onClick={() => openQuantity(cable.id)}
    >
      <Icon name="check" size={15} strokeWidth={2.6} />
      Agregado
      <span className="sr-only"> — editar cantidad de {cable.name}</span>
    </button>
  ) : (
    <button
      type="button"
      className={`btn btn-lime ${className}`}
      onClick={() => openQuantity(cable.id)}
    >
      + Cotizar<span className="sr-only"> {cable.name}</span>
    </button>
  );
}
