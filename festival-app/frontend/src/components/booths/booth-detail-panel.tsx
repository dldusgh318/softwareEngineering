import { BoothCampusMap } from "@/components/booths/booth-campus-map";
import type { Booth } from "@/types/booths.types";

type BoothDetailPanelProps = {
  booth?: Booth;
};

export function BoothDetailPanel({ booth }: BoothDetailPanelProps) {
  return (
    <aside className="border-line-subtle bg-surface-glass h-fit border p-5 shadow-sm backdrop-blur">
      {booth ? (
        <div className="space-y-5">
          <div>
            <p className="text-text-muted text-sm font-semibold">선택한 부스</p>
            <h2 className="mt-1 text-2xl font-bold">{booth.name}</h2>
            <p className="text-text-muted mt-2 text-sm">{booth.teamName}</p>
          </div>

          <BoothCampusMap booth={booth} />

          <dl className="grid gap-3 text-sm">
            <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
              <dt className="text-text-muted font-semibold">구역</dt>
              <dd className="font-medium">{booth.location.zone}구역</dd>
            </div>
            <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
              <dt className="text-text-muted font-semibold">위치</dt>
              <dd className="font-medium">
                {booth.location.area} {booth.location.detail}
              </dd>
            </div>
            <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
              <dt className="text-text-muted font-semibold">운영 시간</dt>
              <dd className="font-medium">{booth.operatingHours}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3">
              <dt className="text-text-muted font-semibold">테이블</dt>
              <dd className="font-medium">예약 가능 {booth.availableTables}개</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="text-text-secondary text-sm">부스를 선택해주세요.</p>
      )}
    </aside>
  );
}
