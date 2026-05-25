import type { Booth, QrFailureReservationStatus } from "@/types/booth/booths.types";

export const boothCategoryLabels: Record<Booth["category"], string> = {
  FOOD: "푸드",
  GOODS: "굿즈",
  EXPERIENCE: "체험",
  EVENT: "이벤트",
};

export const boothCategoryStyles: Record<Booth["category"], string> = {
  FOOD: "border-red-200 bg-red-50 text-red-700",
  GOODS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  EXPERIENCE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EVENT: "border-amber-200 bg-amber-50 text-amber-800",
};

export const campusLandmarks = [
  {
    name: "학생회관",
    description: "부스 A 구역 기준점",
    mapX: 22,
    mapY: 32,
  },
  {
    name: "중앙광장",
    description: "메인 행사장",
    mapX: 54,
    mapY: 45,
  },
  {
    name: "홍문관",
    description: "굿즈 부스 인근",
    mapX: 76,
    mapY: 28,
  },
  {
    name: "운동장",
    description: "체험/이벤트 존",
    mapX: 42,
    mapY: 72,
  },
] as const;

export const boothReservationStatusLabels: Record<QrFailureReservationStatus, string> = {
  PENDING_APPROVAL: "승인 대기",
  APPROVED: "승인 완료",
  QR_FAILED: "QR 실패",
  RESERVED: "예약 완료",
  CHECKED_IN: "체크인 완료",
  COMPLETED: "이용 완료",
  CANCELLED: "예약 취소",
};

export const boothReservationStatusStyles: Record<QrFailureReservationStatus, string> = {
  PENDING_APPROVAL: "border-amber-300 bg-amber-50 text-amber-800",
  APPROVED: "border-sky-300 bg-sky-50 text-sky-800",
  QR_FAILED: "border-rose-300 bg-rose-50 text-rose-800",
  RESERVED: "border-emerald-300 bg-emerald-50 text-emerald-800",
  CHECKED_IN: "border-zinc-300 bg-zinc-50 text-zinc-700",
  COMPLETED: "border-violet-300 bg-violet-50 text-violet-800",
  CANCELLED: "border-neutral-300 bg-neutral-50 text-neutral-700",
};
