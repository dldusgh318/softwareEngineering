import type { FestivalDate } from "@/types/timeline/timeline.types";

type TimelineDateTabsProps = {
  dates: FestivalDate[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function TimelineDateTabs({
  dates,
  selectedDate,
  onSelectDate,
}: TimelineDateTabsProps) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      {dates.map((date) => {
        const isSelected = selectedDate === date.value;

        return (
          <button
            key={date.value}
            type="button"
            onClick={() => onSelectDate(date.value)}
            className={`cursor-pointer rounded-2xl border px-5 py-4 text-left transition ${
              isSelected
                ? "border-brand-yellow bg-brand-yellow text-brand-navy shadow-brand-yellow/20 shadow-lg"
                : "border-line-subtle bg-surface-glass hover:bg-surface-glass-hover text-white"
            }`}
          >
            <span className="block text-xs font-black">{date.caption}</span>
            <span className="mt-1 block text-xl font-black">{date.label}</span>
          </button>
        );
      })}
    </div>
  );
}
