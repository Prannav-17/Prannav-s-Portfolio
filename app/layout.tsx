import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import Motion from "@/components/Motion";
import "./globals.css";

const inter = localFont({ src: "../public/inter.woff2", variable: "--font", display: "swap", weight: "100 900" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--serif", display: "swap" });
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannav.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "Prannav | Ask me anything",
  description: "Prannav builds at the intersection of business, technology and AI. Ask the assistant about his work, or browse a live app and five product prototypes.",
  openGraph: { title: "Prannav | Ask me anything", description: "Ask the assistant anything about Prannav's work.", type: "website" },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint. "motion" turns on the animated states (skipped for people who ask for reduced motion);
// "seen" skips the intro loader after the first visit in a tab. If the animation code never starts, the
// failsafe removes "motion" so every element shows normally.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('motion');try{if(sessionStorage.getItem('pk-intro'))d.classList.add('seen')}catch(e){}
setTimeout(function(){if(!window.__motionReady)d.classList.remove('motion')},4000)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}
