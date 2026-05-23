import Image from "next/image";

import { mapMarkerClassNames } from "@/constants/map/map.constants";
import type { MapLocation } from "@/types/map/map.types";

type MapGuidePanelProps = {
  isError: boolean;
  isLoading: boolean;
  locations: MapLocation[];
  selectedLocationId: number | null;
  onSelectLocation: (locationId: number) => void;
};

export default function MapGuidePanel({
  isError,
  isLoading,
  locations,
  selectedLocationId,
  onSelectLocation,
}: MapGuidePanelProps) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-3 shadow-2xl shadow-black/10 sm:p-4">
      <div className="flex flex-col gap-2 border-b border-white/12 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">캠퍼스 위치 안내</h2>
          <p className="typo-caption text-text-muted mt-1">번호를 목록과 함께 확인하세요.</p>
        </div>
        <span className="text-text-muted text-sm font-bold">{locations.length}개 위치</span>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="relative min-w-170 overflow-hidden rounded-xl border border-white/12 bg-black/20">
          <Image
            src="/campus-map-guide.svg"
            alt="홍익대학교 축제 안내도"
            width={1200}
            height={760}
            priority
            className="block aspect-1200/760 max-h-136 w-full object-contain select-none"
          />

          {!isLoading &&
            !isError &&
            locations.map((location, index) => (
              <MapLocationMarker
                key={location.id}
                index={index}
                isSelected={selectedLocationId === location.id}
                location={location}
                onSelectLocation={onSelectLocation}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

type MapLocationMarkerProps = {
  index: number;
  isSelected: boolean;
  location: MapLocation;
  onSelectLocation: (locationId: number) => void;
};

function MapLocationMarker({
  index,
  isSelected,
  location,
  onSelectLocation,
}: MapLocationMarkerProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectLocation(location.id)}
      className={`absolute cursor-pointer rounded-2xl border-2 shadow-lg shadow-black/30 backdrop-blur-[1px] transition duration-200 focus:outline-none ${
        isSelected ? "z-20 brightness-110" : "z-10"
      } ${mapMarkerClassNames[location.category]}`}
      style={{
        left: `${location.x}%`,
        top: `${location.y}%`,
        width: `${location.width}%`,
        height: `${location.height}%`,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.12 : 1})`,
      }}
      title={location.description}
      aria-label={`${location.name} 위치 보기`}
    >
      <span className="bg-brand-navy/90 absolute top-1 left-1 grid size-7 place-items-center rounded-full border border-current text-xs font-black">
        {index + 1}
      </span>
    </button>
  );
}
