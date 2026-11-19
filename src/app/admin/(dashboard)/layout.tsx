import { AdminMobileBar, AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] bg-navy lg:block">
        <AdminNav />
      </aside>
      <AdminMobileBar />
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-navy/8 bg-white/95 px-8 py-3 backdrop-blur lg:flex">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy/35">
            JJ Ebube Enterprise · Admin dashboard
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[0.62rem] font-medium text-navy/40">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Store online
            </span>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
