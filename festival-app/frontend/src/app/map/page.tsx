"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMapLocations } from "@/apis/map/map.api";
import MapCategoryFilter from "@/components/map/MapCategoryFilter";
import MapGuidePanel from "@/components/map/MapGuidePanel";
import MapLocationList from "@/components/map/MapLocationList";
import SiteHeader from "@/components/SiteHeader";
import type { MapLocation, MapLocationCategory } from "@/types/map/map.types";

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<MapLocationCategory | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const {
    data: locations = [],
    error,
    isError,
    isLoading,
  } = useQuery<MapLocation[]>({
    queryKey: ["map-locations", selectedCategory],
    queryFn: ({ signal }) => getMapLocations({ category: selectedCategory, signal }),
  });
  const effectiveSelectedLocationId = useMemo(() => {
    if (locations.length === 0) {
      return null;
    }

    const hasSelectedLocation = locations.some((location) => location.id === selectedLocationId);

    return hasSelectedLocation ? selectedLocationId : locations[0].id;
  }, [locations, selectedLocationId]);
  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === effectiveSelectedLocationId) ?? null,
    [effectiveSelectedLocationId, locations],
  );

  const handleSelectCategory = (category: MapLocationCategory | null) => {
    setSelectedCategory(category);
    setSelectedLocationId(null);
  };

  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="로그인" actionVariant="filled" fixed showNav />

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="typo-caption text-brand-blue-soft mb-4 font-black">FESTIVAL MAP</p>
          <h1 className="typo-title text-4xl sm:text-5xl">축제 안내도</h1>
          <p className="typo-body text-text-secondary mt-4 max-w-2xl">
            공연장, 부스, 편의시설 위치를 지도 위 마커와 목록으로 확인하세요.
          </p>
        </div>

        <MapCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]">
          <MapGuidePanel
            isError={isError}
            isLoading={isLoading}
            locations={locations}
            selectedLocationId={effectiveSelectedLocationId}
            onSelectLocation={setSelectedLocationId}
          />

          <MapLocationList
            error={error}
            isError={isError}
            isLoading={isLoading}
            locations={locations}
            selectedLocation={selectedLocation}
            selectedLocationId={effectiveSelectedLocationId}
            onSelectLocation={setSelectedLocationId}
          />
        </section>
      </section>
    </main>
  );
}
