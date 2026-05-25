import { apiClient } from "@/libs/api/api-client";
import type { MapLocation, MapLocationCategory } from "@/types/map/map.types";

type GetMapLocationsParams = {
  category?: MapLocationCategory | null;
  signal?: AbortSignal;
};

// 축제 안내도에 표시할 위치 목록을 조회합니다.
export function getMapLocations({ category, signal }: GetMapLocationsParams = {}) {
  return apiClient
    .get("api/map-locations", {
      searchParams: category ? { category } : undefined,
      signal,
    })
    .json<MapLocation[]>();
}
