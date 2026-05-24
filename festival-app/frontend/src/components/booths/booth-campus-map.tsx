import { campusLandmarks } from "@/constants/booths/booth.constants";
import type { Booth } from "@/types/booth/booths.types";

type BoothCampusMapProps = {
  booth: Booth;
};

export function BoothCampusMap({ booth }: BoothCampusMapProps) {
  return (
    <div className="border-line-subtle relative h-72 overflow-hidden border bg-white/10">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
      <div className="text-text-muted absolute top-4 left-4 text-xs font-bold">캠퍼스 지도</div>

      {campusLandmarks.map((landmark) => (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          key={landmark.name}
          style={{
            left: `${landmark.mapX}%`,
            top: `${landmark.mapY}%`,
          }}
        >
          <span className="block h-3 w-3 border border-white/60 bg-white/45 shadow-sm" />
          <span className="mt-1 block rounded-sm bg-black/25 px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white/90">
            {landmark.name}
          </span>
        </div>
      ))}

      <div
        aria-label={`${booth.name} 위치`}
        className="bg-brand-mint absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md"
        style={{
          left: `${booth.location.mapX}%`,
          top: `${booth.location.mapY}%`,
        }}
      />

      <div className="text-text-secondary absolute right-4 bottom-4 left-4 grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-4">
        {campusLandmarks.map((landmark) => (
          <span className="border-line-subtle border bg-white/10 px-2 py-2" key={landmark.name}>
            {landmark.description}
          </span>
        ))}
      </div>
    </div>
  );
}
