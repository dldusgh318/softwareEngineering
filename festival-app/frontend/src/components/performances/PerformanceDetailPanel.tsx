import type { Performance } from "@/types/performance/performance.types";
import {
  formatPerformanceTimeRange,
  getRemainingSeatLabel,
} from "@/utils/performance/performance.utils";

type PerformanceDetailPanelProps = {
  performance: Performance;
};

export default function PerformanceDetailPanel({ performance }: PerformanceDetailPanelProps) {
  return (
    <section className="rounded-3xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur sm:p-6">
      <p className="text-brand-coral-soft text-sm font-black">{performance.artist}</p>
      <h1 className="typo-title mt-3 text-4xl sm:text-5xl">{performance.title}</h1>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/12 bg-black/12 p-4">
          <dt className="text-text-muted text-xs font-bold">공연 시간</dt>
          <dd className="mt-2 text-sm font-black">{formatPerformanceTimeRange(performance)}</dd>
        </div>
        <div className="rounded-2xl border border-white/12 bg-black/12 p-4">
          <dt className="text-text-muted text-xs font-bold">장소</dt>
          <dd className="mt-2 text-sm font-black">{performance.location}</dd>
        </div>
        <div className="rounded-2xl border border-white/12 bg-black/12 p-4">
          <dt className="text-text-muted text-xs font-bold">좌석</dt>
          <dd className="text-brand-cream mt-2 text-sm font-black">
            {getRemainingSeatLabel(performance.remainingSeats)}
          </dd>
        </div>
      </dl>

      <p className="typo-body text-text-secondary mt-6 leading-relaxed">
        {performance.description}
      </p>
    </section>
  );
}
