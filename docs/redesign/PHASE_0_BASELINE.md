# Phase 0 Baseline

Captured: 2026-09-21

## Environment

- Store: Aarnorae Parfums
- Store domain: `xedupa-z8.myshopify.com`
- Primary domain: `aarnorae.in`
- Shopify plan: Basic
- Shopify Plus: No
- Store currency: INR
- Enabled presentment currencies: INR
- Local base theme: Shopify Horizon 4.1.5
- Shopify CLI: 4.8.0
- Development theme attached to this folder: None
- Live theme: `Updated copy of Horizon` (`158489739419`)

## Checkout constraint

The store is not on Shopify Plus. The redesign can use Shopify's supported checkout branding controls to align logo, typography, colors, buttons, form controls, backgrounds, and the order summary with the prototype. The information, shipping, and payment steps must remain Shopify-hosted and cannot be rebuilt as the prototype's custom Liquid/HTML page.

## Source-control safeguard

The parent storefront is preserved at commit `d8d5be7` on `https://github.com/darjik/aarnorae-in.git`. The Shopify bundle app is a nested repository preserved at commit `79d58b9` on `https://github.com/darjik/aarnorae-checkout-bundle.git`. Keeping the repositories separate avoids an invalid embedded-repository reference and gives each deployable unit an independent recovery point.

## Local-to-live theme comparison

The live theme was pulled read-only to a temporary folder and compared by SHA-256 checksum across the standard Shopify theme directories.

- Local files: 486
- Live files: 486
- Identical files: 480
- Changed files: 6
- Local-only files: 0
- Live-only files: 0

Pre-existing local differences that must be preserved:

| File | Difference summary |
| --- | --- |
| `sections/footer-group.json` | Enables a custom Liquid footer block that is disabled on live. |
| `sections/header-announcements.liquid` | Moves block capture and removes a pill style for strong ticker text. |
| `sections/header-group.json` | Changes ticker copy and normalizes several color values. |
| `snippets/product-information-content.liquid` | Whitespace-only difference. |
| `templates/index.json` | Shows sale price first and normalizes color values. |
| `templates/page.contact.json` | Removes disabled contact details, changes form sizing/alignment, and adjusts spacing. |

Conclusion: the local theme is structurally complete and very close to live, but it is not an exact copy. These six differences are treated as user-owned work.

## Theme architecture inventory

| Directory | Files |
| --- | ---: |
| `assets` | 125 |
| `blocks` | 99 |
| `config` | 2 |
| `layout` | 2 |
| `locales` | 57 |
| `sections` | 42 |
| `snippets` | 146 |
| `templates` | 13 |

The theme preserves `content_for_header` in the main, password, and gift-card layouts. The product information area supports app blocks, and the current theme settings contain a Trustoo Reviews app block.

## App and integration inventory

Confirmed from local theme data:

- Trustoo Reviews app block: present in `config/settings_data.json`.
- Aarnorae bundle-discount app and Shopify Function: present under `apps/aarnorae-bundle-discount`.
- Bundle code: `MIXMATCH`.
- Bundle rules: 4 x 20ml for Rs. 999, 3 x 50ml for Rs. 1,649, and 2 x 100ml for Rs. 1,999.
- Shopify theme runtime injection: preserved through `content_for_header`.

Confirmed from Shopify Admin:

- Installed apps: Shopify CLI Connector App, aarnorae-bundle-discount, Razorpay COD & Magic Checkout, Search & Discovery, Shopify ChatGPT MCP App, Shopify Claude Connector App, Agent-Claude, Matrixify, CWILL(Trustoo) Reviews, Delhivery, Messaging, shadowfax-order-app, and WhatsApp.
- Enabled theme app embed: Trustoo Product Reviews.
- Disabled theme app embeds: Login with Razorpay, Magic Checkout Script, and Razorpay Reviews.
- Active pixels: CWILL(Trustoo) Reviews and Facebook & Instagram; both report optimized data access.
- Customer accounts: sign-in links enabled, new customer-account configuration in use, store credit enabled, self-serve returns/cancellations disabled, and customer account URL set to `account.aarnorae.in`.

Local compatibility checks:

- `shopify app config validate --json`: valid, with no issues.
- Bundle Function test suite: 10 tests passed.

Phase 0 behavior verification:

