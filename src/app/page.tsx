import { CatalogFilterProvider } from "@/components/catalog/CatalogFilterProvider";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { CategoriesSection } from "@/components/catalog/CategoriesSection";

/** Temporary home: later tasks add hero, assistant, comparison and quote sections. */
export default function Home() {
  return (
    <CatalogFilterProvider>
      <CategoriesSection />
      <CatalogSection />
    </CatalogFilterProvider>
  );
}
