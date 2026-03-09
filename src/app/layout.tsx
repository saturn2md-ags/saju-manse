import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "만세력 풀이 - 사주팔자 분석",
  description: "당신의 사주를 분석하고 쉬운 해석으로 알아보세요. 사주팔자, 십성, 오행, 대운, 세운, 신살까지 한눈에!",
  metadataBase: new URL("https://saju-manse.vercel.app"),
  openGraph: {
    title: "만세력 풀이 - 사주팔자 분석",
    description: "당신의 사주를 분석하고 쉬운 해석으로 알아보세요. 사주팔자, 십성, 오행, 대운, 세운, 신살까지 한눈에!",
    siteName: "만세력 풀이",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "만세력 풀이 - 사주팔자 분석",
    description: "당신의 사주를 분석하고 쉬운 해석으로 알아보세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
