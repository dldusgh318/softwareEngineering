import { mapCategoryClassNames, mapCategoryLabels } from "@/constants/map/map.constants";
import type { MapLocation } from "@/types/map/map.types";

type MapLocationListItemProps = {
  index: number;
  isSelected: boolean;
  location: MapLocation;
  onSelectLocation: (locationId: number) => void;
};

export default function MapLocationListItem({
  index,
  isSelected,
  location,
  onSelectLocation,
}: MapLocationListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectLocation(location.id)}
      className={`w-full cursor-pointer rounded-xl border p-3 text-left transition hover:bg-white/8 focus:outline-none ${
        isSelected
          ? "border-white/35 bg-white/9 shadow-lg shadow-black/15"
          : "border-white/10 bg-black/10"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-black ${mapCategoryClassNames[location.category]}`}
        >
          {mapCategoryLabels[location.category]}
        </span>
        <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-text-muted"}`}>
          #{index + 1}
        </span>
      </div>
      <h3 className="mt-2 text-base font-black">{location.name}</h3>
    </button>
  );
}
