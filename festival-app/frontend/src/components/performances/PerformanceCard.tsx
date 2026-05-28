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
    <article className="rounded-3xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
      <p className="text-brand-coral-soft text-xs font-black">{performance.artist}</p>
      <h2 className="mt-2 text-xl font-black">{performance.title}</h2>
      <p className="text-text-muted mt-3 text-sm font-semibold">
        {formatPerformanceTimeRange(performance)}
      </p>
      <p className="text-text-secondary mt-1 text-sm">{performance.location}</p>
      <p className="typo-caption text-text-secondary mt-4 line-clamp-2">
        {performance.description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-brand-cream text-sm font-black">
          {getRemainingSeatLabel(performance.remainingSeats)}
        </span>
        <Link
          href={`/performances/${performance.id}`}
          className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy inline-flex h-10 items-center rounded-full px-4 text-sm font-black text-white transition"
        >
          상세 보기
        </Link>
      </div>
    </article>
  );
}
