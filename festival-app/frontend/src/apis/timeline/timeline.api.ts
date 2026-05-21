import { apiClient } from "@/libs/api/api-client";
import type { TimelineEvent } from "@/types/timeline/timeline.types";

type GetTimelineParams = {
  date: string;
  signal?: AbortSignal;
};

// 선택한 날짜의 타임라인 목록을 조회합니다.
export function getTimeline({ date, signal }: GetTimelineParams) {
  return apiClient
    .get("api/timeline", {
      searchParams: { date },
      signal,
    })
    .json<TimelineEvent[]>();
}
