import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

export default function SignupPage() {
  return (
    <main className="bg-brand-navy text-text-primary relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-24"
        style={{ backgroundImage: "url('/festival-mascot-hero.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(16_25_54/0.98)_0%,rgb(16_25_54/0.9)_52%,rgb(16_25_54/0.74)_100%)]" />

      <SiteHeader actionHref="/login" actionLabel="로그인" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-4xl border border-white/14 bg-white/11 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-7">
          <div>
            <p className="text-brand-coral-soft text-sm font-black">SIGN UP</p>
            <h1 className="mt-2 text-3xl font-black">회원가입</h1>
            <p className="typo-caption text-text-muted mt-3">
              축제 플랫폼을 이용할 계정을 만들어주세요.
            </p>
          </div>

          <form className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-white/74">이름</span>
              <input
                type="text"
                placeholder="홍길동"
                className="focus:border-brand-cream h-12 rounded-2xl border border-white/14 bg-white/10 px-4 text-white transition outline-none placeholder:text-white/36 focus:bg-white/14"
              />
            </label>

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
              가입하기
            </button>
          </form>

          <p className="typo-caption text-text-muted mt-6 text-center">
            이미 계정이 있다면{" "}
            <Link href="/login" className="text-brand-cream font-black">
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
