"use client";

import { useEffect, useId, useRef, useState } from "react";
import { company, generalGreeting, whatsappUrl } from "@/data/company";

interface WhatsAppBubbleProps {
  /** Lifts the bubble above the mobile quote tray (<768px). Wired in T3. */
  raised?: boolean;
}

export function WhatsAppBubble({ raised = false }: WhatsAppBubbleProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`group fixed right-5 z-[55] flex flex-col items-end gap-3 md:bottom-5 ${
        raised ? "bottom-[84px]" : "bottom-5"
      }`}
    >
      {open && (
        <div
          id={popoverId}
          role="group"
          aria-label="Elige un número de WhatsApp"
          className="w-[260px] max-w-[calc(100vw-40px)] rounded-2xl border border-line bg-white p-3 shadow-wa-tip"
        >
          <p className="m-0 px-2 pb-2 pt-1 text-[13.5px] font-semibold text-mute-2">
            ¿Con qué número quieres escribir?
          </p>
          {company.phones.map((phone) => (
            <a
              key={phone.whatsapp}
              href={whatsappUrl(phone.whatsapp, generalGreeting)}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-md px-2 text-[16px] font-bold text-ink no-underline hover:bg-lime-soft hover:text-ink"
            >
              <span className="size-2.5 rounded-full bg-whatsapp" aria-hidden="true" />
              {phone.display}
            </a>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5">
        {!open && (
          <span className="hidden whitespace-nowrap rounded-md bg-white px-3.5 py-2.5 text-[14px] font-semibold text-ink shadow-wa-tip band:group-hover:block band:group-focus-within:block">
            ¿Te ayudamos? Escríbenos
          </span>
        )}
        <button
          ref={buttonRef}
          type="button"
          aria-label="Escríbenos por WhatsApp"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onClick={() => setOpen((v) => !v)}
          className="wa-btn inline-flex size-[60px] cursor-pointer items-center justify-center rounded-full border-0 bg-whatsapp p-0 shadow-wa transition-transform duration-200 hover:scale-[1.07]"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
            <path d="M9 10c.5 2 2 3.5 4 4l1.2-1.2 2 1-.5 1.7c-3.5.3-7-3.2-6.7-6.7l1.7-.5 1 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
