"use client";

import { useQuote } from "@/components/quote/QuoteProvider";

// TODO(T4): remove these temporary buttons; the catalog cards open the modal.
export function QuoteDevButtons() {
  const { openQuantity } = useQuote();
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" className="btn btn-line" onClick={() => openQuantity("lsoh-90")}>
        + Cotizar LSOH-90+ (rollos)
      </button>
      <button type="button" className="btn btn-line" onClick={() => openQuantity("na2xy")}>
        + Cotizar NA2XY (metros)
      </button>
    </div>
  );
}
