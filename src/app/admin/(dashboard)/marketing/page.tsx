import Link from "next/link";
import { ArrowUpRight, Megaphone, Plus, Star, Trash2 } from "lucide-react";
import { AdminCard, AdminPageHeader, Flash } from "@/components/admin/ui";
import { deletePromotionAction, savePromotionAction, toggleFeaturedAction } from "@/app/admin/actions";
import { getPromotions, getProducts } from "@/lib/db";
import { ProductImage } from "@/components/product-image";

export default async function AdminMarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [promotions, products, query] = await Promise.all([getPromotions(), getProducts(), searchParams]);
  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured).slice(0, 16);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Marketing"
        title="Campaigns & Merchandising"
        description="Manage campaigns, choose what appears on the homepage and keep promotions current."
        action={
          <Link href="/admin/content" className="btn btn-outline h-10 text-[0.62rem]">
            Homepage hero <ArrowUpRight className="size-3.5" />
          </Link>
        }
      />
      <div className="mt-5">
        <Flash saved={query.saved} error={query.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <AdminCard title="Promotions">
            <div className="border-b border-navy/8 bg-ivory/50 px-5 py-3">
              <p className="text-[0.66rem] text-navy/45">
                Active promotions appear on the Deals page and can be linked to from anywhere on the store.
              </p>
            </div>
            {promotions.length === 0 && <p className="px-5 py-6 text-[0.72rem] text-navy/40">No promotions yet.</p>}
            <div className="divide-y divide-navy/8">
              {promotions.map((promo) => (
                <form key={promo.id} action={savePromotionAction} className="space-y-3 p-5">
                  <input type="hidden" name="id" value={promo.id} />
                  <div className="flex items-center justify-between">
                    <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">{promo.id}</span>
                    <label className="flex items-center gap-2 text-[0.65rem] text-navy/55">
                      <input type="checkbox" name="active" defaultChecked={promo.active} className="size-3.5 accent-[#d9ac42]" />
                      Active
                    </label>
                  </div>
                  <input name="title" defaultValue={promo.title} placeholder="Title" className="field h-9 text-[0.78rem]" />
                  <input name="subtitle" defaultValue={promo.subtitle} placeholder="Subtitle" className="field h-9 text-[0.74rem]" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input name="label" defaultValue={promo.label} placeholder="Button label" className="field h-9 text-[0.72rem]" />
                    <input name="href" defaultValue={promo.href} placeholder="/deals" className="field h-9 text-[0.72rem]" />
                  </div>
                  <div className="flex justify-between">
                    <button type="submit" className="h-8 bg-navy px-4 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-ivory">
                      Save changes
                    </button>
                  </div>
                </form>
              ))}
            </div>

            <div className="border-t border-navy/10 bg-ivory/40 p-5">
              <p className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">
                <Plus className="size-3.5" /> New promotion
              </p>
              <form action={savePromotionAction} className="mt-3 space-y-2">
                <input name="title" required placeholder="Campaign title" className="field h-9 text-[0.78rem]" />
                <input name="subtitle" placeholder="Supporting line" className="field h-9 text-[0.74rem]" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input name="label" placeholder="Button label (Shop now)" className="field h-9 text-[0.72rem]" />
                  <input name="href" placeholder="Link (/shop)" className="field h-9 text-[0.72rem]" />
                </div>
                <label className="flex items-center gap-2 text-[0.65rem] text-navy/55">
                  <input type="checkbox" name="active" defaultChecked className="size-3.5 accent-[#d9ac42]" /> Active
                </label>
                <button type="submit" className="h-9 w-full bg-gold text-[0.58rem] font-bold uppercase tracking-[0.1em] text-navy">
                  Create promotion
                </button>
              </form>
            </div>

            {promotions.length > 0 && (
              <div className="border-t border-navy/8 px-5 py-3">
                <p className="mb-2 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-navy/30">Remove a promotion</p>
                <div className="flex flex-wrap gap-2">
                  {promotions.map((p) => (
                    <form
                      key={p.id}
                      action={deletePromotionAction}
                      onSubmit={(e) => {
                        if (!window.confirm(`Delete “${p.title}”?`)) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="flex items-center gap-1 border border-navy/10 px-2 py-1.5 text-[0.58rem] text-navy/45 hover:border-red-300 hover:text-red-600">
                        <Trash2 className="size-3" /> {p.title.slice(0, 28)}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            )}
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard title={`Featured on homepage (${featured.length})`}>
            {featured.length === 0 ? (
              <p className="px-5 py-6 text-[0.72rem] text-navy/40">Feature products to populate the homepage shelf.</p>
            ) : (
              <ul className="divide-y divide-navy/6">
                {featured.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="relative size-9 shrink-0 overflow-hidden border border-navy/8 bg-ivory">
                      <ProductImage src={p.image} alt={p.name} brand={p.brandSlug} sizes="36px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.7rem] font-medium text-navy">{p.name}</span>
                      <span className="text-[0.56rem] text-navy/35">{p.packSize}</span>
                    </span>
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-gold-deep" aria-label="Remove from featured">
                        <Star className="size-3.5 fill-gold-deep" />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          <AdminCard title="Add to homepage">
            <div className="max-h-[320px] overflow-y-auto">
              <ul className="divide-y divide-navy/6">
                {rest.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className="min-w-0 flex-1 truncate text-[0.68rem] text-navy/70">{p.name}</span>
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="flex size-6 items-center justify-center text-navy/20 hover:text-gold-deep" aria-label="Feature product">
                        <Star className="size-3.5" />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          </AdminCard>

          <div className="border border-gold/30 bg-[#fbf7ec] p-5">
            <Megaphone className="size-4 text-gold-deep" />
            <p className="mt-2 font-display text-lg text-navy">A note on honest offers</p>
            <p className="mt-1.5 text-[0.68rem] leading-relaxed text-navy/50">
              Only describe a deal as a discount when a real higher price applies. Use the compare-at price field on a
              product for genuine reductions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
