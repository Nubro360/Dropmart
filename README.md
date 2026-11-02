# DropMart (Phase 1)

Next.js 14 + TypeScript + Tailwind + Supabase.

## Run locally
1. `npm install`
2. `cp .env.example .env.local` and fill in Supabase values
3. Run `supabase/schema.sql` in the Supabase SQL editor
4. `npm run dev` → http://localhost:3000

Admin access: see the end of `supabase/migration-phase4.sql`.

## Built so far
Design system, sticky header with live cart count (persisted in localStorage), full homepage, demo products (flagged "Demo"), configurable-ready countdown, Organization JSON-LD, database schema with RLS.

## Phase 2 (done)
`/shop` (search, category filter, sorting), `/products/[slug]` (gallery, variants, quantity, Buy Now, specs, related products, Product + Breadcrumb JSON-LD, canonical and Open Graph), `/cart` (quantities, `/api/coupon` validation, shipping rules in `lib/pricing.ts`). Demo coupon: `WELCOME10` (only while Supabase isn't configured).

## Phase 3 (done)
`/checkout`, `POST /api/orders` (validates input, re-prices from the database, checks stock and coupon, saves the order, unique number `DM-YYMMDD-XXXXXX`), `/order/[number]`, Stripe Checkout + webhook, Resend email.

**Setup**
1. Run `supabase/migration-phase3.sql`.
2. Payments: set `STRIPE_SECRET_KEY`. In Stripe → Developers → Webhooks add `https://YOURDOMAIN/api/stripe/webhook` for `checkout.session.completed` and copy the signing secret into `STRIPE_WEBHOOK_SECRET`. Test locally with `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Orders are marked paid only by that webhook.
3. COD / manual: `ENABLE_COD`, `ENABLE_MANUAL_PAYMENT` + `MANUAL_PAYMENT_INSTRUCTIONS`.
4. Email: create a Resend account, verify your domain, set `RESEND_API_KEY` and `EMAIL_FROM`. Without them, emails are skipped.
Without Supabase, the checkout runs in demo mode (orders aren't saved).

Known gaps: stock isn't decremented yet, and the order API has no rate limiting (add one, e.g. Upstash, before launch).

## Phase 4 (done): admin at `/admin`
Run `supabase/migration-phase4.sql`, create a user in Supabase → Authentication → Users, then run the admin `insert` at the bottom of that file. Sign in at `/admin/login`.
Includes: dashboard analytics, products (add/edit/delete, image upload, supplier fields, margin), orders (7 statuses, tracking number and URL), customers (from orders), categories, coupons, countdown setting.
Security: middleware blocks signed-out users; every page and server action re-checks the admin role; RLS is the backstop.
Not yet: homepage banners, storefront reading from the database (it still shows demo data), supplier fulfillment status.

## Phase 5 (done)
Storefront reads products, categories and the deals countdown from Supabase (demo data only when Supabase isn't configured), image gallery, stock-aware product pages, sitemap.xml, robots.txt, policy/info pages (templates), newsletter signup (`migration-phase5.sql`), Search Console verification via env. See **DEPLOYMENT.md** for deployment, domain and Search Console steps.

## Known gaps
Stock isn't decremented on order, no rate limiting, no wishlist/accounts/Quick View/star ratings, no homepage banner manager, no supplier-fulfillment status or supplier API integration, no automatic emails on status changes. Policy pages are templates.
