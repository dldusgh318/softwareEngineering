import type { MapLocationCategory } from "@/types/map/map.types";

export const mapCategoryLabels: Record<MapLocationCategory, string> = {
  AMENITY: "편의시설",
  BOOTH: "부스",
  FOOD: "푸드",
  INFO: "안내",
  STAGE: "공연장",
};

export const mapCategoryClassNames: Record<MapLocationCategory, string> = {
  AMENITY: "border-brand-blue/30 bg-brand-blue/18 text-brand-blue-soft",
  BOOTH: "border-brand-mint/30 bg-brand-mint/18 text-brand-mint-soft",
  FOOD: "border-brand-yellow/30 bg-brand-yellow/18 text-brand-yellow-soft",
  INFO: "border-white/20 bg-white/12 text-white/82",
  STAGE: "border-brand-coral/30 bg-brand-coral/18 text-brand-coral-soft",
};

export const mapMarkerClassNames: Record<MapLocationCategory, string> = {
  AMENITY: "border-brand-blue bg-brand-blue/16 text-brand-blue-soft",
  BOOTH: "border-brand-mint bg-brand-mint/16 text-brand-mint-soft",
  FOOD: "border-brand-yellow bg-brand-yellow/16 text-brand-yellow-soft",
  INFO: "border-brand-cream bg-brand-cream/16 text-brand-cream",
  STAGE: "border-brand-coral bg-brand-coral/16 text-brand-coral-soft",
};
