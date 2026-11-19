"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { useUIStore } from "@/lib/store";

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-20 left-4 right-4 z-[100] flex flex-col items-center gap-2 sm:left-6 sm:right-auto sm:items-start lg:bottom-6">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} title={toast.title} message={toast.message} href={toast.href} actionLabel={toast.actionLabel} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  title,
  message,
  href,
  actionLabel,
  onDismiss,
}: {
  id: number;
  title: string;
  message?: string;
  href?: string;
  actionLabel?: string;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 4200);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  return (
    <div className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 border border-navy/10 bg-white px-4 py-3.5 shadow-[0_20px_50px_-15px_rgba(7,26,58,0.4)]">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.8rem] font-semibold leading-snug text-navy">{title}</p>
        {message && <p className="mt-0.5 text-[0.72rem] leading-snug text-navy/50">{message}</p>}
        {href && actionLabel && (
          <Link
            href={href}
            onClick={() => onDismiss(id)}
            className="mt-1.5 inline-block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-gold-deep underline underline-offset-2"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="shrink-0 p-1 text-navy/30 hover:text-navy"
        aria-label="Dismiss notification"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
