import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JJ Ebube Enterprise — Quality Products. Better Life.",
    template: "%s | JJ Ebube Enterprise",
  },
  description:
    "Your trusted store for quality products. Shop milk, tea, cocoa, seasoning, noodles and everyday essentials — retail, wholesale and bulk orders across Nigeria.",
  keywords: [
    "JJ Ebube Enterprise",
    "Nigerian grocery store",
    "buy milk Nigeria",
    "wholesale food distributor Nigeria",
    "FMCG Nigeria",
    "online supermarket Nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "JJ Ebube Enterprise",
    title: "JJ Ebube Enterprise — Quality Products. Better Life.",
    description:
      "Quality food, drinks and household essentials for homes, shops and businesses across Nigeria.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "JJ Ebube Enterprise — Quality Products. Better Life.",
    description: "Quality food, drinks and household essentials — retail, wholesale and bulk orders.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-ivory font-sans text-charcoal antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var seen=sessionStorage.getItem('jje-brand-intro-seen');var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!seen&&!reduce){document.documentElement.setAttribute('data-brand-intro','active');}}catch(e){}})();",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:text-ivory"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
