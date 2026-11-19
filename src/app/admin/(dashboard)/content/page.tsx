import { AdminCard, AdminField, AdminPageHeader, AdminTextarea, Flash } from "@/components/admin/ui";
import { saveHeroAction, saveHomeContentAction, saveSettingsAction } from "@/app/admin/actions";
import { getHomeContent, getSettings } from "@/lib/db";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [settings, content, query] = await Promise.all([getSettings(), getHomeContent(), searchParams]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Content"
        title="Storefront Content"
        description="Update the words customers read, your contact details and delivery settings. Changes go live immediately."
      />
      <div className="mt-5">
        <Flash saved={query.saved} error={query.error} />
      </div>

      <div className="space-y-5">
        <AdminCard title="Store details & delivery">
          <form action={saveSettingsAction} className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AdminField label="Store name" name="storeName" defaultValue={settings.storeName} />
              <AdminField label="Tagline" name="tagline" defaultValue={settings.tagline} />
              <AdminField label="Announcement bar" name="announcement" defaultValue={settings.announcement} hint="Use • to separate messages" />
              <AdminField label="Phone number" name="phone" defaultValue={settings.phone} />
              <AdminField label="WhatsApp number" name="whatsapp" defaultValue={settings.whatsapp} hint="International format, e.g. +2347062129563" />
              <AdminField label="Email (optional)" name="email" type="email" defaultValue={settings.email} />
              <AdminField label="Opening hours" name="hours" defaultValue={settings.hours} />
              <AdminField label="Free delivery threshold (₦)" name="freeShippingThreshold" type="number" defaultValue={settings.freeShippingThreshold} />
              <AdminField label="Office address" name="address" defaultValue={settings.address} />
              <AdminField label="Branch address" name="branchAddress" defaultValue={settings.branchAddress} />
            </div>

            <div className="mt-6 border-t border-navy/8 pt-5">
              <h3 className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-navy">Delivery zones & fees</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {settings.deliveryZones.map((zone) => (
                  <div key={zone.id} className="border border-navy/8 bg-ivory/40 p-3">
                    <p className="text-[0.52rem] font-bold uppercase tracking-[0.1em] text-navy/30">{zone.id}</p>
                    <div className="mt-2 space-y-2">
                      <input name={`zone_${zone.id}`} defaultValue={zone.name} className="field h-9 text-[0.72rem]" />
                      <input name={`fee_${zone.id}`} type="number" defaultValue={zone.fee} className="field h-9 text-[0.72rem]" placeholder="Fee in naira" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-navy/8 pt-5">
              <h3 className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-navy">Bank transfer details</h3>
              <p className="mt-1 text-[0.62rem] text-navy/40">
                Leave blank until verified — checkout will instead tell customers the details will be shared on WhatsApp.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <AdminField label="Bank name" name="bankName" defaultValue={settings.bankTransfer.bankName} />
                <AdminField label="Account name" name="accountName" defaultValue={settings.bankTransfer.accountName} />
                <AdminField label="Account number" name="accountNumber" defaultValue={settings.bankTransfer.accountNumber} />
              </div>
            </div>

            <div className="mt-6 border-t border-navy/8 pt-5">
              <h3 className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-navy">Social links</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminField label="Instagram" name="instagram" defaultValue={settings.socials.instagram} />
                <AdminField label="Facebook" name="facebook" defaultValue={settings.socials.facebook} />
                <AdminField label="X / Twitter" name="x" defaultValue={settings.socials.x} />
                <AdminField label="TikTok" name="tiktok" defaultValue={settings.socials.tiktok} />
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-navy/8 pt-4">
              <button type="submit" className="btn btn-navy h-10 text-[0.62rem]">Save store settings</button>
            </div>
          </form>
        </AdminCard>

        <div className="grid gap-5 xl:grid-cols-2">
          <AdminCard title="Homepage hero">
            <form action={saveHeroAction} className="space-y-4 p-5">
              <AdminField label="Eyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
              <AdminTextarea label="Headline" name="heroTitle" defaultValue={settings.heroTitle} rows={2} />
              <AdminField
                label="Gold highlight phrase"
                name="heroHighlight"
                defaultValue={settings.heroHighlight}
                hint="Must appear exactly within the headline"
              />
              <AdminTextarea label="Supporting copy" name="heroBody" defaultValue={settings.heroBody} rows={3} />
              <div className="flex justify-end border-t border-navy/8 pt-4">
                <button type="submit" className="btn btn-navy h-10 text-[0.62rem]">Save hero</button>
              </div>
            </form>
          </AdminCard>

          <AdminCard title="About & story">
            <form action={saveSettingsAction} className="space-y-4 p-5">
              <input type="hidden" name="storeName" value={settings.storeName} />
              <input type="hidden" name="tagline" value={settings.tagline} />
              <input type="hidden" name="announcement" value={settings.announcement} />
              <input type="hidden" name="phone" value={settings.phone} />
              <input type="hidden" name="whatsapp" value={settings.whatsapp} />
              <input type="hidden" name="email" value={settings.email} />
              <input type="hidden" name="hours" value={settings.hours} />
              <input type="hidden" name="freeShippingThreshold" value={settings.freeShippingThreshold} />
              <input type="hidden" name="address" value={settings.address} />
              <input type="hidden" name="branchAddress" value={settings.branchAddress} />
              <input type="hidden" name="bankName" value={settings.bankTransfer.bankName} />
              <input type="hidden" name="accountName" value={settings.bankTransfer.accountName} />
              <input type="hidden" name="accountNumber" value={settings.bankTransfer.accountNumber} />
              {settings.deliveryZones.map((zone) => (
                <span key={zone.id}>
                  <input type="hidden" name={`zone_${zone.id}`} value={zone.name} />
                  <input type="hidden" name={`fee_${zone.id}`} value={zone.fee} />
                </span>
              ))}
              {Object.entries(settings.socials).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
              <AdminField label="Story heading" name="aboutTitle" defaultValue={settings.aboutTitle} />
              <AdminTextarea label="Story copy" name="aboutBody" defaultValue={settings.aboutBody} rows={5} />
              <div className="flex justify-end border-t border-navy/8 pt-4">
                <button type="submit" className="btn btn-navy h-10 text-[0.62rem]">Save story</button>
              </div>
            </form>
          </AdminCard>
        </div>

        <AdminCard title="Homepage sections">
          <form action={saveHomeContentAction} className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Categories heading" name="categoriesHeading" defaultValue={content.categoriesHeading} />
              <AdminField label="Categories subheading" name="categoriesSubheading" defaultValue={content.categoriesSubheading} />
              <AdminField label="Featured heading" name="featuredHeading" defaultValue={content.featuredHeading} />
              <AdminField label="Featured subheading" name="featuredSubheading" defaultValue={content.featuredSubheading} />
              <AdminField label="Brands heading" name="brandsHeading" defaultValue={content.brandsHeading} />
              <AdminField label="Wholesale heading" name="wholesaleHeading" defaultValue={content.wholesaleHeading} />
              <div className="sm:col-span-2">
                <AdminTextarea label="Wholesale body" name="wholesaleBody" defaultValue={content.wholesaleBody} rows={2} />
              </div>
            </div>

            <div className="mt-5 border-t border-navy/8 pt-5">
              <h3 className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-navy">Promotional banner</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <AdminField label="Eyebrow" name="promoEyebrow" defaultValue={content.promoEyebrow} />
                <AdminField label="Button label" name="promoButton" defaultValue={content.promoButton} />
                <div className="sm:col-span-2">
                  <AdminTextarea label="Headline" name="promoTitle" defaultValue={content.promoTitle} rows={2} />
                </div>
                <div className="sm:col-span-2">
                  <AdminTextarea label="Supporting copy" name="promoBody" defaultValue={content.promoBody} rows={2} />
                </div>
                <AdminField label="Button link" name="promoHref" defaultValue={content.promoHref} />
              </div>
            </div>

            <div className="mt-5 flex justify-end border-t border-navy/8 pt-4">
              <button type="submit" className="btn btn-navy h-10 text-[0.62rem]">Save homepage content</button>
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
