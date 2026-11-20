import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "You're offline",
  description: "Reconnect to continue shopping with JJ Ebube Enterprise.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-5 py-16">
      <div className="w-full max-w-md border border-navy/10 bg-white p-8 text-center shadow-card md:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="eyebrow mt-8 text-gold-deep">No connection</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-navy">You&apos;re offline.</h1>
        <p className="mx-auto mt-3 max-w-xs text-[0.82rem] leading-relaxed text-navy/50">
          Check your internet connection, then try again. Your cart and saved items will still be here.
        </p>
        <Link href="/" className="btn btn-navy mt-6 h-11 w-full text-[0.65rem]">
          Try again
        </Link>
      </div>
    </main>
  );
}
