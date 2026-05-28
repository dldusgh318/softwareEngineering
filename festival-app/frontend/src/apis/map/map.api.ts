import type { GetMapLocationsParams } from "@/apis/map/map.api.types";
import { apiClient } from "@/libs/api/api-client";
import type { MapLocation } from "@/types/map/map.types";

// 축제 안내도에 표시할 위치 목록을 조회합니다.
export function getMapLocations({ category, signal }: GetMapLocationsParams = {}) {
  return apiClient
    .get("api/map-locations", {
      searchParams: category ? { category } : undefined,
      signal,
    })
    .json<MapLocation[]>();
}
