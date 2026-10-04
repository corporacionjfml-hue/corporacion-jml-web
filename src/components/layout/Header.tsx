"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { company } from "@/data/company";
import { navItems } from "./navItems";

interface HeaderProps {
  /** Overrides the live quote count (mainly for tests/previews). */
  quoteCount?: number;
}

export function Header({ quoteCount: quoteCountOverride }: HeaderProps) {
  const { count } = useQuote();
  const quoteCount = quoteCountOverride ?? count;
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/92 backdrop-blur-[16px]">
      <div className="wrap flex min-h-[78px] items-center justify-between gap-4 max-[419px]:gap-2 max-[419px]:px-3.5">
        <Link
          href="/"
          aria-label={`${company.name}, ir al inicio`}
          className="inline-flex min-h-11 items-center text-[#1d1d1b] no-underline hover:text-[#1d1d1b]"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1.5 lg:flex"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="navlink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 max-[419px]:gap-1.5">
          <Link
            href="/#cotizar"
            className="btn btn-lime pulse relative min-h-[46px] gap-2 whitespace-nowrap px-3.5 max-[419px]:px-3"
          >
            Cotizar
            {quoteCount > 0 && (
              <span
                className="badge max-[419px]:absolute max-[419px]:-right-2 max-[419px]:-top-2"
                aria-label={`${quoteCount} en tu cotización`}
              >
                {quoteCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="iconbtn lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id={menuId}
          aria-label="Menú móvil"
          className="flex flex-col border-t border-line-soft bg-white px-[18px] pb-[18px] pt-2 lg:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="navlink !px-2 !py-3.5 !text-[18px]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