- Customer privacy uses Shopify's automated settings. The privacy policy is published, and the cookie banner and data-sharing opt-out page are enabled and automated.
- The cookie banner is configured but is not currently required for the store's active regions. Checkout banner display is disabled.
- Shopify Network Intelligence is enabled.
- Customer Events lists two active app pixels: CWILL(Trustoo) Reviews and Facebook & Instagram. Both report optimized data access; no custom pixel is listed.
- The public storefront loads the Facebook pixel through Shopify's web-pixel runtime. A theme-source scan found no manually embedded Google Analytics, Google Tag Manager, Meta Pixel, Hotjar, Clarity, Segment, or Mixpanel tag.
- Predictive search returns current product suggestions, prices, images, and a full-results action.
- The account control opens Shopify's sign-in flow and links to Orders and Profile on `account.aarnorae.in`.
- The Trustoo product review summary and review block render on the representative product page.
- English is the only published language. India is the only active market, INR is the store and presentment currency, and no localization selector is rendered for this single-market configuration.

Checkout apps, branding, payment methods, delivery methods, and validations remain intentionally assigned to the separate Phase 7 checkout workstream.

The temporary read-only CLI app did not have permission to enumerate all installed apps, so the inventory was verified directly in Shopify Admin without changing settings.

## Catalog sample

A read-only Admin API sample of 50 products found:

- 50 active products.
- 50 products with multiple variants.
- 150 variants with compare-at prices.
- No sold-out product or variant in the sample.
- One inconsistent option label: `Quanity` on AARNORAE ALLUREX.

Theme and bundle logic must use variant values and Shopify data defensively rather than relying on one perfectly spelled option name.

## Public routes selected for baseline

- Home: `https://aarnorae.in/`
- Collection: `https://aarnorae.in/collections/best-sellers`
- Product: `https://aarnorae.in/products/aarnorae-aventus-inspired-by-creed-aventus-powerful-refined-iconic`
- Contact: `https://aarnorae.in/pages/contact`
- Cart: `https://aarnorae.in/cart`

## Performance targets

- Maintain or improve the recorded baseline for each route and viewport.
- Treat Shopify's minimum average Lighthouse targets of 60 performance and 90 accessibility as floors, not goals.
- Do not add a client-side framework or third-party font dependency to reproduce the static prototype.
- Preserve responsive Shopify image delivery and avoid new layout shifts.

## Lighthouse baseline

Reports are stored in `docs/redesign/baseline/lighthouse`. Scores and metrics below are from the final saved reports.

| Route and viewport | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home mobile | 56 | 98 | 73 | 100 | 16.4 s | 0.000 | 341 ms | 3,465 KiB |
| Home desktop | 94 | 95 | 73 | 100 | 1.3 s | 0.000 | 23 ms | 2,711 KiB |
| Collection mobile | 67 | 98 | 73 | 92 | 6.2 s | 0.000 | 322 ms | 3,003 KiB |
| Collection desktop | 98 | 92 | 73 | 92 | 0.9 s | 0.000 | 0 ms | 2,772 KiB |
| Product mobile | 56 | 81 | 73 | 100 | 6.2 s | 0.010 | 584 ms | 2,404 KiB |
| Product desktop | 94 | 83 | 73 | 100 | 1.3 s | 0.010 | 78 ms | 2,458 KiB |
| Contact mobile | 76 | 100 | 73 | 100 | 3.5 s | 0.000 | 484 ms | 1,799 KiB |
| Contact desktop | 99 | 96 | 73 | 92 | 0.8 s | 0.000 | 20 ms | 1,666 KiB |
| Empty cart mobile | 64 | 95 | 73 | 92 | 5.2 s | 0.000 | 488 ms | 2,292 KiB |
| Empty cart desktop | 99 | 95 | 73 | 92 | 0.8 s | 0.000 | 14 ms | 1,817 KiB |

Priority baseline findings:

- Mobile homepage performance is below Shopify's 60-point floor, with a 16.4-second LCP and a 3.4 MiB transfer size.
- Mobile product performance is 56 and product accessibility is 81.
- Product accessibility failures include invalid or prohibited ARIA usage, unnamed buttons, skipped heading levels, and insufficient touch-target sizing.
- Home, collection, and product pages contain heading-order failures.
- Collection, contact, and cart routes lack a passing meta-description audit in the captured state.
- All tested routes scored 73 for best practices because of third-party cookies, browser console errors, and Chrome Issues-panel findings.
- Desktop performance is strong, so the redesign must target mobile media loading and JavaScript cost without regressing desktop.

## Screenshot baseline

Screenshots are stored in `docs/redesign/baseline/screenshots`.

- Routes: home, collection, product, contact, and empty cart.
- Viewports: mobile, tablet, desktop, and wide desktop.
- Total captures: 20.

## Phase 0 completion

All Phase 0 evidence and safeguards are complete. The storefront and bundle app have independent recoverable Git baselines, and no live Shopify setting or theme was changed during the audit.
