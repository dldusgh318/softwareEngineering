import type { MapLocation } from "@/types/map/map.types";

import MapLocationDetailPanel from "./MapLocationDetailPanel";
import MapLocationListItem from "./MapLocationListItem";

type MapLocationListProps = {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  locations: MapLocation[];
  selectedLocation: MapLocation | null;
  selectedLocationId: number | null;
  onSelectLocation: (locationId: number) => void;
};

export default function MapLocationList({
  error,
  isError,
  isLoading,
  locations,
  selectedLocation,
  selectedLocationId,
  onSelectLocation,
}: MapLocationListProps) {
  return (
    <aside className="flex max-h-152 flex-col rounded-2xl border border-white/12 bg-white/[0.07] p-3 shadow-2xl shadow-black/10 sm:p-4 lg:max-h-164">
      <div className="shrink-0 border-b border-white/12 pb-3">
        <h2 className="text-xl font-black">위치 목록</h2>
        <p className="typo-caption text-text-muted mt-1">
          공연장, 부스, 편의시설을 한 번에 확인하세요.
        </p>
      </div>

      {!isLoading && !isError && selectedLocation && (
        <MapLocationDetailPanel location={selectedLocation} />
      )}

      <div className="mt-4 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-white/10 bg-white/10"
            />
          ))}

        {!isLoading && isError && (
          <div className="border-brand-coral/30 bg-brand-coral/10 text-brand-coral-soft rounded-2xl border p-5 text-sm font-bold">
            {error instanceof Error ? error.message : "위치 정보를 불러오지 못했습니다."}
          </div>
        )}

        {!isLoading && !isError && locations.length === 0 && (
          <p className="text-text-muted py-12 text-center">
            선택한 카테고리에 등록된 위치 정보가 없습니다.
          </p>
        )}

        {!isLoading &&
          !isError &&
          locations.map((location, index) => (
            <MapLocationListItem
              key={location.id}
              index={index}
              isSelected={selectedLocationId === location.id}
              location={location}
              onSelectLocation={onSelectLocation}
            />
          ))}
      </div>
    </aside>
  );
}
