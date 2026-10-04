export interface CompanyPhone {
  display: string;
  /** Digits with country code, for wa.me links. */
  whatsapp: string;
}

/**
 * PENDING DOMAIN. Documented placeholder used for canonical URLs, Open Graph
 * and the sitemap while NEXT_PUBLIC_SITE_URL is unset. It is intentionally
 * unresolvable (.invalid) so it can never be mistaken for a real site.
 */
export const PENDING_SITE_URL = "https://PENDING-DOMAIN.invalid";

/** Normalized origin (lowercase host, no trailing slash) or "" when unset or invalid. */
function readSiteOrigin(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

const configuredSiteUrl = readSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);

/** Absolute site origin without trailing slash. */
export const siteUrl: string = configuredSiteUrl || new URL(PENDING_SITE_URL).origin;
/** True only when a real domain was provided through NEXT_PUBLIC_SITE_URL. */
export const siteUrlConfigured: boolean = configuredSiteUrl !== "";

/** GA4 measurement id (G-XXXXXXX). Analytics is disabled while empty. */
export const gaId: string = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();

export const company = {
  name: "CORPORACION J & F SAC",
  slogan: "Siempre Hay Opción",
  ruc: "20614708002",
  address: "Av. Manuel del Valle 1523, Lima-Lurín",
  phones: [
    { display: "948 271 308", whatsapp: "51948271308" },
    { display: "923 441 594", whatsapp: "51923441594" },
  ] satisfies CompanyPhone[],
  email: "corporacionj@gmail.com",
  social: {
    handle: "@CorporacionJML",
    pendingConfirmation: true,
  },
  /** Quotes are always sent to this WhatsApp number. */
  quotesWhatsApp: "51948271308",
  /**
   * PENDING CLIENT SETUP. Contact-form delivery for the static site.
   * Leave `endpoint` empty until the client creates a free account with a form
   * backend (e.g. Web3Forms: "https://api.web3forms.com/submit" + `accessKey`,
   * or Formspree: "https://formspree.io/f/<id>", no key). Both are public
   * values by design. While `endpoint` is empty, the form falls back to opening
   * WhatsApp (quotes number) with the submitted data prefilled.
   */
  form: {
    endpoint: "" as string,
    accessKey: "" as string,
  },
} as const;

/** Builds a wa.me link for a number (digits with country code) and an optional message. */
export function whatsappUrl(number: string, text?: string): string {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Builds a tel: href from a number given as digits with country code. */
export function telHref(number: string): string {
  return `tel:+${number}`;
}

export const generalGreeting = `Hola ${company.name}, quisiera información sobre sus cables.`;
