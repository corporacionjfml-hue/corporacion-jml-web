import { CatalogFilterProvider } from "@/components/catalog/CatalogFilterProvider";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { CategoriesSection } from "@/components/catalog/CategoriesSection";
import { AdvisoryBand } from "@/components/home/AdvisoryBand";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Marquee } from "@/components/home/Marquee";

/** Home in design order. Later tasks add comparison, anatomy and the quote section. */
export default function Home() {
  return (
    <CatalogFilterProvider>
      <Hero />
      <Marquee />
      <HowItWorks />
      <CategoriesSection />
      <CatalogSection />
      <AdvisoryBand />
    </CatalogFilterProvider>
  );
}
