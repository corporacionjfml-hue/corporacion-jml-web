"use client";

import Link from "next/link";
import { useQuote } from "./QuoteProvider";

export function QuoteTray() {
  const { trayVisible, count } = useQuote();
  if (!trayVisible) return null;

  return (
    <div className="animate-rise fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-3.5 rounded-full bg-ink py-2 pl-4 pr-2 text-[13.5px] font-semibold text-white shadow-tray md:inset-x-0 md:bottom-[18px] md:mx-auto md:w-max md:max-w-[calc(100%-24px)] md:whitespace-nowrap md:py-2.5 md:pl-[18px] md:pr-2.5 md:text-[14.5px]">
      <span role="status">
        {count === 1 ? "1 cable en tu cotización" : `${count} cables en tu cotización`}
      </span>
      <Link
        href="/#cotizar"
        className="btn btn-lime min-h-[42px] shrink-0 rounded-full px-4 text-[14.5px]"
      >
        Enviar cotización
      </Link>
    </div>
  );
}
