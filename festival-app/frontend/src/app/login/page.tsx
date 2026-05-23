import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <main className="bg-brand-navy text-text-primary relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-28"
        style={{ backgroundImage: "url('/festival-mascot-hero.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(16_25_54/0.98)_0%,rgb(16_25_54/0.9)_48%,rgb(16_25_54/0.72)_100%)]" />

      <SiteHeader actionHref="/" actionLabel="홈으로" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <div className="hidden max-w-xl lg:block">
          <p className="typo-caption text-brand-cream mb-5 inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 font-bold backdrop-blur">
            축제 입장 전, 계정부터 가볍게
          </p>
          <h1 className="typo-title">
            예매와 예약,
            <br />
            축제 일정을 이어서 확인하세요
          </h1>
          <p className="typo-body text-text-secondary mt-5">
            로그인하면 공연 예매 내역, 부스 예약, 축제 일정과 안내도 정보를 한 번에 확인할 수
            있습니다.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-4xl border border-white/14 bg-white/11 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-7">
          <div>
            <p className="text-brand-coral-soft text-sm font-black">LOGIN</p>
            <h2 className="mt-2 text-3xl font-black">다시 만나서 반가워요</h2>
            <p className="typo-caption text-text-muted mt-3">
              홍익 축제 플랫폼 계정으로 로그인하세요.
            </p>
          </div>

          <form className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-white/74">이메일</span>
              <input
                type="email"
                placeholder="wow@hongik.ac.kr"
                className="focus:border-brand-cream h-12 rounded-2xl border border-white/14 bg-white/10 px-4 text-white transition outline-none placeholder:text-white/36 focus:bg-white/14"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-white/74">비밀번호</span>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="focus:border-brand-cream h-12 rounded-2xl border border-white/14 bg-white/10 px-4 text-white transition outline-none placeholder:text-white/36 focus:bg-white/14"
              />
            </label>

            <button
              type="submit"
              className="bg-brand-coral shadow-brand-coral/25 hover:bg-brand-coral-soft hover:text-brand-navy h-12 rounded-2xl text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
            >
              로그인
            </button>
          </form>

          <p className="typo-caption text-text-muted mt-6 text-center">
            아직 계정이 없다면{" "}
            <Link href="/signup" className="text-brand-cream font-black">
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
