import type { Metadata } from "next";

import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hongik Festival",
  description:
    "홍익대학교 축제 공연, 부스, 타임테이블 정보를 쉽고 빠르게 확인할 수 있는 축제 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
