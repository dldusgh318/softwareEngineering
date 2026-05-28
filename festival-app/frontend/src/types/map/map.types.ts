export type MapLocationCategory = "STAGE" | "BOOTH" | "INFO" | "AMENITY";

export type MapLocation = {
  id: number;
  name: string;
  category: MapLocationCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
};
