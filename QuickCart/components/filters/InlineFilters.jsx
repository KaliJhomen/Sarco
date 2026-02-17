import { useCallback } from "react";
import { buildFilterParams } from "@/components/filters/filters.utils";

export default function InlineFilters({ filters, router }) {
  const apply = useCallback(() => {
    const qs = buildFilterParams(filters);
    router.push(`/shop/products?${qs}`);
  }, [filters, router]);

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <button className="px-3 py-2 bg-orange-600 text-white rounded" onClick={apply}>Aplicar</button>
    </div>
  );
}