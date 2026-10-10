import { company, generalGreeting, whatsappUrl } from "@/data/company";

/** Top info bar, only from 768px. No website link by project decision. */
export function UtilBar() {
  const phone = company.phones[0];
  return (
    <div className="hidden bg-navy text-[13.5px] text-on-navy md:block">
      <div className="wrap flex min-h-10 items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
          {company.slogan} — te ayudamos a elegir el cable correcto
        </span>
        <span className="flex gap-[22px]">
          <a
            href={whatsappUrl(phone.whatsapp, generalGreeting)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white no-underline hover:text-white"
          >
            {phone.display}
          </a>
          {/* Social handle is provisional until the client confirms it. */}
          <span>{company.social.handle}</span>
        </span>
      </div>
    </div>
  );
}
