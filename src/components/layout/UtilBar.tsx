import { Icon } from "@/components/ui/Icon";
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
          <a
            href={company.social.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`TikTok ${company.social.handle}`}
            className="inline-flex items-center gap-1.5 text-on-navy no-underline hover:text-white"
          >
            <Icon name="tiktok" size={16} className="text-lime" />
            {company.social.handle}
          </a>
        </span>
      </div>
    </div>
  );
}
