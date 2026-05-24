import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

const serviceLinks = [
  {
    href: "/performances",
    label: "공연 예매",
    description: "라인업 확인부터 좌석 선택까지 빠르게",
    icon: "♪",
    accent: "bg-brand-coral",
  },
  {
    href: "/booths",
    label: "부스 예약",
    description: "먹거리, 체험, 굿즈 부스를 한눈에",
    icon: "□",
    accent: "bg-brand-mint",
  },
  {
    href: "/schedule",
    label: "축제 일정",
    description: "공연과 부스 운영 시간을 한눈에",
    icon: "◷",
    accent: "bg-brand-yellow",
  },
  {
    href: "/map",
    label: "축제 안내도",
    description: "공연장, 화장실, 부스 위치까지 정확하게",
    icon: "⌖",
    accent: "bg-brand-blue",
  },
];

export default function Home() {
  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="로그인" actionVariant="filled" fixed showNav />

      <section className="relative min-h-190 overflow-hidden pt-16 lg:min-h-205 lg:pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/festival-mascot-hero.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(16_25_54/0.96)_0%,rgb(16_25_54/0.84)_34%,rgb(16_25_54/0.38)_68%,rgb(16_25_54/0.08)_100%)]" />
        <div className="from-brand-navy absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent" />

        <div className="relative mx-auto flex min-h-170 w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-185 lg:px-8">
          <div className="max-w-3xl">
            <p className="typo-caption text-brand-cream mb-5 inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 font-bold backdrop-blur">
              와우와 함께 즐기는 축제 플랫폼
            </p>
            <h1 className="typo-display">
              공연 예매부터
              <br />
              현장 안내까지
            </h1>
            <p className="typo-body text-text-secondary mt-6 max-w-2xl sm:text-lg">
              축제 공연 예매, 부스 예약, 전체 일정 확인, 안내도를 한 번에 연결해 방문자가 더 빠르게
              움직이고 더 오래 즐기게 만듭니다.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
              {serviceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-surface-glass hover:bg-surface-glass-hover focus:ring-brand-cream group flex min-h-24 items-center gap-4 rounded-2xl border border-white/14 p-4 text-left shadow-2xl shadow-black/10 backdrop-blur-md transition hover:-translate-y-1 focus:ring-2 focus:outline-none"
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-xl ${item.accent} text-2xl font-black text-white shadow-lg transition group-hover:scale-105`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-lg font-black">{item.label}</span>
                    <span className="typo-caption text-text-muted mt-1 block">
                      {item.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
