import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { company, generalGreeting, whatsappUrl } from "@/data/company";
import { navItems } from "./navItems";

const linkClass = "inline-flex min-h-11 items-center text-ink no-underline hover:text-lime-dark";

export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-white pb-8 pt-11">
      <div className="wrap grid grid-cols-1 gap-7 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <Link
            href="/"
            aria-label={`${company.name}, ir al inicio`}
            className="inline-flex min-h-11 items-center self-start text-[#1d1d1b] no-underline hover:text-[#1d1d1b]"
          >
            <Logo />
          </Link>
          <p className="m-0 max-w-[380px] text-[14.5px] leading-[1.6] text-mute">
            Distribución de cables y conductores eléctricos para proyectos de
            energía, construcción e industria.
          </p>
          <span className="self-start rounded-xs bg-lime px-3 py-1.5 text-[16px] font-extrabold text-ink">
            {company.slogan}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 text-[14.5px]">
          <span className="kicker mb-1.5">Navegación</span>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-0.5 text-[14.5px] text-ink">
          <span className="kicker mb-1.5">Contacto</span>
          <strong className="py-1 font-extrabold">{company.name}</strong>
          <span className="py-1">RUC: {company.ruc}</span>
          <span className="py-1">{company.address}</span>
          {company.phones.map((phone) => (
            <a
              key={phone.whatsapp}
              href={whatsappUrl(phone.whatsapp, generalGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {phone.display}
            </a>
          ))}
          <a href={`mailto:${company.email}`} className={linkClass}>
            {company.email}
          </a>
          {/* Social handle is provisional until the client confirms it. */}
          <span className="py-1">
            {company.social.handle}
            {company.social.pendingConfirmation && (
              <span className="text-mute-2"> (por confirmar)</span>
            )}
          </span>
        </div>
      </div>
      <div className="wrap mt-7 border-t border-line-soft pt-5 text-[12.5px] text-mute-2">
        © 2026 {company.name} · RUC {company.ruc} · Datos técnicos referenciales según fichas de fabricantes.
      </div>
    </footer>
  );
}
