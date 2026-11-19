import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <Image src="/brand/logo-mark.png" alt="JJ Ebube Enterprise" width={80} height={80} />
      <p className="mt-8 eyebrow text-gold-deep">404 — Off the shelf</p>
      <h1 className="mt-3 max-w-xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-navy">
        This page isn&apos;t in stock.
      </h1>
      <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-navy/50">
        The link may have moved or the product is no longer listed. Let&apos;s get you back to the essentials.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-gold">
          Shop all products <ShoppingBag className="size-4" />
        </Link>
        <Link href="/" className="btn btn-outline">
          <ArrowLeft className="size-4" /> Back home
        </Link>
      </div>
    </div>
  );
}
