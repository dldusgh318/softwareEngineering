import type { Performance } from "@/types/performance/performance.types";

export function formatPerformanceDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function formatPerformanceTimeRange(performance: Performance) {
  return `${formatPerformanceDateTime(performance.startsAt)} - ${formatPerformanceDateTime(
    performance.endsAt,
  )}`;
}

export function getRemainingSeatLabel(remainingSeats: number) {
  if (remainingSeats <= 0) {
    return "매진";
  }

  return `잔여 ${remainingSeats.toLocaleString("ko-KR")}석`;
}
