# JJ EBUBE ENTERPRISE — Storefront & Admin

A premium Nigerian FMCG e-commerce experience built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. The storefront covers retail shopping, wholesale enquiries, WhatsApp ordering and a protected admin desk for running the whole store.

> Positioning: **Your Trusted Store for Quality Products.**
> Tagline: **Quality Products. Better Life.**

---

## Quick start

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD + AUTH_SECRET before deploying
npm run dev
```

Open http://localhost:3000

- Storefront: `/`
- Admin: `/admin` (development password: `jjebube-admin` unless `ADMIN_PASSWORD` is set)
- Admin sign-in: `/admin/login`

Production build:

```bash
npm run build
npm start
```

---

## Environment

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Admin sign-in password. **Set this before deploying.** |
| `AUTH_SECRET` | Long random string used to sign the admin session cookie. |
| `NEXT_PUBLIC_SITE_URL` | Public origin, used in metadata, sitemap, Paystack callbacks. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` + `PAYSTACK_SECRET_KEY` | Enable card payments. Card checkout stays hidden until both exist. |

Paystack webhook URL: `https://your-domain.com/api/paystack/webhook`.
Paystack callback URL is set automatically when a transaction is initialised.

---

## What is included

### Storefront
- Cinematic navy/gold homepage: hero product composition, trust strip, category rail, featured shelf, campaign banner, brand story, brand grid, wholesale call-to-action.
- Full catalogue with search, category/brand/price/availability/pack-size filters, sorting, load-more.
- Product pages with gallery container, stock, price, quantity, add to bag, buy now, WhatsApp enquiry, details accordions and related products.
- Persistent cart (localStorage) with drawer, quantity management, delivery progress, cart page, WhatsApp checkout option.
- Checkout with server-side repricing, stock checks, delivery zones, order persistence and a designed confirmation page.
- Wholesale page with a functional bulk quote form plus WhatsApp submission.
- Contact form, newsletter, wishlist, order tracking, search overlay (`⌘K`), mobile tab bar, floating WhatsApp.
- SEO: metadata, canonical URLs, Open Graph image, Product/Organisation JSON-LD, sitemap, robots.

### Admin (`/admin`)
- Overview: paid revenue, orders, customers, product count, pending work, low stock.
- Products: create/edit/delete, image URL or upload, gallery, pricing, stock, SKU, pack size, featured/new.
- Orders: search/filter, customer details, fulfilment status, payment status, manual payment confirmation with an explicit integrity warning.
- Wholesale enquiries: full details, status workflow, WhatsApp/call links.
- Messages: contact inbox with read state.
- Marketing: campaign/promotion management, homepage featured product merchandising.
- Content: announcement bar, hero, homepage section headings, promo banner, contact details, delivery zones and fees, bank details, social links.
- Catalogue: categories and brands with safe-delete guards.

---

## Data & persistence

The project ships with a zero-configuration file data store under `/data`:

- `catalog.json` — categories, brands, products
- `orders.json` — placed orders
- `inquiries.json` — wholesale enquiries
- `messages.json` — contact messages
- `subscribers.json` — newsletter subscribers
- `promotions.json` — campaigns
- `settings.json`, `content.json` — storefront configuration

Uploaded admin images are written to `/public/uploads`.

This works well on a VPS or any host with a persistent disk. **On serverless platforms with ephemeral filesystems, writes are not durable** — move the repository layer in `src/lib/db.ts` to Postgres/Supabase (or object storage) before taking live orders. The storefront and admin logic are intentionally kept behind that data layer so the swap is contained.

### Production checklist
1. Set `ADMIN_PASSWORD`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.
2. Move JSON writes to a persistent database and image uploads to object storage.
3. Add real bank transfer details in Admin → Content (never invent them).
4. Set Paystack keys and configure the webhook.
5. Verify every price, pack size, stock quantity and product image.

---

## Catalogue & pricing integrity

The catalogue is seeded with the products featured in the brief (Dano, Lipton, Kerrygold, Cremora, Onga, Top Tea, Milo, Peak and others). Only prices explicitly provided in the brief are published; everything else intentionally displays **“Price on request”** and routes customers to a WhatsApp/quote flow.

- Prices are never invented by the storefront.
- Products without a published price cannot be added to the cart.
- Discount badges only render when a genuine `compareAtPrice` is configured.
- Admin pricing fields warn against entering unverified prices.

Add or adjust the rest of your inventory in Admin → Products. If your full inventory sheet exists, it can be imported into `data/catalog.json` or a database.

### Real catalogue import

The storefront catalogue was rebuilt from the company's `products_import_filled (1).xlsx` workbook: **77 products** across milk/creamers, evaporated milk, tea/coffee, cocoa, sugar, seasoning, food mixes, noodles, glucose, tomato/sauces and other grocery.

