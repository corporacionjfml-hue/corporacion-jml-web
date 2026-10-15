import type { Metadata } from "next";
import { CatalogFilterProvider } from "@/components/catalog/CatalogFilterProvider";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { CategoriesSection } from "@/components/catalog/CategoriesSection";
import { AdvisoryBand } from "@/components/home/AdvisoryBand";
import { AnatomySection } from "@/components/home/AnatomySection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Marquee } from "@/components/home/Marquee";
import { QuoteSection } from "@/components/quote/QuoteSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { company } from "@/data/company";
import { organizationJsonLd } from "@/lib/seo/seo";

const title = `Cables eléctricos en Lima: catálogo y cotización | ${company.tradeName}`;
const description =
  "Catálogo de cables eléctricos: autosoportados, aluminio, subterráneos, baja tensión y especiales. Elige el cable correcto con el asistente y cotiza por WhatsApp.";
// Link previews (WhatsApp, social) use the client's requested share name and the slogan only.
const shareTitle = company.tradeName;
const shareDescription = company.slogan;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: shareTitle,
    title: shareTitle,
    description: shareDescription,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: shareTitle, description: shareDescription },
};

/** Home in design order. */
export default function Home() {
  return (
    <CatalogFilterProvider>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <Marquee />
      <HowItWorks />
      <CategoriesSection />
      <CatalogSection />
      <AdvisoryBand />
      <AnatomySection />
      <ComparisonSection />
      <QuoteSection />
    </CatalogFilterProvider>
  );
}
