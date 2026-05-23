import {
  categoryClassNames,
  categoryLabels,
  statusClassNames,
  statusLabels,
} from "@/constants/timeline/timeline.constants";
import type { TimelineEvent } from "@/types/timeline/timeline.types";
import { formatTimeRange } from "@/utils/timeline/timeline.utils";

type TimelineEventDetailModalProps = {
  event?: TimelineEvent;
  error: Error | null;
  isError: boolean;
  isFetching: boolean;
  onClose: () => void;
};

export default function TimelineEventDetailModal({
  event,
  error,
  isError,
  isFetching,
  onClose,
}: TimelineEventDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeline-event-title"
      onClick={onClose}
    >
      <section
        className="bg-brand-navy-soft w-full max-w-xl rounded-2xl border border-white/12 p-5 shadow-2xl shadow-black/30 sm:p-6"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-brand-yellow-soft text-xs font-black">EVENT DETAILS</p>
            <h2 id="timeline-event-title" className="mt-2 text-2xl font-black">
              {event?.title ?? "행사 상세"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/12 bg-white/10 text-xl font-black text-white transition hover:bg-white/16 focus:outline-none"
            aria-label="상세 닫기"
          >
            ×
          </button>
        </div>

        {!event && isFetching && (
          <div className="mt-6 space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-white/12" />
            <div className="h-24 animate-pulse rounded-xl bg-white/10" />
          </div>
        )}

        {!event && !isFetching && isError && (
          <div className="border-brand-coral/30 bg-brand-coral/10 text-brand-coral-soft mt-6 rounded-2xl border p-5 text-sm font-bold">
            {error?.message ?? "행사 상세 정보를 불러오지 못했습니다."}
          </div>
        )}

        {event && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${
                  categoryClassNames[event.category] ?? "border-white/20 bg-white/10 text-white/76"
                }`}
              >
                {categoryLabels[event.category] ?? event.category}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${
                  event.status ? statusClassNames[event.status] : statusClassNames.SCHEDULED
                }`}
              >
                {event.status ? statusLabels[event.status] : "예정"}
              </span>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <dt className="text-text-muted text-xs font-black">시간</dt>
                <dd className="text-brand-yellow-soft mt-2 font-black">{formatTimeRange(event)}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <dt className="text-text-muted text-xs font-black">장소</dt>
                <dd className="mt-2 font-black">{event.location}</dd>
              </div>
            </dl>

            <p className="typo-body text-text-secondary rounded-xl border border-white/10 bg-black/10 p-4">
              {event.description ?? "상세 설명을 불러오는 중입니다."}
            </p>

            {isError && (
              <p className="text-brand-coral-soft text-xs font-bold">
                상세 API 응답을 받지 못해 기본 일정 정보만 표시하고 있습니다.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
