import type { GetTimelineEventParams, GetTimelineParams } from "@/apis/timeline/timeline.api.types";
import { apiClient } from "@/libs/api/api-client";
import type { TimelineEvent } from "@/types/timeline/timeline.types";

// 선택한 날짜의 타임라인 목록을 조회합니다.
export function getTimeline({ date, signal }: GetTimelineParams) {
  return apiClient
    .get("api/timeline", {
      searchParams: { date },
      signal,
    })
    .json<TimelineEvent[]>();
}

// 선택한 행사 상세 정보를 조회합니다.
export function getTimelineEvent({ id, signal }: GetTimelineEventParams) {
  return apiClient.get(`api/timeline/${id}`, { signal }).json<TimelineEvent>();
}
