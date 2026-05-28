import { mapCategoryFilterOptions } from "@/constants/map/map.constants";
import type { MapLocationCategory } from "@/types/map/map.types";

type MapCategoryFilterProps = {
  selectedCategory: MapLocationCategory | null;
  onSelectCategory: (category: MapLocationCategory | null) => void;
};

export default function MapCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: MapCategoryFilterProps) {
  return (
    <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="위치 카테고리 필터">
      {mapCategoryFilterOptions.map((option) => {
        const isSelected = selectedCategory === option.value;

        return (
          <button
            key={option.value ?? "ALL"}
            type="button"
            onClick={() => onSelectCategory(option.value)}
            className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm font-black transition focus:outline-none ${
              isSelected
                ? "border-white/45 bg-white/18 text-white shadow-lg shadow-black/10"
                : "text-text-secondary border-white/12 bg-white/6 hover:bg-white/10 hover:text-white"
            }`}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
