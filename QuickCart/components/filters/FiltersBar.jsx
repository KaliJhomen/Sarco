import FilterTag from "@/components/filters/FilterTag";

export default function FiltersBar({ activeFilters = {}, onClear }) {
  const entries = Object.entries(activeFilters).filter(([_, v]) => !!v);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {entries.map(([key, val]) => (
        <FilterTag key={key} label={`${key}: ${val}`} onClear={() => onClear?.(key)} />
      ))}
    </div>
  );
}