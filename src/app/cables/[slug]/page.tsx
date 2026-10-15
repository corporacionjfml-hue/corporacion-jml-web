import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CableSheetContent } from "@/components/catalog/CableSheetContent";
import { BrandBadge } from "@/components/catalog/BrandBadge";
import { QuoteButton } from "@/components/catalog/QuoteButton";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { cables, categories, getCableBySlug } from "@/data/cables";
import { company, whatsappUrl } from "@/data/company";
import type { Cable } from "@/data/types";
import { categoryColors, categoryMeta } from "@/lib/catalog/categories";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildCableDescription,
  buildCableTitle,
  cablePath,
} from "@/lib/seo/seo";

type CablePageProps = { params: Promise<{ slug: string }> };

// Only the slugs below exist; anything else is a 404 (static export).
export const dynamicParams = false;

export function generateStaticParams() {
  return cables.map((cable) => ({ slug: cable.slug }));
}

export async function generateMetadata({
  params,
}: CablePageProps): Promise<Metadata> {
  const { slug } = await params;
  const cable = getCableBySlug(slug);
  if (!cable) return {};
  const title = buildCableTitle(cable);
  const description = buildCableDescription(cable);
  return {
    title,
    description,
    alternates: { canonical: cablePath(cable) },
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: company.tradeName,
      title,
      description,
      url: absoluteUrl(cablePath(cable)),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Same-category cables first; falls back to the rest of the catalog. */
function relatedCables(cable: Cable): { title: string; items: Cable[] } {
  const sameCategory = cables.filter(
    (item) => item.categoryId === cable.categoryId && item.id !== cable.id,
  );
  if (sameCategory.length > 0) {
    return { title: "Otros cables de la categoría", items: sameCategory };
  }
  return {
    title: "Otros cables del catálogo",
    items: cables.filter((item) => item.id !== cable.id).slice(0, 3),
  };
}

export default async function CablePage({ params }: CablePageProps) {
  const { slug } = await params;
  const cable = getCableBySlug(slug);
  if (!cable) notFound();

  const category = categories.find((item) => item.id === cable.categoryId);
  const colors = categoryColors(cable.categoryId);
  const related = relatedCables(cable);
  const whatsappLink = whatsappUrl(
    company.quotesWhatsApp,
    `Hola ${company.tradeName}, quisiera cotizar el cable ${cable.name}.`,
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(cable)} />
      <div className="wrap pb-[88px] pt-6">
        <nav aria-label="Ruta de navegación">
          <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 p-0 text-[14.5px] text-mute">
            <li>
              <Link href="/" className="inline-flex min-h-11 min-w-11 items-center justify-center">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#catalogo" className="inline-flex min-h-11 min-w-11 items-center justify-center">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-ink">
              {cable.name}
            </li>
          </ol>
        </nav>

        <article className="mt-2 overflow-hidden rounded-panel bg-white shadow-panel">
          <header className="border-b-[5px] border-lime bg-navy px-6 pb-7 pt-8">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="self-start rounded-full px-[11px] py-[5px] text-[12px] font-bold text-ink"
                  style={{ background: colors.fill }}
                >
                  {category?.name}
                </span>
                <BrandBadge brand={cable.brand} onDark />
              </div>
              <h1 className="m-0 text-[clamp(32px,5.4vw,56px)] font-extrabold leading-none tracking-[-1px] text-white">
                {cable.name}
              </h1>
              <p className="m-0 text-[16px] text-on-navy-2">{cable.fullName}</p>
            </div>
          </header>

          <CableSheetContent cable={cable} headingLevel="h2">
            <div className="flex flex-wrap gap-3 border-t border-line-soft pt-[22px]">
              <QuoteButton cable={cable} />
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lime"
              >
                <Icon name="whatsapp" size={18} />
                Cotizar por WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <Link href="/#catalogo" className="btn btn-line">
                Volver al catálogo
              </Link>
            </div>
          </CableSheetContent>
        </article>

        <section aria-labelledby="relacionados-titulo" className="mt-14">
          <h2 id="relacionados-titulo" className="h2 mb-6 text-[clamp(26px,3.6vw,38px)]">
            {related.title}
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {related.items.map((item) => {
              const itemColors = categoryColors(item.categoryId);
              return (
                <li key={item.id}>
                  <Link
                    href={cablePath(item)}
                    className="group flex h-full min-h-11 flex-col gap-2 rounded-card border border-line bg-white p-5 no-underline transition-[border-color,box-shadow] hover:border-line-hover hover:shadow-card-hover"
                  >
                    <span
                      className="inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-[5px] text-[12px] font-bold"
                      style={{ background: itemColors.bg, color: itemColors.fg }}
                    >
                      <Icon
                        name={categoryMeta[item.categoryId].icon}
                        size={14}
                        strokeWidth={1.8}
                      />
                      {categoryMeta[item.categoryId].shortName}
                    </span>
                    <h3 className="m-0 text-[22px] font-extrabold leading-tight text-ink">
                      {item.name}
                    </h3>
                    <span className="text-[14px] leading-[1.45] text-mute">
                      {item.fullName}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[14.5px] font-bold text-navy group-hover:text-lime-dark">
                      Ver ficha completa
                      <Icon name="arrow" size={14} strokeWidth={2.2} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
