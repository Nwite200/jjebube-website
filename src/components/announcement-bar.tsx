import { ShieldCheck, Tags, Truck } from "lucide-react";
import { getSettings } from "@/lib/db";

export async function AnnouncementBar() {
  const settings = await getSettings();
  const items = settings.announcement
    .split("•")
    .map((s) => s.trim())
    .filter(Boolean);

  const icons = [ShieldCheck, Tags, Truck];

  return (
    <div className="relative z-50 bg-navy text-ivory">
      <div className="container-edge flex h-9 items-center justify-between gap-6">
        <div className="hidden items-center gap-7 sm:flex">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <span key={item} className="flex items-center gap-2">
                {i > 0 && <span className="mr-4 size-0.5 rounded-full bg-gold/50" />}
                <Icon className="size-3 text-gold" strokeWidth={1.8} />
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory/80">
                  {item}
                </span>
              </span>
            );
          })}
        </div>

        <div className="w-full overflow-hidden sm:hidden">
          <div className="flex w-max animate-marquee items-center gap-8">
            {[0, 1].map((pass) => (
              <div key={pass} className="flex items-center gap-8 whitespace-nowrap">
                {items.map((item) => (
                  <span
                    key={`${pass}-${item}`}
                    className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-ivory/85"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <span className="hidden shrink-0 items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ivory/70 md:flex">
          <span className="size-1 rounded-full bg-gold" />
          Need help?{" "}
          <a href={`tel:${settings.phone}`} className="transition-colors hover:text-gold-soft">
            {settings.phone}
          </a>
          {settings.phoneAlt && (
            <>
              <span className="text-ivory/35">or</span>
              <a href={`tel:${settings.phoneAlt}`} className="transition-colors hover:text-gold-soft">
                {settings.phoneAlt}
              </a>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
