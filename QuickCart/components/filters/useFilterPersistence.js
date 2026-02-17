import { useEffect } from "react";

/**
 * Persistencia de filtros en localStorage.
 * @param {{ category?: string, subcategory?: string, type?: string }} filters
 */
export const useFilterPersistence = (filters) => {
  useEffect(() => {
    try {
      localStorage.setItem("filters", JSON.stringify(filters || {}));
    } catch {}
  }, [filters?.category, filters?.subcategory, filters?.type]);
};