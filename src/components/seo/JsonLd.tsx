import { serializeJsonLd } from "@/lib/seo/seo";

/** Inline JSON-LD script (server component). */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
