# Deploying DropMart

## 1. Supabase
1. Create a project at supabase.com.
2. SQL editor: run `schema.sql`, then `migration-phase3.sql`, `migration-phase4.sql`, `migration-phase5.sql` in order.
3. Project Settings → API: copy the project URL, `anon` key and `service_role` key (keep the last one secret).
4. Authentication → URL Configuration: set Site URL to your live domain.
5. Create your admin user (Authentication → Users) and run the admin `insert` at the bottom of `migration-phase4.sql`.

## 2. Vercel
1. Push this folder to a GitHub repository (`.env.local` is git-ignored).
2. Vercel → Add New Project → import the repo (framework: Next.js).
3. Add every variable from `.env.example` under Settings → Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to your final `https://` domain.
4. Deploy. Then redeploy after any env change.

## 3. Payments (Stripe)
1. Start in Stripe **test mode**; set `STRIPE_SECRET_KEY`.
2. Developers → Webhooks → add `https://YOURDOMAIN/api/stripe/webhook`, event `checkout.session.completed`; copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
3. Place a test order with Stripe's test card, confirm the order turns paid/confirmed in `/admin/orders`, then switch to live keys.

## 4. Email (Resend)
Create an account, verify your sending domain (add the DNS records Resend shows), set `RESEND_API_KEY` and `EMAIL_FROM`.

## 5. Custom domain
Vercel → Project → Settings → Domains → Add your domain, then create the DNS records Vercel displays at your registrar (use exactly the values Vercel shows). Wait for DNS to propagate; HTTPS is issued automatically. Update `NEXT_PUBLIC_SITE_URL` and the Stripe webhook URL, then redeploy.

## 6. Google Search Console
1. Add your domain in Search Console. Either verify the Domain property with the DNS TXT record, or choose URL prefix → HTML tag and put the token in `GOOGLE_SITE_VERIFICATION`, redeploy, then verify.
2. Sitemaps → submit `https://YOURDOMAIN/sitemap.xml` (generated automatically).
3. Use URL Inspection to request indexing for the homepage. Indexing and rankings are decided by Google and are not guaranteed.

## 7. Before you go live
- Replace demo products (or hide them with the "Visible in store" toggle) and test a full purchase.
- Review `lib/pages.ts` (About, FAQ, Shipping, Returns, Privacy, Terms): they are templates. Have them checked for your country.
- Add rate limiting to `/api/orders`, `/api/coupon` and `/api/newsletter`.
- Product images from the admin must be uploaded or hosted on a host allowed in `next.config.mjs`.
