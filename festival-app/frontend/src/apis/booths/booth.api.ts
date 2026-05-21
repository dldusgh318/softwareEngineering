import { apiClient } from "@/libs/api/api-client";
import type { Booth } from "@/types/booth";

export function getBooths(signal?: AbortSignal) {
  return apiClient.get("api/booths", { signal }).json<Booth[]>();
}
