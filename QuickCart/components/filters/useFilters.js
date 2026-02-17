import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildFilterParams, normalize } from "@/components/filters/filters.utils";
import { FILTER_PARAM_KEYS, PATHS } from "@/components/filters/filters.constants";

const STORAGE_KEY = "quickcart.filters";

export const useFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const acRef = useRef(null);

  const filters = useMemo(() => {
    const getLower = (k) => (searchParams.get(k) || "").toLowerCase();
    const getNum = (k) => {
      const v = searchParams.get(k);
      return v !== null && v !== undefined && v !== "" ? Number(v) : undefined;
    };

    return {
      category: getLower(FILTER_PARAM_KEYS.category),
      subcategory: getLower(FILTER_PARAM_KEYS.subcategory),
      type: getLower(FILTER_PARAM_KEYS.type),
      priceMin: getNum(FILTER_PARAM_KEYS.priceMin),
      priceMax: getNum(FILTER_PARAM_KEYS.priceMax),
      brand: getLower("brand"),
    };
  }, [searchParams]);

  const replaceUrl = useCallback((nextFilters) => {
    const qs = buildFilterParams(nextFilters);
    const base = pathname || PATHS.allProducts;
    router.push(`${base}${qs ? `?${qs}` : ""}`);
  }, [router, pathname]);

  const persist = useCallback((nextFilters) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFilters));
    } catch {}
  }, []);

  const onUpdate = useCallback((partial) => {
    const next = { ...filters, ...partial };
    ["category", "subcategory", "type", "brand"].forEach((k) => {
      if (typeof next[k] === "string") next[k] = normalize(next[k]);
    });
    const { page, ...clean } = next;
    replaceUrl(clean);
    persist(clean);
    try {
      if (acRef.current) acRef.current.abort();
      acRef.current = new AbortController();
    } catch {}
    return acRef.current?.signal;
  }, [filters, replaceUrl, persist]);

  const clearFilter = useCallback((key) => {
    const next = { ...filters };
    delete next[key];
    replaceUrl(next);
    persist(next);
  }, [filters, replaceUrl, persist]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && Object.keys(saved).length > 0 && searchParams.toString() === "") {
        replaceUrl(saved);
      }
    } catch {}
    return () => {
      try { acRef.current?.abort(); } catch {}
    };
  }, []);

  return { filters, onUpdate, clearFilter };
};