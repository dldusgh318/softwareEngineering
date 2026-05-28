import type {
  GetPerformanceParams,
  GetPerformancesParams,
} from "@/apis/performances/performance.api.types";
import { apiClient } from "@/libs/api/api-client";
import type { Performance } from "@/types/performance/performance.types";

export function getPerformances({ signal }: GetPerformancesParams = {}) {
  return apiClient.get("api/performances", { signal }).json<Performance[]>();
}

export function getPerformance({ id, signal }: GetPerformanceParams) {
  return apiClient.get(`api/performances/${id}`, { signal }).json<Performance>();
}
