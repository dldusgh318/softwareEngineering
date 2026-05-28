import type {
  GetPerformanceParams,
  GetPerformancesParams,
} from "@/apis/performances/performance.api.types";
import { apiClient } from "@/libs/api/api-client";
import type { Performance } from "@/types/performance/performance.types";

// 예매 가능한 공연 목록을 조회합니다.
export function getPerformances({ signal }: GetPerformancesParams = {}) {
  return apiClient.get("api/performances", { signal }).json<Performance[]>();
}

// 선택한 공연 상세 정보를 조회합니다.
export function getPerformance({ id, signal }: GetPerformanceParams) {
  return apiClient.get(`api/performances/${id}`, { signal }).json<Performance>();
}
