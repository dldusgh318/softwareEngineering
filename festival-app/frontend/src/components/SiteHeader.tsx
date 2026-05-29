"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

type NavItem = {
  href: string;
  label: string;
  activeClassName: string;
  hoverClassName: string;
};

type SiteHeaderProps = {
  actionHref: string;
  actionLabel: string;
  fixed?: boolean;
  showNav?: boolean;
  actionVariant?: "filled" | "ghost";
};

const navItems: NavItem[] = [
  {
    href: "/performances",
    label: "공연",
    activeClassName: "text-brand-coral-soft",
    hoverClassName: "hover:text-brand-coral-soft",
  },
  {
    href: "/booths",
    label: "부스",
    activeClassName: "text-brand-mint-soft",
    hoverClassName: "hover:text-brand-mint-soft",
  },
  {
    href: "/schedule",
    label: "일정",
    activeClassName: "text-brand-yellow-soft",
    hoverClassName: "hover:text-brand-yellow-soft",
  },
  {
    href: "/map",
    label: "안내도",
    activeClassName: "text-brand-blue-soft",
    hoverClassName: "hover:text-brand-blue-soft",
  },
];

export default function SiteHeader({
  actionHref,
  actionLabel,
  fixed = false,
  showNav = false,
  actionVariant = "ghost",
}: SiteHeaderProps) {
  const pathname = usePathname() ?? "";
  const { isAuthenticated, isInitialized, logout, user } = useAuth();

  return (
    <header
      className={
        fixed
          ? "border-line-subtle bg-brand-navy/78 fixed inset-x-0 top-0 z-50 border-b shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          : "relative z-10"
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="홈으로 이동">
          <span
            className={
              fixed
                ? "bg-brand-cream text-brand-navy shadow-brand-cream/20 grid size-10 place-items-center rounded-full text-sm font-black shadow-lg"
                : "bg-brand-cream text-brand-navy grid size-10 place-items-center rounded-full text-sm font-black"
            }
          >
            HI
          </span>
          <span className="flex flex-col leading-none">
            <span className="typo-brand">Hongik University</span>
            <span className="text-text-muted mt-1 text-xs font-semibold">Festival Platform</span>
          </span>
        </Link>

        {showNav && (
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/72 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  className={`${item.hoverClassName} ${
                    isActive ? item.activeClassName : ""
                  } transition`}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {isInitialized && isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="hidden max-w-36 truncate text-sm font-bold text-white/78 sm:inline">
              {user?.name}
            </span>
            <Link
              href="/performances/tickets"
              className="rounded-full border border-white/16 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              내 예매
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/16 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href={actionHref}
            className={
              actionVariant === "filled"
                ? "bg-brand-cream text-brand-navy hover:bg-brand-coral rounded-full px-4 py-2 text-sm font-black shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:text-white sm:px-5"
                : "rounded-full border border-white/16 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
            }
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
