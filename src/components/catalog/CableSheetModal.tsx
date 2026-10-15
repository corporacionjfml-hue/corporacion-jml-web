"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { categories } from "@/data/cables";
import { company, whatsappUrl } from "@/data/company";
import type { Cable } from "@/data/types";
import { categoryColors } from "@/lib/catalog/categories";
import { findCable } from "@/lib/quote/catalog";
import { BrandBadge } from "./BrandBadge";
import { CableSheetContent } from "./CableSheetContent";
import { QuoteButton } from "./QuoteButton";

const FOCUSABLE =
  "button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";

interface CableSheetModalProps {
  cableId: string;
  onClose: () => void;
}

/** Technical sheet dialog. Mounted by CableSheetProvider only while a cable is open. */
export function CableSheetModal({ cableId, onClose }: CableSheetModalProps) {
  const cable = findCable(cableId);
  if (!cable) return null;
  return <SheetDialog cable={cable} onClose={onClose} />;
}

function SheetDialog({
  cable,
  onClose,
}: {
  cable: Cable;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const category = categories.find((item) => item.id === cable.categoryId);
  const colors = categoryColors(cable.categoryId);

  // Scroll lock and focus management; restore both on unmount.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      // Never scroll the page back to the opener (e.g. after "Ir a mi cotización").
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const whatsappLink = whatsappUrl(
    company.quotesWhatsApp,
    `Hola ${company.tradeName}, quisiera cotizar el cable ${cable.name}.`,
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(20,38,58,.55)] backdrop-blur-[8px] md:items-center md:p-7"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-rise max-h-[94vh] w-full max-w-[1100px] overflow-y-auto rounded-t-panel bg-white shadow-panel outline-none md:rounded-panel"
      >
        <div className="sticky top-0 z-[2] flex items-start justify-between gap-4 border-b-[5px] border-lime bg-navy px-6 pb-5 pt-6">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="self-start rounded-full px-[11px] py-[5px] text-[12px] font-bold text-ink"
                style={{ background: colors.fill }}
              >
                {category?.name}
              </span>
              <BrandBadge brand={cable.brand} onDark />
            </div>
            <h2
              id={titleId}
              className="m-0 text-[clamp(28px,4.4vw,44px)] font-extrabold leading-none tracking-[-1px] text-white"
            >
              {cable.name}
            </h2>
            <p className="m-0 text-[15px] text-on-navy-2">{cable.fullName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha técnica"
            className="inline-flex size-[46px] shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/25 bg-white/12 text-white hover:bg-white/22"
          >
            <Icon name="close" />
          </button>
        </div>


        <CableSheetContent cable={cable} headingLevel="h3">
          <div className="flex flex-wrap gap-3 border-t border-line-soft pt-[22px]">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lime"
            >
              <Icon name="whatsapp" size={18} />
              Cotizar {cable.name} por WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            <QuoteButton cable={cable} />
            <Link
              href={`/cables/${cable.slug}/`}
              className="btn btn-line"
              onClick={onClose}
            >
              Ver página completa
            </Link>
            <Link href="/#cotizar" className="btn btn-line" onClick={onClose}>
              Ir a mi cotización
            </Link>
          </div>
        </CableSheetContent>
      </div>
    </div>
  );
}
