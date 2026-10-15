import { Icon } from "@/components/ui/Icon";
import { company, whatsappUrl } from "@/data/company";
import { Assistant } from "./Assistant";
import { CableDiscs } from "./CableDiscs";

const quoteGreeting = `Hola ${company.name}, quisiera cotizar cables.`;

/** Trust row. The brands item names the client's three brands. */
const trustItems = [
  { title: "NTP · IEC · ASTM", detail: "Normas de fabricación" },
  { title: "COEPER · CELSA · INDECO", detail: "Marcas de confianza" },
  { title: "Fichas técnicas", detail: "Tablas por calibre" },
] as const;

export function Hero() {
  return (
    <section 
      id="asistente"
      aria-label="Presentación y asistente"
      className="relative scroll-mt-19.5 overflow-hidden bg-page"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(#E3E8ED 1px, transparent 1px), linear-gradient(90deg, #E3E8ED 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="wrap relative pb-20 pt-14">
        <div className="grid grid-cols-1 items-center gap-11 hero4:grid-cols-[1.05fr_.95fr] hero4:gap-14">
          <div className="flex flex-col gap-[26px]">
            <h1 className="h1 rise d1">
              Cables eléctricos de alta calidad <span className="mark">para cada proyecto</span>
            </h1>
            <p className="rise d2 m-0 max-w-[560px] text-[clamp(18px,2.1vw,21px)] leading-[1.55] text-mute">
              ¿No sabes qué cable usar? Responde tres preguntas, revisa la ficha técnica y pide
              tu cotización por WhatsApp.{" "}
              <strong className="font-extrabold text-navy">{company.slogan}.</strong>
            </p>
            <div className="rise d3 flex flex-wrap gap-3">
              <a href="#catalogo" className="btn btn-navy btn-lg px-7 text-[17px]">
                Ver catálogo <Icon name="arrow" size={16} strokeWidth={2.2} />
              </a>
              <a
                href={whatsappUrl(company.quotesWhatsApp, quoteGreeting)}
                target="_blank"
                rel="noopener"
                className="btn btn-lime btn-lg px-[26px] text-[17px]"
              >
                <Icon name="whatsapp" size={22} />
                Cotiza por WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </div>
            <ul className="rise d4 m-0 mt-2.5 grid max-w-[620px] list-none grid-cols-3 gap-3.5 border-t border-line p-0 pt-[22px]">
              {trustItems.map((item) => (
                <li key={item.title} className="flex flex-col gap-0.5">
                  <span className="text-[clamp(13.5px,3.6vw,16px)] font-extrabold text-navy">
                    {item.title}
                  </span>
                  <span className="text-[13px] text-mute-2">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rise d2 relative mx-auto w-full max-w-[560px]">
            <div
              aria-hidden="true"
              className="blob absolute -inset-x-[8%] -bottom-[8%] -top-[10%] bg-lime"
              style={{ borderRadius: "46% 54% 42% 58% / 52% 44% 56% 48%" }}
            />
            <CableDiscs className="spin absolute -bottom-20 -left-[70px] size-[200px]" />
            <div className="tag absolute -left-3.5 -top-[22px] z-[2] flex items-center gap-2 rounded-full bg-navy px-3.5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(20,38,58,0.6)]">
              <span aria-hidden="true" className="size-2 rounded-full bg-lime" />
              Te guiamos en 3 clics
            </div>
            <div className="relative z-[1]">
              <Assistant />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
