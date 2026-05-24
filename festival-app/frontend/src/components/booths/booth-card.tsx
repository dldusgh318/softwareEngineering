import { boothCategoryLabels, boothCategoryStyles } from "@/constants/booths/booth.constants";
import type { Booth } from "@/types/booths.types";

type BoothCardProps = {
  booth: Booth;
  isSelected: boolean;
  onSelect: (boothId: string) => void;
};

export function BoothCard({ booth, isSelected, onSelect }: BoothCardProps) {
  return (
    <button
      className={`bg-surface-glass hover:border-brand-mint hover:bg-surface-glass-hover min-h-52 border p-5 text-left shadow-sm backdrop-blur transition ${
        isSelected ? "border-brand-mint" : "border-line-subtle"
      }`}
      onClick={() => onSelect(booth.id)}
      type="button"
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-lg font-bold">{booth.name}</span>
          <span className="text-text-muted mt-1 block text-sm">{booth.teamName}</span>
        </span>
        <span
          className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothCategoryStyles[booth.category]}`}
        >
          {boothCategoryLabels[booth.category]}
        </span>
      </span>
      <span className="text-text-secondary mt-4 block min-h-12 text-sm leading-6">
        {booth.description}
      </span>
      <span className="text-text-secondary mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <span className="border-line-subtle border bg-white/5 px-3 py-2">
          {booth.operatingHours}
        </span>
        <span className="border-line-subtle border bg-white/5 px-3 py-2">
          잔여 테이블 {booth.availableTables}개
        </span>
      </span>
      <span className="text-brand-cream mt-3 block text-sm font-semibold">
        {booth.location.area} {booth.location.detail}
      </span>
    </button>
  );
}
