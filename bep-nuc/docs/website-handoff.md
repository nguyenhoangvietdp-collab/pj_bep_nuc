# Bếp Núc website handoff

Bếp Núc connects Hanoi buyers with end-of-day meals, flowers for home and goods approaching their labelled use-by date. **Customers who collect in person can save extra on top of an eligible base voucher.** Delivery remains a separate option. When no verified lot is available, a reference item can collect a request for an operator to quote later.

## Find the right entry point

| Surface | Entry point | Purpose |
|---|---|---|
| [Public website](https://pj-bep-nuc.nguyenhoangvietdp.workers.dev/) | [`mvp-site/app/mvp-app.tsx`](../mvp-site/app/mvp-app.tsx) | Commerce on Cloudflare Workers. Browser routes use hashes such as `/#/meals`. `npm run build:mvp` exports to `mvp-site/out/`. |
| Public API | [`supabase/functions/bep-nuc/index.ts`](../supabase/functions/bep-nuc/index.ts) → [`lib/edge-api.ts`](../lib/edge-api.ts) | Google-authenticated sessions and commerce actions, public catalogue and health. Supabase Postgres stores `bc_state`. |
| Local full-stack preview | [`app/`](../app/) and [`app/api/`](../app/api/) | Next.js path routes such as `/meals` and `/login`, with role selection in demo and PGlite defaults. Check both entry points for shared feature changes. |
| GitHub Pages | [`pages-site/`](../pages-site/) | Introduction and link to Workers. `npm run build:pages` exports to `pages-site/out/`. |
| Older pilot | [`apps/buachot-pilot/`](../../apps/buachot-pilot/) | Historical BữaChốt implementation. |

Shared components live in [`app/components/`](../app/components/). The Workers CSS build combines `app/style.css`, `app/commerce.css`, `app/frame.css`, `app/shop.css`, `mvp-site/mvp.css` and `app/garden.css` (last). Source product and brand assets live in [`public/`](../public/). Builds copy them into the target exports.

## Illustrated visual direction

- `app/garden.css` is the shared visual layer for the fresh green, yellow and cream theme. Keep checkout inputs and price breakdowns on light backgrounds with strong text contrast.
- `app/components/brand-garden.tsx` draws reusable, decorative geometric tiles with CSS; it is hidden from assistive technology. Preserve the stepped top/right arrangement and avoid placing patterns behind information or controls.
- `app/components/customer-home.tsx` leads with self-pickup savings over the original `hero-meal.mp4` background video, restored at the user's request. `HeroVideo` provides a pause/play control, poster fallback and reduced-motion support. The fresh visual direction continues below the hero. Optimized WebP illustrations in `public/brand/` are brand art, not evidence of suppliers or customer activity.
- Apply visual changes to both Next.js and Workers. Do not replace voucher eligibility, contribution checks or accepted prices with frontend calculations. The receiving selector explains the extra pickup benefit separately from the base voucher.

## Get a local baseline

Use Node.js 22 to match CI. Run these commands from a clean development worktree with no production `.env*` files or `DATABASE_URL`. The current local adapter reads `DATABASE_URL` before choosing PGlite, even in demo mode. Run demo from a clean terminal and keep the two configurations separate.

```powershell
# Run from the repository root
Set-Location bep-nuc
node --version
npm ci
if ($env:DATABASE_URL) { throw 'Use a demo terminal without DATABASE_URL.' }
$env:APP_MODE = 'demo'
$env:PGLITE_DIR = '.data/agent-preview-' + [guid]::NewGuid().ToString('n')
npm run dev
```

Open `http://127.0.0.1:3200/login` to select a demo role. `/meals`, `/checkout`, `/orders` and `/internal` exercise the customer and operator paths. Demo money and codes are simulated. To verify the Workers build itself, run `npm run build:mvp` and serve `mvp-site/out` with a local static server. Without a public Supabase URL and publishable or anon key, that export shows the closed preview. Use a dedicated staging Supabase project for an authenticated Workers test.

```powershell
npm test
npm run build
npm run type-check
npx --yes deno@2.9.6 check --config supabase/functions/bep-nuc/deno.json supabase/functions/bep-nuc/index.ts
npm run build:mvp
npm run check:static
npm run build:pages
```

The [MVP workflow](../../.github/workflows/mvp-checks.yml) checks changes under `bep-nuc/` on PRs and on pushes to `main`. It uploads a static artifact. [The Pages workflow](../../.github/workflows/pages.yml) publishes the introduction.

## Follow one feature at a time

Public catalogue media and price observations are in `lib/public-catalogue-references.json` (checked 28 November 2026). `lib/public-catalogue.ts` filters retail references and selects illustration overrides for the UI. Keep `product-assets.ts`, canonical product IDs and old image files intact: their amounts are inputs to the negotiated pricing policy, not scraped market prices. Public reference observations must never set a shop's original/negotiated price, stock, expiry, pickup window or approved supplier status. The seven retail references are read-only until a real lot is confirmed; only their source links are actionable. Source, licence and quantity information is available through help buttons and `public/food-images/sources.html`. `tests/public-catalogue.test.ts` checks the boundary and asset provenance.

The user confirmed that external food prices should be visible beside Bếp Núc's own prices while keeping the pricing formula unchanged. `source-price-reference.tsx` displays the external price, its original unit and source in the catalogue, product details and request checkout. This block is informational and is not part of the payment breakdown. Source prices must not be struck through or presented as Bếp Núc savings; the source's portion can differ. Retail cards use shorter display names while preserving full source product names, SKU and pack specification in the source data.

| Work area | Start here | Checks that cover the important edges |
|---|---|---|
| Catalogue, sale and listings | `app/components/market.tsx`, `reference-product.tsx`, `sale-price.tsx`, `lib/request-catalogue.ts`, `lib/catalogue-sale.ts` | `catalogue-sale.test.ts`, `sale.test.ts`, `sale-countdown.test.ts`, `flower-requests.test.ts` |
| Pickup, delivery and total | `app/components/checkout-receiving.tsx`, `fulfillment-choice.tsx`, `saved-place.tsx`, `payment-summary.tsx`, `lib/pickup-pricing.ts`, `lib/launch-estimate.ts`, `lib/promotion-threshold.ts` | `all-account-location.test.ts`, `receiving-preview.test.ts`, `pickup-pricing.test.ts`, `promotion-threshold.test.ts`, `payment-summary.test.ts`, `delivery.test.ts` |
| Requests, quote, order and settlement | `app/components/meal-requests.tsx`, `trading-admin.tsx`, `lib/domain.ts`, `lib/trading.ts`, `lib/edge-api.ts` and `app/api/pilot/route.ts` | `pending-requests.test.ts`, `edge-api.test.ts`, `trading-edge.test.ts`, `trading.test.ts`, `commerce.test.ts` |
| Goods approaching expiry | `lib/near-date.ts`, `app/components/near-date-fields.tsx`, `near-date-info.tsx` | `near-date.test.ts`, `retail-category-names.test.ts`. See the [retail rules](near-date-direction-20261124.md) for categories, labels and bundles. |

- Separate the selected base voucher from the pickup benefit. The customer can inspect the estimate before account approval. The server derives distance from a saved point and store location and checks the budget, basket threshold and contribution floor before committing an offer.
- For flowers and other reference products, a request records interest. Availability, seller, price and timing must be confirmed before the customer can accept a quote. Keep reference prices, estimates and confirmed totals distinct.
- Keep stock and any reserved voucher budget consistent through retries, expiry and release. Preserve store payouts and accepted quote totals in their stored snapshots. In production `bc_state` is a single locked aggregate, which serializes transactions across requests. Read [`lib/store.ts`](../lib/store.ts) and the Edge entry point before changing the state schema or write strategy.
- Keep customers’ exact addresses and coordinates, along with store payouts and private costs, out of the public catalogue. Keep production credentials out of source, fixtures and handoff notes.

## Ship a change to the right target

1. Open a focused PR against `main`. Record the Git SHA and name the surfaces affected. If the Workers client and Edge API contract both change, test them together on staging.
2. Build the Workers artifact against the intended project's public keys from `.env.mvp.local` or the environment, using [`.env.mvp.example`](../.env.mvp.example) as the template. Run the static check. Release frontend from `bep-nuc/` with `npx wrangler deploy --config wrangler.jsonc --keep-vars` when authorized. Record the Workers deployment ID alongside the commit SHA.
3. For API changes, verify the linked Supabase project and the server-only config from [`supabase/functions/.env.example`](../supabase/functions/.env.example). Deploy the `bep-nuc` Edge Function when authorized and record its version. Apply checked-in migrations only when required for the change. Use staging for payment, refund and settlement smoke tests.
4. Confirm the public homepage and catalogue render, then verify `GET /functions/v1/bep-nuc/health` from the intended Supabase project. The endpoint exposes feature versions, so its flags help check API compatibility. Match deployment IDs to the Git SHA to establish exactly what shipped. Review orders and payment readiness with the pilot operator before changing live gates.

## Baseline on 27 November 2026

- Audited source `a1b5a66` on `codex/bep-nuc-current-updates`. Remote `main` was `b0b266b`, one commit behind. The local baseline and a production deployment are separate checks.
- All 167 tests passed using local Node 24. Next.js, Workers and Pages built successfully. The TypeScript, Deno and static artifact checks passed. Next.js reports existing CSS compatibility warnings around `start` and `end`. The local Next.js demo returned HTTP 200 for `/`, `/meals`, `/login`, `/orders`, `/internal` and `/api/catalogue`.
- The public homepage, meals, flowers, offers and orders rendered in a guest session at 390 px and 1440 px without horizontal overflow. The Edge catalogue and health endpoints returned HTTP 200. Health reported checkout v3, pickup stacking and location estimates for all accounts. Health reports feature versions, and the deployed Git SHA still needs to be matched to the release record.
- On mobile, acknowledge “Lưu ý trước khi sử dụng” before interacting with the catalogue. Open “Bộ lọc”, select “Hàng gần hạn sử dụng”, and apply the filter. All five retail subcategories appeared. The meal catalogue’s “Tính giá khi tự lấy” link opened the checkout with address and receiving options, a base voucher section and a payment breakdown. One catalogue resource returned a 404 during the first mobile pass. It did not recur in the follow-up capture, so the failing resource was not identified.
- Live Google login, pending and approved account sessions, payment, refund and settlement were outside this read-only production check. Use staging to verify them before a related release.

## Storefront layout, directory and simulated cart (28 November 2026, local merge)

- Buying pages use a two-level directory (`lib/directory.ts`, `app/components/product-directory.tsx`), one compact card (`product-card.tsx`) and `app/shop.css`; `garden.css` stays the last colour layer. The home page keeps the illustrated version above.
- Catalogue prices use the menu price: customers see 95% of it before voucher (`menuPricing` in `lib/catalogue-sale.ts`). The external source price stays visible beside it as information only.
- `/cart` is browser-only (`lib/cart.ts`): reference dishes and the 16 near-date samples, 1–3 units each, one voucher per cart on the line that saves the most. It sends no order, holds no stock and takes no money. Real lots still use the hold flow.
- Near-date has two separate sections: simulated samples that can go in the cart, and the read-only source-priced retail references.
