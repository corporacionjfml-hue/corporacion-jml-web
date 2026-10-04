"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CategoryFilter } from "@/lib/catalog/search";

interface CatalogFilterValue {
  query: string;
  category: CategoryFilter;
  setQuery: (query: string) => void;
  setCategory: (category: CategoryFilter) => void;
  /** Selects a category, clears the search and scrolls to the catalog toolbar. */
  jumpToCategory: (category: CategoryFilter) => void;
  reset: () => void;
}

const CatalogFilterContext = createContext<CatalogFilterValue | null>(null);

export function useCatalogFilter(): CatalogFilterValue {
  const value = useContext(CatalogFilterContext);
  if (!value)
    throw new Error(
      "useCatalogFilter must be used inside <CatalogFilterProvider>",
    );
  return value;
}

/** Shares the search/category filter between the categories bento and the catalog. */
export function CatalogFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const reset = useCallback(() => {
    setQuery("");
    setCategory("all");
  }, []);

  const jumpToCategory = useCallback((next: CategoryFilter) => {
    setQuery("");
    setCategory(next);
    // Wait for the filtered grid to render so the scroll lands on the final layout.
    requestAnimationFrame(() => {
      document.getElementById("productos")?.scrollIntoView({ block: "start" });
    });
  }, []);

  const value = useMemo(
    () => ({ query, category, setQuery, setCategory, jumpToCategory, reset }),
    [query, category, jumpToCategory, reset],
  );

  return (
    <CatalogFilterContext.Provider value={value}>
      {children}
    </CatalogFilterContext.Provider>
  );
}
