export type TimelineEventStatus = "SCHEDULED" | "ONGOING" | "ENDED";

// 백엔드 타임라인 API에서 내려주는 행사 일정 데이터입니다.
export type TimelineEvent = {
  id: number;
  title: string;
  category: string;
  startsAt: string;
  endsAt: string;
  location: string;
  description?: string;
  status?: TimelineEventStatus;
};

// 날짜 선택 탭에 필요한 표시 데이터입니다.
export type FestivalDate = {
  value: string;
  label: string;
  caption: string;
};

// 타임테이블 막대 렌더링을 위해 계산된 일정 데이터입니다.
export type TimelineBlock = TimelineEvent & {
  lane: number;
  top: number;
  height: number;
  startMinute: number;
  endMinute: number;
};
