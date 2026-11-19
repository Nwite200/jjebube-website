import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { isAdmin, isDefaultAdminPassword } from "@/lib/auth";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const defaultPassword = isDefaultAdminPassword();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="noise relative hidden overflow-hidden bg-navy p-12 text-ivory lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[20%] -top-[20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.18),transparent_65%)]" />
          <svg className="absolute bottom-[-10%] left-[-10%] h-[520px] w-[520px] opacity-20" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="198" stroke="#D9AC42" strokeWidth="0.6" />
            <circle cx="200" cy="200" r="150" stroke="#D9AC42" strokeWidth="0.4" strokeDasharray="3 8" />
            <circle cx="200" cy="200" r="100" stroke="#D9AC42" strokeWidth="0.3" />
          </svg>
        </div>
        <div className="relative">
          <Logo inverted />
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow text-gold-soft/70">Store operations</p>
          <h1 className="mt-4 font-display text-[3.2rem] leading-[1.02]">The quiet engine behind the shelf.</h1>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-ivory/50">
            Manage products, orders, wholesale enquiries and the content customers see — all in one place.
          </p>
        </div>
        <p className="relative flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.12em] text-ivory/30">
          <ShieldCheck className="size-3.5 text-gold/70" /> Protected admin access
        </p>
      </div>

      <div className="flex items-center justify-center bg-ivory px-5 py-12">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden">
            <Logo />
          </div>
          <p className="mt-8 eyebrow text-gold-deep lg:mt-0">Admin access</p>
          <h2 className="mt-2 font-display text-[2.2rem] leading-tight text-navy">Welcome back.</h2>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-navy/45">Sign in to manage JJ Ebube Enterprise.</p>

          <form action={loginAction} className="mt-7 space-y-4">
            <label className="block">
              <span className="field-label">Admin password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy/30" />
                <input
                  name="password"
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter your password"
                  className="field pl-10"
                />
              </div>
            </label>

            {error === "invalid" && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-[0.75rem] text-red-700">
                That password doesn&apos;t match. Please try again.
              </p>
            )}

            <button type="submit" className="btn btn-navy w-full">
              Sign in <ArrowRight className="size-4" />
            </button>
          </form>

          {defaultPassword && (
            <div className="mt-6 border border-amber-200 bg-amber-50 px-4 py-3 text-[0.7rem] leading-relaxed text-amber-800">
              <strong>Development default:</strong> the password is <code className="font-mono">jjebube-admin</code>.
              Set <code className="font-mono">ADMIN_PASSWORD</code> and <code className="font-mono">AUTH_SECRET</code> in
              your environment before deploying.
            </div>
          )}

          <p className="mt-8 text-[0.62rem] text-navy/30">Authorised staff only.</p>
        </div>
      </div>
    </div>
  );
}
