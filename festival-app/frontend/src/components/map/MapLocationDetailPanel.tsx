import { mapCategoryClassNames, mapCategoryLabels } from "@/constants/map/map.constants";
import type { MapLocation } from "@/types/map/map.types";

type MapLocationDetailPanelProps = {
  location: MapLocation;
};

export default function MapLocationDetailPanel({ location }: MapLocationDetailPanelProps) {
  return (
    <section className="mt-4 rounded-xl border border-white/18 bg-black/18 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-black ${mapCategoryClassNames[location.category]}`}
        >
          {mapCategoryLabels[location.category]}
        </span>
        <span className="text-text-muted text-xs font-bold">선택 위치</span>
      </div>
      <h3 className="mt-3 text-lg font-black">{location.name}</h3>
      <p className="text-text-secondary mt-2 text-sm leading-relaxed">{location.description}</p>
    </section>
  );
}
