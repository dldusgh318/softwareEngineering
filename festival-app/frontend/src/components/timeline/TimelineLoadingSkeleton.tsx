import { hourHeight, hourMarks, timetableStartHour } from "@/constants/timeline/timeline.constants";
import { formatHourLabel, getHourMarkTop } from "@/utils/timeline/timeline.utils";

type TimelineLoadingSkeletonProps = {
  timetableHeight: number;
};

const skeletonBlocks = [
  { top: 32, left: "0.5rem", width: "31%", height: 210 },
  { top: 96, left: "34%", width: "31%", height: 270 },
  { top: 156, left: "67%", width: "31%", height: 180 },
  { top: 470, left: "0.5rem", width: "31%", height: 250 },
  { top: 620, left: "34%", width: "31%", height: 320 },
  { top: 790, left: "67%", width: "31%", height: 260 },
];

export default function TimelineLoadingSkeleton({ timetableHeight }: TimelineLoadingSkeletonProps) {
  return (
    <div className="overflow-x-auto pb-2" aria-label="일정 로딩 중">
      <div className="grid min-w-[980px] grid-cols-[5.5rem_1fr] gap-4" style={{ height: timetableHeight }}>
        <div className="relative">
          {hourMarks.map((hour) => (
            <div
              key={hour}
              className="text-text-muted absolute right-0 pr-2 text-xs font-black"
              style={{ top: getHourMarkTop(hour, timetableHeight) }}
            >
              {formatHourLabel(hour)}
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/10">
          {hourMarks.map((hour) => (
            <div
              key={hour}
              className="absolute inset-x-0 border-t border-white/10"
              style={{ top: (hour - timetableStartHour) * hourHeight }}
            />
          ))}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] animate-pulse" />

          {skeletonBlocks.map((block, index) => (
            <div
              key={index}
              className="absolute rounded-xl border border-white/10 bg-white/[0.08] p-3"
              style={{
                top: block.top,
                left: block.left,
                width: block.width,
                height: block.height,
              }}
            >
              <div className="bg-white/14 h-4 w-16 rounded-full" />
              <div className="bg-white/10 mt-3 h-3 w-24 rounded-full" />
              <div className="bg-white/10 mt-3 h-4 w-32 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
