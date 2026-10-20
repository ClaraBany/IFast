import { useFilters } from "@shared/hooks/useFilter";
import { periodLabels } from "@shared/types/filter";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";

export default function ActiveFilters() {
  const { filters, removeFilter } = useFilters();

  const chips = [
    { key: "period", text: filters.period && periodLabels[filters.period] },
    { key: "date", text: filters.date?.split("-").reverse().join("/") },
    { key: "origin", text: filters.origin && `Origem: ${NeighborhoodsLabels[filters.origin]}` },
    { key: "destination", text: filters.destination && `Destino: ${NeighborhoodsLabels[filters.destination]}` },
  ] as const;

  const activeChips = chips.filter((chip) => chip.text);

  if (activeChips.length === 0) return null;

  return (
    <div className="-mb-3 flex scrollbar-none gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
      {activeChips.map(({ key, text }) => (
        <button
          key={key}
          type="button"
          onClick={() => removeFilter(key)}
          className="flex-center cursor-pointer gap-1 rounded-3xl border border-primary bg-white px-4 py-0.5 whitespace-nowrap hover:brightness-95"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
