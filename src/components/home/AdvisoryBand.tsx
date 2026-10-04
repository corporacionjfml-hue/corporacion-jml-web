import { Icon } from "@/components/ui/Icon";
import { company, whatsappUrl } from "@/data/company";

const [primaryPhone] = company.phones;

export function AdvisoryBand() {
  return (
    <section aria-label="Asesoría" className="py-12">
      <div className="wrap">
        <div className="relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-band bg-lime p-[clamp(28px,5vw,56px)] band:grid-cols-[1.4fr_auto]">
          <div
            aria-hidden="true"
            className="absolute -bottom-[120px] -right-20 size-[360px] rounded-full border-[50px] border-navy/12"
          />
          <div className="relative flex flex-col gap-3">
            <span className="font-mono text-[13px] font-semibold uppercase tracking-[2px] text-ink">
              ¿No sabes qué cable necesitas?
            </span>
            <h2 className="m-0 text-[clamp(34px,5.4vw,64px)] font-black leading-[0.98] tracking-[-2px] text-ink">
              {company.slogan}.
            </h2>
            <p className="m-0 max-w-[560px] text-[18px] leading-normal text-[#1e3a20]">
              El asistente te recomienda el cable en tres clics. Luego lo agregas a tu cotización
              y nos la envías.
            </p>
          </div>
          <div className="relative flex flex-col gap-2.5">
            <a href="#asistente" className="btn btn-navy min-h-[62px] px-[30px] text-lg">
              Usar el asistente <Icon name="arrow" size={16} strokeWidth={2.2} />
            </a>
            <a
              href={whatsappUrl(company.quotesWhatsApp)}
              target="_blank"
              rel="noopener"
              className="btn border-2 border-ink bg-transparent text-ink hover:text-ink"
            >
              <Icon name="whatsapp" size={18} />
              <span className="sr-only">WhatsApp </span>
              {primaryPhone.display}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
