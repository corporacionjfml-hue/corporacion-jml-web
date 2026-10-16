"use client";

import Link from "next/link";
import { BrandBadge } from "@/components/catalog/BrandBadge";
import { useCableSheet } from "@/components/catalog/CableSheetProvider";
import { Icon } from "@/components/ui/Icon";
import { company, generalGreeting, whatsappUrl } from "@/data/company";
import { trackEvent } from "@/lib/analytics";
import { categoryColors } from "@/lib/catalog/categories";
import { findCable } from "@/lib/quote/catalog";
import { buildQuoteUrl, formatQuantity } from "@/lib/quote/message";
import { CallbackForm } from "./CallbackForm";
import { useQuote } from "./QuoteProvider";

const contactLink =
  "inline-flex min-h-11 items-center gap-2 text-on-navy-2 no-underline hover:text-white";

function QuoteList() {
  const { items, openQuantity, remove, buyerType } = useQuote();
  const sheet = useCableSheet();

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-3.5 rounded-2xl border-2 border-dashed border-white/30 p-[22px]">
        <span className="text-[18px] font-bold text-white">Tu lista está vacía</span>
        <span className="text-[15px] leading-[1.55] text-on-navy-2">
          Usa el asistente para saber qué cable necesitas, o toca “+ Cotizar” en cualquier cable
          del catálogo.
        </span>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/#asistente" className="btn btn-lime">
            Usar el asistente
          </Link>
          <Link href="/#catalogo" className="btn btn-wline">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((item) => {
          const cable = findCable(item.cableId);
          if (!cable) return null;
          return (
            <li
              key={item.cableId}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-white/15 bg-white/8 py-3.5 pl-4 pr-3.5"
            >
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-[3px]"
                style={{ background: categoryColors(cable.categoryId).fill }}
              />
              <button
                type="button"
                onClick={() => sheet.open(cable.id)}
                className="flex min-h-11 min-w-11 flex-1 basis-[160px] cursor-pointer flex-col justify-center gap-0.5 border-0 bg-transparent p-0 text-left font-[inherit] text-white"
              >
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[18px] font-extrabold">{cable.name}</span>
                  <BrandBadge brand={cable.brand} onDark />
                </span>
                <span className="text-[13px] text-on-navy-3">{cable.fullName}</span>
                <span className="sr-only"> (abrir ficha técnica)</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap rounded-full bg-white/12 px-3 py-1.5 font-mono text-[13.5px] font-semibold text-white">
                  {formatQuantity(item)}
                </span>
                <button
                  type="button"
                  onClick={() => openQuantity(cable.id)}
                  aria-label={`Editar cantidad de ${cable.name}`}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-white/25 bg-transparent px-3.5 text-[14px] font-bold text-white hover:bg-white/15"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(cable.id)}
                  aria-label={`Quitar ${cable.name} de la cotización`}
                  className="inline-flex size-11 cursor-pointer items-center justify-center rounded-sm border border-white/25 bg-transparent text-[20px] leading-none text-white hover:bg-white/15"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={buildQuoteUrl(items, buyerType)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-lime btn-lg text-[17px]"
          onClick={() =>
            trackEvent("quote_sent", {
              item_count: items.length,
              buyer_type: buyerType ?? "sin_definir",
            })
          }
        >
          <Icon name="whatsapp" size={22} />
          Enviar lista por WhatsApp
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <Link href="/#catalogo" className="btn btn-wline">
          Agregar más cables
        </Link>
      </div>
    </>
  );
}

export function QuoteSection() {
  return (
    <section id="cotizar" aria-label="Tu cotización" className="defer-render scroll-mt-20 pb-[88px] pt-14">
      <div className="wrap">
        <div className="relative grid grid-cols-1 gap-7 overflow-hidden rounded-band bg-navy p-[clamp(24px,4.5vw,56px)] lg:grid-cols-2">
          <div
            aria-hidden="true"
            className="absolute -left-[120px] -top-[120px] size-[320px] rounded-full bg-lime/14"
          />
          <div className="relative flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="kicker self-start text-lime-hover">Tu cotización</span>
              <h2 className="h2 text-white">Envíanos tu lista y te cotizamos hoy</h2>
              <p className="m-0 text-[17px] leading-[1.6] text-on-navy-2">
                Arma tu lista con el asistente o con el botón “+ Cotizar” de cada cable.{" "}
                {company.slogan}.
              </p>
            </div>
            <QuoteList />
            <ul className="m-0 flex list-none flex-wrap gap-x-[18px] gap-y-1 p-0 pt-2 text-[15px]">
              {company.phones.map((phone) => (
                <li key={phone.whatsapp}>
                  <a
                    href={whatsappUrl(phone.whatsapp, generalGreeting)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contactLink} font-bold text-white`}
                  >
                    <Icon name="phone" size={20} className="text-lime" strokeWidth={1.8} />
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={company.social.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`TikTok ${company.social.handle}`}
                  className={contactLink}
                >
                  <Icon name="tiktok" size={20} className="text-lime" strokeWidth={1.8} />
                  {company.social.handle}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className={contactLink}>
                  <Icon name="mail" size={20} className="text-lime" strokeWidth={1.8} />
                  {company.email}
                </a>
              </li>
              <li>
                <span className="inline-flex min-h-11 items-center gap-2 text-on-navy-2">
                  <Icon name="pin" size={20} className="text-lime" strokeWidth={1.8} />
                  {company.address}
                </span>
              </li>
            </ul>
          </div>
          <div className="relative min-w-0 rounded-card bg-white p-[clamp(20px,3vw,32px)]">
            <CallbackForm />
          </div>
        </div>
      </div>
    </section>
  );
}
