import { useMemo, useCallback, useEffect } from "react";
import { normalizeSoft, getTypeNames } from "@/components/filters/filters.utils";
import BrandCarousel from "@/components/BrandCarousel";

export default function ProductTypeCarousel({
  categoriesMenu,
  c,
  s,
  t,
  searchParams,
  router,
  className = '',
  theme = 'red',
}) {
  const typeNames = useMemo(
    () => getTypeNames(categoriesMenu, c, s),
    [categoriesMenu, c, s]
  );

  useEffect(() => {
    try {
      console.log('[Diag][TypeCarousel] tipos resueltos', {
        categoria: c,
        subcategoria: s,
        menuSize: Array.isArray(categoriesMenu) ? categoriesMenu.length : 0,
        tipos: typeNames,
        activos: { t }
      });
    } catch {}
  }, [categoriesMenu, c, s, t, typeNames]);

  const handleSelectType = useCallback(
    (name) => {
      const usp = new URLSearchParams(searchParams.toString());
      const val = normalizeSoft(name);
      const isActive = val === normalizeSoft(t);
      if (isActive) usp.delete("t");
      else usp.set("t", val);
      try {
        if (process.env.NEXT_PUBLIC_DEBUG_FILTERS === '1') {
          console.log('[QuickCart][Filters] Select type', { name, val, isActive, nextUrl: `/shop/products?${usp.toString()}` });
        }
        console.log('[Diag][TypeCarousel] seleccionar tipo', { original: name, normalizado: val, activo: isActive, next: `/shop/products?${usp.toString()}` });
      } catch {}
      router.push(`/shop/products?${usp.toString()}`);
    },
    [router, searchParams, t]
  );

  if (typeNames.length === 0) return null;

  return (
    <div className={`w-full flex justify-start overflow-x-auto ${className}`}>
      <BrandCarousel types={typeNames} activeType={t} onSelectType={handleSelectType} typesTheme={theme} />
    </div>
  );
}