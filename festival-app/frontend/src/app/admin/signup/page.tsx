"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/providers/AuthProvider";
import { getAuthErrorMessage } from "@/utils/auth-error";

export default function AdminSignupPage() {
  const router = useRouter();
  const { signupAdmin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signupAdmin({ name, email, password });
      router.replace("/booths/admin/reservations");
    } catch (error) {
      setErrorMessage(await getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <p className="text-brand-mint-soft text-sm font-black">ADMIN SIGN UP</p>
            <h1 className="mt-2 text-3xl font-black">관리자 가입</h1>
            <p className="typo-caption text-text-muted mt-3">
              부스 예약 승인과 QR 발급 처리를 담당할 관리자 계정을 만듭니다.
            </p>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-white/74">이름</span>
              <input
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
                required
                type="text"
                value={name}
                placeholder="관리자"
                className="focus:border-brand-cream h-12 rounded-2xl border border-white/14 bg-white/10 px-4 text-white transition outline-none placeholder:text-white/36 focus:bg-white/14"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-white/74">이메일</span>
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
                placeholder="admin@hongik.ac.kr"
                className="focus:border-brand-cream h-12 rounded-2xl border border-white/14 bg-white/10 px-4 text-white transition outline-none placeholder:text-white/36 focus:bg-white/14"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-white/74">비밀번호</span>
              <input
                autoComplete="new-password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
                placeholder="비밀번호를 입력하세요"
                className="focus:border-brand-cream h-12 rounded-2xl border border-white/14 bg-white/10 px-4 text-white transition outline-none placeholder:text-white/36 focus:bg-white/14"
              />
            </label>

            {errorMessage ? (
              <p className="rounded-2xl border border-red-300/40 bg-red-500/14 px-4 py-3 text-sm font-semibold text-red-100">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-mint shadow-brand-mint/20 hover:bg-brand-mint-soft h-12 rounded-2xl text-sm font-black text-zinc-950 shadow-lg transition hover:-translate-y-0.5"
            >
              {isSubmitting ? "가입 중" : "관리자 가입"}
            </button>
          </form>

          <p className="typo-caption text-text-muted mt-6 text-center">
            일반 계정은{" "}
            <Link href="/signup" className="text-brand-cream font-black">
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
