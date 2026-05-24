import { apiClient } from "@/libs/api/api-client";
import type { MapLocation } from "@/types/map/map.types";

type GetMapLocationsParams = {
  signal?: AbortSignal;
};

// 축제 안내도에 표시할 위치 목록을 조회합니다.
export function getMapLocations({ signal }: GetMapLocationsParams = {}) {
  return apiClient.get("api/map-locations", { signal }).json<MapLocation[]>();
}
