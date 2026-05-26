import Link from "next/link";

import type { Performance } from "@/types/performance/performance.types";
import {
  formatPerformanceTimeRange,
  getRemainingSeatLabel,
} from "@/utils/performance/performance.utils";

type PerformanceCardProps = {
  performance: Performance;
};

export default function PerformanceCard({ performance }: PerformanceCardProps) {
  return (
    <article className="rounded-2xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-brand-coral-soft text-xs font-black">{performance.artist}</p>
          <h2 className="mt-2 text-xl font-black">{performance.title}</h2>
          <p className="text-text-muted mt-3 text-sm font-semibold">
            {formatPerformanceTimeRange(performance)}
          </p>
          <p className="text-text-secondary mt-1 text-sm">{performance.location}</p>
        </div>
        <span className="border-brand-cream/30 bg-brand-cream/12 text-brand-cream inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-sm font-black">
          {getRemainingSeatLabel(performance.remainingSeats)}
        </span>
      </div>

      <p className="typo-caption text-text-secondary mt-4 line-clamp-2">
        {performance.description}
      </p>

      <Link
        href={`/performances/${performance.id}`}
        className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy mt-5 inline-flex h-10 items-center rounded-full px-4 text-sm font-black text-white transition"
      >
        상세 보기
      </Link>
    </article>
  );
}
