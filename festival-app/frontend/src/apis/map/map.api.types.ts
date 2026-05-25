import type { MapLocationCategory } from "@/types/map/map.types";

export type GetMapLocationsParams = {
  category?: MapLocationCategory | null;
  signal?: AbortSignal;
};
