import Link from "next/link";

type PerformanceReservationPanelProps = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  remainingSeats: number;
};

export default function PerformanceReservationPanel({
  isAuthenticated,
  isInitialized,
  remainingSeats,
}: PerformanceReservationPanelProps) {
  const isSoldOut = remainingSeats <= 0;

  return (
    <section className="rounded-2xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
      <h2 className="text-xl font-black">예매</h2>
      <p className="typo-caption text-text-muted mt-2">이후 티켓 예매 기능이 연결될 영역입니다.</p>

      <div className="mt-5 rounded-xl border border-white/12 bg-black/12 p-4">
        <p className="text-text-muted text-xs font-bold">잔여 좌석</p>
        <p className="mt-1 text-3xl font-black">{remainingSeats.toLocaleString("ko-KR")}석</p>
      </div>

      {!isInitialized ? (
        <button
          type="button"
          disabled
          className="mt-5 h-11 w-full rounded-full bg-white/12 text-sm font-black text-white/60"
        >
          로그인 상태 확인 중
        </button>
      ) : isSoldOut ? (
        <button
          type="button"
          disabled
          className="mt-5 h-11 w-full rounded-full bg-white/12 text-sm font-black text-white/60"
        >
          매진
        </button>
      ) : isAuthenticated ? (
        <button
          type="button"
          disabled
          className="bg-brand-coral mt-5 h-11 w-full rounded-full text-sm font-black text-white opacity-75"
        >
          예매 기능 준비 중
        </button>
      ) : (
        <Link
          href="/login?redirect=/performances"
          className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy mt-5 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-black text-white transition"
        >
          로그인하고 예매하기
        </Link>
      )}
    </section>
  );
}
