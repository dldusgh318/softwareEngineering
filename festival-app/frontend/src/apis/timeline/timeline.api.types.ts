export type GetTimelineParams = {
  date: string;
  signal?: AbortSignal;
};

export type GetTimelineEventParams = {
  id: number;
  signal?: AbortSignal;
};
