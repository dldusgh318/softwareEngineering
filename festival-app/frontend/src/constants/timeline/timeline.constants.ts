import type { FestivalDate } from "@/types/timeline/timeline.types";

// 축제 날짜 선택 버튼에 표시할 값을 관리합니다.
export const festivalDates: FestivalDate[] = [
  { value: "2026-05-13", label: "05.13 WED", caption: "DAY 1" },
  { value: "2026-05-14", label: "05.14 THU", caption: "DAY 2" },
  { value: "2026-05-15", label: "05.15 FRI", caption: "DAY 3" },
];

// 백엔드 카테고리 코드를 화면에 보여줄 한글 라벨로 변환합니다.
export const categoryLabels: Record<string, string> = {
  ALCOHOL: "주류",
  BAR: "주점",
  BOOTH: "부스",
  DJ: "DJ",
  ENTRY: "입장",
  EXPERIENCE: "체험",
  GOODS: "굿즈",
  MARKET: "마켓",
  SPECIAL: "스페셜",
  STAGE: "공연",
  TOUR: "투어",
};

// 카테고리 배지의 색상 스타일을 관리합니다.
export const categoryClassNames: Record<string, string> = {
  ALCOHOL: "bg-brand-coral/18 text-brand-coral-soft border-brand-coral/30",
  BAR: "bg-brand-coral/18 text-brand-coral-soft border-brand-coral/30",
  BOOTH: "bg-brand-blue/18 text-brand-blue-soft border-brand-blue/30",
  DJ: "bg-brand-mint/18 text-brand-mint-soft border-brand-mint/30",
  ENTRY: "bg-white/12 text-white/80 border-white/20",
  EXPERIENCE: "bg-brand-blue/18 text-brand-blue-soft border-brand-blue/30",
  GOODS: "bg-brand-yellow/18 text-brand-yellow-soft border-brand-yellow/30",
  MARKET: "bg-brand-mint/18 text-brand-mint-soft border-brand-mint/30",
  SPECIAL: "bg-brand-coral/18 text-brand-coral-soft border-brand-coral/30",
  STAGE: "bg-brand-yellow/18 text-brand-yellow-soft border-brand-yellow/30",
  TOUR: "bg-white/12 text-white/80 border-white/20",
};

// 타임테이블 막대 왼쪽 강조선 색상을 관리합니다.
export const categoryAccentClassNames: Record<string, string> = {
  ALCOHOL: "border-l-brand-coral",
  BAR: "border-l-brand-coral",
  BOOTH: "border-l-brand-blue",
  DJ: "border-l-brand-mint",
  ENTRY: "border-l-white/40",
  EXPERIENCE: "border-l-brand-blue",
  GOODS: "border-l-brand-yellow",
  MARKET: "border-l-brand-mint",
  SPECIAL: "border-l-brand-coral",
  STAGE: "border-l-brand-yellow",
  TOUR: "border-l-white/40",
};

// 행사 진행 상태 코드를 화면에 보여줄 한글 라벨로 변환합니다.
export const statusLabels = {
  SCHEDULED: "예정",
  ONGOING: "진행 중",
  ENDED: "종료",
} as const;

// 행사 진행 상태 배지의 색상 스타일을 관리합니다.
export const statusClassNames = {
  SCHEDULED: "border-brand-blue/30 bg-brand-blue/18 text-brand-blue-soft",
  ONGOING: "border-brand-mint/30 bg-brand-mint/18 text-brand-mint-soft",
  ENDED: "border-white/18 bg-white/10 text-text-muted",
} as const;

export const timetableStartHour = 11;
export const timetableEndHour = 25;
export const hourHeight = 92;
export const minBlockHeight = 56;

// 타임테이블 왼쪽 시간축에 표시할 시간 목록입니다.
export const hourMarks = Array.from(
  { length: timetableEndHour - timetableStartHour + 1 },
  (_, index) => timetableStartHour + index,
);
