import {
  categoryAccentClassNames,
  categoryClassNames,
  categoryLabels,
  statusClassNames,
  statusLabels,
} from "@/constants/timeline/timeline.constants";
import type { TimelineBlock } from "@/types/timeline/timeline.types";
import { formatTimeRange } from "@/utils/timeline/timeline.utils";

type TimelineEventBlockProps = {
  event: TimelineBlock;
  laneCount: number;
  onSelect: (eventId: number) => void;
};

export default function TimelineEventBlock({
  event,
  laneCount,
  onSelect,
}: TimelineEventBlockProps) {
  const categoryClassName =
    categoryClassNames[event.category] ?? "border-white/20 bg-white/10 text-white/76";
  const accentClassName = categoryAccentClassNames[event.category] ?? "border-l-white/40";
  const statusClassName = event.status
    ? statusClassNames[event.status]
    : statusClassNames.SCHEDULED;
  const width = 100 / laneCount;
  const timeRange = formatTimeRange(event);

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={`absolute flex cursor-pointer flex-col items-start justify-start overflow-hidden rounded-xl border border-l-4 border-white/14 bg-white/[0.13] p-3 text-left shadow-lg shadow-black/15 backdrop-blur transition hover:bg-white/[0.18] focus:outline-none ${accentClassName}`}
      style={{
        top: event.top,
        left: `calc(${event.lane * width}% + 0.35rem)`,
        width: `calc(${width}% - 0.7rem)`,
        height: event.height,
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-black ${categoryClassName}`}
        >
          {categoryLabels[event.category] ?? event.category}
        </span>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-black ${statusClassName}`}
        >
          {event.status ? statusLabels[event.status] : "예정"}
        </span>
      </div>
      <p className="text-brand-yellow-soft mt-2 text-xs leading-5 font-black whitespace-normal">
        {timeRange}
      </p>
      <h3 className="mt-2 truncate text-base font-black">{event.title}</h3>
      <p className="text-text-muted mt-1 truncate text-xs font-bold">{event.location}</p>
    </button>
  );
}
