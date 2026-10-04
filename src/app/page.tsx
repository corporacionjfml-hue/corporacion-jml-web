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

/** Home in design order. */
export default function Home() {
  return (
    <CatalogFilterProvider>
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
