import {
  hourHeight,
  minBlockHeight,
  timetableEndHour,
  timetableStartHour,
} from "@/constants/timeline/timeline.constants";
import type { TimelineBlock, TimelineEvent } from "@/types/timeline/timeline.types";

// ISO 날짜 문자열을 HH:mm 형식으로 변환합니다.
export function formatTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

// 행사 시작/종료 시간을 화면용 범위 문자열로 변환합니다.
export function formatTimeRange(event: TimelineEvent) {
  if (event.title === "홍대존 입장") {
    return `${formatTime(event.startsAt)} ~`;
  }

  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);
  const isNextDay = startsAt.toDateString() !== endsAt.toDateString();
  const endTime = isNextDay ? `익일 ${formatTime(event.endsAt)}` : formatTime(event.endsAt);

  return `${formatTime(event.startsAt)} - ${endTime}`;
}

// 24시 이후 시간축 라벨을 익일 표기로 변환합니다.
export function formatHourLabel(hour: number) {
  if (hour === 24) {
    return "익일 00:00";
  }

  if (hour === 25) {
    return "익일 01:00";
  }

  return `${String(hour).padStart(2, "0")}:00`;
}

// 겹치는 일정을 서로 다른 레인에 배치할 타임테이블 막대 데이터로 변환합니다.
export function buildTimelineBlocks(events: TimelineEvent[], selectedDate: string) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  const laneEnds: number[] = [];
  const blocks: TimelineBlock[] = [];
  const startBoundary = timetableStartHour * 60;
  const endBoundary = timetableEndHour * 60;

  sortedEvents.forEach((event) => {
    const startMinute = toMinuteOffset(event.startsAt, selectedDate);
    const endMinute = Math.min(toMinuteOffset(event.endsAt, selectedDate), endBoundary);
    const lane = laneEnds.findIndex((laneEnd) => laneEnd <= startMinute);
    const nextLane = lane === -1 ? laneEnds.length : lane;

    laneEnds[nextLane] = endMinute;
    blocks.push({
      ...event,
      lane: nextLane,
      startMinute,
      endMinute,
      top: ((startMinute - startBoundary) / 60) * hourHeight,
      height: Math.max(((endMinute - startMinute) / 60) * hourHeight, minBlockHeight),
    });
  });

  return {
    blocks,
    laneCount: Math.max(laneEnds.length, 1),
  };
}

// 첫/마지막 시간 라벨이 잘리지 않도록 위치를 보정합니다.
export function getHourMarkTop(hour: number, timetableHeight: number) {
  const top = (hour - timetableStartHour) * hourHeight - 7;

  if (hour === timetableStartHour) {
    return 0;
  }

  if (hour === timetableEndHour) {
    return timetableHeight - 14;
  }

  return top;
}

// 선택 날짜 00:00 기준으로 일정 시간이 몇 분 뒤인지 계산합니다.
function toMinuteOffset(value: string, selectedDate: string) {
  const baseDate = new Date(`${selectedDate}T00:00:00`);
  const targetDate = new Date(value);

  return Math.round((targetDate.getTime() - baseDate.getTime()) / 60000);
}
