import { company, siteUrl, siteUrlConfigured } from "@/data/company";
import type { Cable } from "@/data/types";

const MAX_TITLE = 70;
const MAX_DESCRIPTION = 155;

/** Cuts text at a word boundary and appends an ellipsis when it exceeds `max`. */
export function truncateText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s,;:.\-—]+$/, "")}…`;
}

/** Path with trailing slash (the site exports with trailingSlash). */
export function cablePath(cable: Pick<Cable, "slug">): string {
  return `/cables/${cable.slug}/`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}

/**
 * Drops a leading "Cable X —" segment of the full name when it only repeats the
 * cable name and the rest still reads on its own.
 */
function stripRepeatedName(cable: Cable): string {
  const [first, ...rest] = cable.fullName.split(" — ");
  const tail = rest.join(" — ");
  const token = cable.name
    .split(" ")
    .find((word) => word.length >= 4 && word.toLowerCase() !== "cable");
  const repeats = token ? first.toLowerCase().includes(token.toLowerCase()) : false;
  return repeats && tail.length >= 10 ? tail : cable.fullName;
}

/** "{name} — {fullName} | BRAND", shortening the full name so the title fits ~70 chars. */
export function buildCableTitle(cable: Cable): string {
  const suffix = ` | ${company.name}`;
  const full = `${cable.name} — ${cable.fullName}${suffix}`;
  if (full.length <= MAX_TITLE) return full;
  const detail = stripRepeatedName(cable);
  const room = MAX_TITLE - suffix.length - cable.name.length - 3;
  if (room < 12) return `${cable.name}${suffix}`;
  return `${cable.name} — ${truncateText(detail, room)}${suffix}`;
}

export function buildCableDescription(cable: Cable): string {
  return truncateText(cable.description, MAX_DESCRIPTION);
}

/** Serializes JSON-LD safely for an inline script (escapes "<"). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbJsonLd(cable: Cable) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: absoluteUrl("/#catalogo") },
      { "@type": "ListItem", position: 3, name: cable.name, item: absoluteUrl(cablePath(cable)) },
    ],
  };
}

/**
 * LocalBusiness for the home page. The website `url` is only emitted when a
 * real domain is configured; the placeholder domain must never leak into it.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    slogan: company.slogan,
    taxID: company.ruc,
    description:
      "Distribución de cables y conductores eléctricos para proyectos de energía, construcción e industria.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Manuel del Valle 1523",
      addressLocality: "Lurín",
      addressRegion: "Lima",
      addressCountry: "PE",
    },
    telephone: company.phones.map((phone) => `+${phone.whatsapp}`),
    email: company.email,
    ...(siteUrlConfigured ? { url: siteUrl } : {}),
  };
}
