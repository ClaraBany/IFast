import { useSearchParams } from "react-router";
import { Period, periodLabels } from "@ride-offer/offerTypes";
import { getNeighborhoodLabel } from "@user/userTypes";

type FilterConfig = {
  key: string;
  label?: string;
  format?: (value: string) => string;
};

const FILTERS: FilterConfig[] = [
  { key: "period", format: (v) => periodLabels[v as Period] ?? v },
  { key: "date", format: (v) => v.split("-").reverse().join("/") },
  { key: "origin", label: "Origem", format: (v) => getNeighborhoodLabel(v)! },
  { key: "destination", label: "Destino", format: (v) => getNeighborhoodLabel(v)! },
];

export default function ActiveFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters = FILTERS.filter((filter) => searchParams.get(filter.key));

  if (activeFilters.length === 0) return null;

  function removeFilter(key: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      return next;
    });
  }

  return (
    <div className="-mb-3 flex gap-3 overflow-x-auto">
      {activeFilters.map(({ key, label, format }) => {
        const value = searchParams.get(key)!;

        return (
          <button
            key={key}
            type="button"
            onClick={() => removeFilter(key)}
            className="flex-center cursor-pointer gap-1 rounded-3xl border border-primary bg-white px-4 py-0.5 whitespace-nowrap hover:brightness-95"
          >
            {label && `${label}: `}
            {format ? format(value) : value}
          </button>
        );
      })}
    </div>
  );
}