- The template's purchase/selling values (100/120) are import placeholders and were **not** published. Only verified prices from the original brief remain: Dano 1kg, Lipton Box, Kerrygold 750g, Top Tea Ginger and Onga Beef x100. Everything else displays **Price on request**.
- Opening stock was blank in the workbook, so only the five priced lines carry a starter quantity for online checkout. Update real prices and stock in Admin → Products.
- Product images: 70 of the 77 lines now use company POS media or verified public brand/retailer images in `public/products/real/`; provenance is in `public/products/real/SOURCES.json`. Seven lines still need a verified supplier photo: Myco Tea, Miksi Choco 17g, Onga Cube Beef x2500, Glucose PKT, Glucose Small, Ogoody Choco and Ogoody Creamer. They show a clean branded placeholder and can be updated from Admin → Products (upload or image URL).
- Some verified images are the closest available pack variants (for example Dano 1kg uses a 900g tin, Kerrygold 750g/320g use a 227g block, Twisco 20g uses a 22g pack, Miksi 320g uses a 330g pack). Each substitution is recorded with a pack note in `SOURCES.json`.
- Category and brand assignments are editable in Admin → Catalogue.

### Product images
Product images are sourced into `public/products/<slug>.webp`, with provenance recorded in `public/products/SOURCES.json`. If an image is missing, the UI renders a deliberate branded placeholder rather than fabricated packaging. Replace images from Admin → Products at any time.

### Logo
The official logo artwork is installed at **`public/brand/logo-official.png`**, with a tightly cropped derivative at **`public/brand/logo-mark.png`** used by the header, footer, admin and cinematic intro. To refresh the brand mark, replace `logo-mark.png` with a tightly cropped version of the official artwork (square, 900×900 or larger) and keep the original file for provenance.

---

## Payments

Card payments use Paystack:

1. `/api/checkout` creates the order server-side and recalculates every line from the catalogue.
2. `/api/paystack/callback` verifies the transaction with Paystack before marking an order paid.
3. `/api/paystack/webhook` validates the `x-paystack-signature` with the secret key on `charge.success`.

An order is **never** marked paid from client-side input. Manual “Confirm payment received” in the admin is a separate, deliberate staff action.

Bank transfer, pay on delivery and WhatsApp ordering are available without Paystack and mark orders as pending until staff verify payment.

---

## WhatsApp

Business numbers: **07031633358** (`+2347031633358`) or **09038581150** (`+2349038581150`)

- Floating WhatsApp button
- Product enquiry with name, pack size and quantity
- Cart-to-WhatsApp with line items and subtotal
- Wholesale and checkout messages
- Admin deep links back to customers

---

## Scripts

```bash
npm run dev        # development
npm run build      # production build
npm start          # serve production build
npm run typecheck  # TypeScript
```

---

## Brand motion

- The cinematic logo intro replays on every full page load (skipped instantly for `prefers-reduced-motion`).
- Every real mouse click or tap plays a **460 ms mini version of that same intro** — navy veil, official logo medallion, gold ring and shimmer — then fades out automatically. It uses `pointer-events: none` and never blocks navigation, forms, cart actions or typing. It is not triggered by scrolling, mouse movement or keyboard input.
- Meaningful asynchronous actions (internal navigation, forms) also run a small gold progress ring around the header logo until the action settles. Instant actions such as add-to-cart use a quick shimmer.
- Clicking the logo itself plays the stronger signature motion (lift + ring + shine) and returns home.
- All motion is CSS-driven, GPU-friendly and non-blocking; content is never delayed.

## Staff & POS

The footer includes a discreet **Staff / POS Login** link to the point-of-sale subdomain: https://pos.jjebubeenterprise.com.ng/

## cPanel deployment

This project is deployed on the Namecheap cPanel account using the CloudLinux Node.js Selector (Node 22) and Passenger.

- App root: separate from the domain document root; the domain `.htaccess` contains the Passenger configuration.
- Runtime entry: `server.js` (loads `.env.local`, then starts Next on the Passenger socket).
- Build on the server with `npm run build -- --webpack`. Turbopack's native bindings require a newer glibc than the host provides; webpack compiles successfully. `experimental.cpus = 2` keeps the build within the account's process limits.
- After a code update: upload/extract the project (without `node_modules`, `.next`, `.git`), run `npm run build -- --webpack`, then restart the Node app. Do not overwrite `.env.local`.
- Required server environment: `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET`.

## Notes

- The admin session is an HMAC-signed, http-only cookie with an 8-hour expiry. Server actions re-check authorisation.
- Public forms are validated with Zod and lightly rate-limited in-process (replace with a shared limiter at scale).
- The design uses Playfair Display + Manrope, royal navy `#071A3A`, signature gold `#D9AC42`, ivories and a restrained gold accent system.
