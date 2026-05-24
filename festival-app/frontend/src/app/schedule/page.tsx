"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getTimeline, getTimelineEvent } from "@/apis/timeline/timeline.api";
import SiteHeader from "@/components/SiteHeader";
import TimelineDateTabs from "@/components/timeline/TimelineDateTabs";
import TimelineEventBlock from "@/components/timeline/TimelineEventBlock";
import TimelineEventDetailModal from "@/components/timeline/TimelineEventDetailModal";
import TimelineLoadingSkeleton from "@/components/timeline/TimelineLoadingSkeleton";
import {
  festivalDates,
  hourHeight,
  hourMarks,
  timetableEndHour,
  timetableStartHour,
} from "@/constants/timeline/timeline.constants";
import type { TimelineEvent } from "@/types/timeline/timeline.types";
import {
  buildTimelineBlocks,
  formatHourLabel,
  getHourMarkTop,
} from "@/utils/timeline/timeline.utils";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(festivalDates[0].value);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const {
    data: events = [],
    error,
    isError,
    isLoading,
  } = useQuery<TimelineEvent[]>({
    queryKey: ["timeline", selectedDate],
    queryFn: ({ signal }) => getTimeline({ date: selectedDate, signal }),
  });
  const {
    data: selectedEvent,
    error: selectedEventError,
    isError: isSelectedEventError,
    isFetching: isSelectedEventFetching,
  } = useQuery<TimelineEvent>({
    queryKey: ["timeline-event", selectedEventId],
    queryFn: ({ signal }) => getTimelineEvent({ id: selectedEventId as number, signal }),
    enabled: selectedEventId !== null,
  });

  const selectedDateLabel = useMemo(
    () => festivalDates.find((date) => date.value === selectedDate)?.label ?? "",
    [selectedDate],
  );
  const { blocks, laneCount } = useMemo(
    () => buildTimelineBlocks(events, selectedDate),
    [events, selectedDate],
  );
  const selectedEventPreview = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId],
  );
  const eventForModal = selectedEvent ?? selectedEventPreview;
  const timetableHeight = (timetableEndHour - timetableStartHour) * hourHeight;

  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="로그인" actionVariant="filled" fixed showNav />

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="typo-caption text-brand-yellow-soft mb-4 font-black">FESTIVAL TIMELINE</p>
          <h1 className="typo-title text-4xl sm:text-5xl">날짜별 행사 일정</h1>
          <p className="typo-body text-text-secondary mt-4 max-w-2xl">
            선택한 날짜에 진행되는 행사 시간, 제목, 장소, 유형을 한눈에 확인하세요.
          </p>
        </div>

        <TimelineDateTabs
          dates={festivalDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <section className="mt-8 rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-2xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-white/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">{selectedDateLabel} 일정</h2>
              <p className="typo-caption text-text-muted mt-1">
                시간대별로 진행되는 축제 프로그램을 확인하세요.
              </p>
            </div>
            <span className="text-text-muted text-sm font-bold">{events.length}개 행사</span>
          </div>

          <div className="mt-6">
            {isLoading && <TimelineLoadingSkeleton timetableHeight={timetableHeight} />}

            {!isLoading && isError && (
              <div className="border-brand-coral/30 bg-brand-coral/10 text-brand-coral-soft rounded-2xl border p-5 text-sm font-bold">
                {error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."}
              </div>
            )}

            {!isLoading && !isError && events.length === 0 && (
              <p className="text-text-muted py-12 text-center">
                선택한 날짜에 등록된 일정이 없습니다.
              </p>
            )}

            {!isLoading && !isError && events.length > 0 && (
              <div className="overflow-x-auto pb-2">
                <div
                  className="grid min-w-245 grid-cols-[5.5rem_1fr] gap-4"
                  style={{ height: timetableHeight }}
                >
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

                  <div className="relative rounded-2xl border border-white/12 bg-black/10">
                    {hourMarks.map((hour) => (
                      <div
                        key={hour}
                        className="absolute inset-x-0 border-t border-white/10"
                        style={{ top: (hour - timetableStartHour) * hourHeight }}
                      />
                    ))}

                    <div
                      className="absolute inset-y-0 grid"
                      style={{
                        left: 0,
                        right: 0,
                        gridTemplateColumns: `repeat(${laneCount}, minmax(0, 1fr))`,
                      }}
                      aria-hidden="true"
                    >
                      {Array.from({ length: laneCount }).map((_, index) => (
                        <div key={index} className="border-l border-white/6 first:border-l-0" />
                      ))}
                    </div>

                    {blocks.map((event) => (
                      <TimelineEventBlock
                        key={event.id}
                        event={event}
                        laneCount={laneCount}
                        onSelect={setSelectedEventId}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      {selectedEventId !== null && (
        <TimelineEventDetailModal
          event={eventForModal}
          error={selectedEventError instanceof Error ? selectedEventError : null}
          isError={isSelectedEventError}
          isFetching={isSelectedEventFetching}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </main>
  );
}
