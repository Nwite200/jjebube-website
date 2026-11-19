import { AnnouncementBar } from "@/components/announcement-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileTabBar } from "@/components/mobile-tabbar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";
import { Toaster } from "@/components/toaster";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BrandIntro } from "@/components/brand/brand-intro";
import { GlobalBrandActivity } from "@/components/brand/global-brand-activity";
import { PageTransition } from "@/components/brand/page-transition";
import { getBrands, getCategories, getProducts, getSettings } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [products, brands, categories, settings] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
    getSettings(),
  ]);

  const clientProducts = toClientProducts(products, brands);

  return (
    <StoreProvider
      products={clientProducts}
      config={{
        whatsapp: settings.whatsapp,
        phone: settings.phone,
        freeShippingThreshold: settings.freeShippingThreshold,
        deliveryZones: settings.deliveryZones,
      }}
    >
      <AnnouncementBar />
      <SiteHeader categories={categories.map(({ slug, name }) => ({ slug, name }))} />
      <main id="main" className="min-h-[60vh]">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <div className="h-[58px] lg:hidden" aria-hidden="true" />
      <div className="h-4 lg:hidden" aria-hidden="true" />
      <CartDrawer />
      <Toaster />
      <WhatsAppFab />
      <MobileTabBar />
      <GlobalBrandActivity />
      <BrandIntro />
    </StoreProvider>
  );
}
