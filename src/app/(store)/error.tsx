"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function StoreError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-edge flex flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-gold-deep">Something went wrong</p>
      <h1 className="mt-3 font-display text-[2.4rem] leading-tight text-navy">This shelf needs a moment.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/50">
        We couldn&apos;t load this page. Try again — if it persists, our team can help you order on WhatsApp.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-navy">
          <RefreshCw className="size-4" /> Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
