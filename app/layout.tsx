import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({ src: "../public/inter.woff2", variable: "--font", display: "swap", weight: "100 900" });
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannav.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "Prannav | Ask me anything",
  description: "Prannav builds at the intersection of business, technology and AI. Ask the assistant about his work, or browse a live app and five product mockups.",
  openGraph: { title: "Prannav | Ask me anything", description: "Ask the assistant anything about Prannav's work.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={inter.variable}><body>{children}</body></html>);
}
