# Aarnorae Storefront Redesign TODO

Status: Phase 2 complete; Phase 3 in progress.

## Non-negotiable requirements

- [ ] Work only in the local repository and a Shopify development/duplicate theme.
- [ ] Do not publish, deploy, or modify the live theme without explicit approval.
- [ ] Preserve current Shopify products, variants, collections, prices, inventory, customers, orders, Markets, localization, and URLs.
- [ ] Preserve installed app integrations and app blocks, including Trustoo Reviews.
- [ ] Preserve the existing Aarnorae bundle-discount Shopify Function as the pricing authority.
- [ ] Keep storefront content manageable through Shopify's theme editor, product data, metafields, or metaobjects.
- [ ] Use Shopify-native product, cart, contact, localization, account, and checkout flows.
- [ ] Do not trust client-side code for prices, discounts, eligibility, inventory, or checkout validation.
- [ ] Maintain or improve current storefront performance, accessibility, SEO, and structured data.
- [ ] Match approved prototype typography, color, spacing, dimensions, and responsive composition using measured values; document any deliberate or platform-required variance with its reason.
- [ ] Preserve approved prototype copy, punctuation, capitalization, labels, trust text, and meaningful micro-icons exactly unless the merchant explicitly approves a change.
- [ ] Treat checkout as a separate workstream governed by the store plan and Checkout Extensibility.

## Phase 0 - Baseline and safeguards

- [x] Confirm the Shopify plan, especially whether the store is on Shopify Plus. Confirmed Basic, not Plus.
- [x] Compare the local theme with the intended production theme. All 486 live theme files are present; 480 match and six pre-existing local differences are documented in `docs/redesign/PHASE_0_BASELINE.md`.
- [x] Record the current installed apps, active app embeds, app blocks, scripts injected through Shopify, pixels, and customer-account configuration.
- [x] Record baseline Lighthouse results for home, collection, product, cart, and contact pages on mobile and desktop.
- [x] Record baseline lab metrics including LCP, CLS, total blocking time, category scores, and transfer size. Field INP and asset-type totals remain part of post-preview monitoring.
- [x] Create a representative test matrix covering products with multiple variants, sold-out products, discounted products, mixed bundle sizes, discount codes, and empty/full carts.
- [x] Capture current screenshots at standard mobile, tablet, desktop, and wide-desktop viewports.
- [x] Confirm analytics, consent, pixels, search, account, reviews, and localization behavior before visual changes. Verified in Shopify Admin and on the public storefront; findings are documented in `docs/redesign/PHASE_0_BASELINE.md`.
- [x] Create an approved recoverable Git baseline of the current repository before implementation.

Exit gate: baseline evidence exists and no live environment has been changed.

## Phase 1 - Design foundation

- [x] Translate `DESIGN.md` into theme tokens for color, typography, spacing, borders, shadows, motion, and responsive layout.
- [x] Use theme settings for global merchant-controlled brand choices where appropriate.
- [x] Load production fonts efficiently with fallbacks and no render-blocking third-party framework dependency.
- [x] Build shared button, input, badge, price, icon-button, disclosure, and focus-state styles.
- [x] Keep the design sharp and editorial while meeting WCAG 2.1 AA contrast, keyboard, focus, and touch-target requirements.
- [x] Add reduced-motion behavior and avoid animation that delays shopping actions.
- [x] Verify tokens and primitives across mobile, tablet, desktop, and wide desktop.

Exit gate: shared styles are stable, accessible, and do not regress baseline performance materially.

## Phase 2 - Global storefront shell

- [x] Redesign the announcement bar using merchant-editable blocks and links.
- [x] Redesign the header while preserving menus, sticky behavior, search, account, localization/currency, and live cart count.
- [x] Redesign mobile navigation with correct focus management, escape behavior, scroll locking, and accessible labels.
- [x] Redesign the footer using merchant-editable blocks while preserving policy, contact, social, and newsletter links.
- [x] Keep app embeds and `content_for_header` intact.
- [x] Preserve Horizon's native logged-in/logged-out account behavior. Long menu-label stress testing is skipped by merchant decision; country and language selectors are disabled for the single-region launch.

Exit gate: all global navigation and account/cart/localization workflows work with JavaScript enabled and degrade safely where applicable.

## Phase 3 - Homepage

- [x] Rebuild the prototype hero as a Shopify section with responsive image/video settings, focal points, text, links, and accessible alt text.
- [x] Build merchant-editable value-proposition and service highlights.
- [ ] Build Mix & Save tiers using current collections/products and the existing bundle rules as the source of truth.
- [ ] Rework featured products/new arrivals using real collection and product objects.
- [x] Remove the homepage brand-story/editorial section by merchant decision; About Us remains available as a dedicated page and footer link.
- [ ] Build the scent consultation call-to-action as a configurable section.
- [ ] Rework testimonials/reviews without duplicating or breaking the installed reviews app.
- [ ] Preserve SEO heading order and avoid layout shift from media.
- [ ] Compare every completed homepage section against the prototype at mobile and desktop breakpoints before marking it complete.

Exit gate: the homepage matches the approved visual direction using real store data and theme-editor content.

## Phase 4 - Product detail page

- [ ] Restyle the existing product media gallery with thumbnails, zoom, video/model support, and responsive images intact.
- [ ] Preserve title, price, compare-at price, tax messaging, availability, variant selection, quantity, product form, dynamic checkout, and sticky add-to-cart behavior.
- [ ] Preserve app blocks within product information, including reviews and future app integrations.
- [ ] Create configurable product-story modules for fragrance pyramid, concentration, longevity, notes, inspiration, formula claims, and care information.
- [ ] Decide which product-story fields use existing product data versus Shopify metafields/metaobjects before creating new data definitions.
- [ ] Build layering recommendations from selected products rather than hardcoded product names or prices.
- [ ] Preserve product structured data, canonical URLs, variant URLs, and merchant listing requirements.
- [ ] Test unavailable, sold-out, single-variant, multi-variant, discounted, and media-heavy products.

Exit gate: every purchase path uses Shopify's product form and reflects current product/variant state accurately.

## SEO and AEO content backlog

- [ ] High priority: strengthen Google's branded-search and entity recognition for `AARNORAE`, `AARNORAE Perfumes`, and `AARNORAE Parfums`. Google currently rewrites even the quoted query `"aarnorae" perfumes` to `"aurora" perfume`, although choosing "Search instead for" reveals the AARNORAE Google Business Profile, homepage, collections, blog, and social profiles. Keep the exact brand spelling and business name consistent across the website, Organization schema, Google Business Profile, social profiles, product feeds, marketplace profiles, and reputable external mentions; add verified `sameAs` references and useful `alternateName` values where appropriate; earn genuine branded citations and links; request recrawling after material changes; and monitor Search Console branded-query impressions, clicks, and Google's correction behavior. Avoid keyword stuffing or artificial link schemes.
  - [x] Add `AARNORAE` as the preferred Organization and WebSite name, add `AARNORAE Parfums` and `AARNORAE Perfumes` as alternate names, and connect the verified Facebook and Instagram profiles through Organization `sameAs` references.
  - [x] Verify that the homepage and long-lasting perfume guide are indexed, that the guide has a valid breadcrumb enhancement, and that `sitemap.xml` reports Success after being read by Google on 29 September 2026.
  - [x] Audit current public identity signals. Google recognizes the official website and brand in its AI Overview and exact-query results, and Search Console reports 21 valid Merchant listings with no invalid items. Correct the footer's verified Threads URL mapping and include Threads in Organization `sameAs` references.
  - [ ] Standardize the real-world display name on Google Business Profile, Instagram, and Facebook. They currently show `Aarnorae parfum`, while the website uses `Aarnorae Parfums`; use one truthful brand-facing name consistently and complete any appropriate missing Business Profile contact details.
  - [ ] Recheck the Page indexing report after the validation started on 28 September 2026 finishes. The current report was last calculated on 21 September and lists 125 URLs as discovered but not indexed; review any remaining important collections, products, blog pages, and content pages separately from intentionally excluded Shopify account, redirect, canonical, under-construction, and generated metaobject URLs.
- [ ] Add a distinct, attractive image to Best Sellers, For Him, For Her, and Celebrity Collection so each collection has a stronger visual identity. Use original brand imagery or properly licensed assets, provide desktop and mobile-friendly crops, add concise descriptive alt text, serve responsive Shopify image sizes, and verify that the images do not cause meaningful LCP or layout-shift regressions. Do not generate or publish these images until the merchant approves the visual direction.

## Phase 5 - Cart drawer and bundle experience

- [ ] Restyle the current Shopify cart drawer instead of replacing its data flow.
- [ ] Preserve line properties, selling plans, discounts, quantity changes, removal, notes where enabled, accelerated checkout, and discount code behavior.
- [ ] Render bundle progress and unlocked-tier messaging from the same documented rules as the Shopify Function.
- [ ] Treat bundle progress as informational; final eligibility and discount amounts remain server-side.
- [ ] Handle mixed sizes, partial tiers, multiple eligible tiers, manual discount codes, cart errors, sold-out changes, and asynchronous cart updates.
- [ ] Keep free-gift messaging conditional on an actual implemented rule; do not imply a gift that checkout will not honor.
- [ ] Add accessible drawer focus trapping, close controls, live-region updates, and scroll restoration.
- [ ] Verify cart totals against Shopify after every mutation.

Exit gate: displayed totals and discounts always reconcile with Shopify's cart response and checkout.

## Phase 6 - Client concierge and contact

- [ ] Rebuild the concierge page as a dedicated Shopify page template with merchant-editable sections.
- [ ] Use Shopify's contact form endpoint with labeled fields, validation, error states, and success feedback.
- [ ] Add inquiry category and optional order/reference fields only after confirming the desired inbox workflow.
- [ ] Keep WhatsApp, email, operating hours, privacy language, and FAQs editable in the theme editor.
- [ ] Add spam-resistant behavior using Shopify-supported mechanisms; do not expose private credentials or introduce a custom insecure endpoint.
- [ ] Optimize concierge imagery through Shopify's image pipeline.

Exit gate: inquiries arrive through the approved channel and the page contains no hardcoded private operational data.

## Phase 7 - Checkout workstream

- [ ] Confirm Shopify plan and available Checkout Extensibility capabilities before implementation.
- [ ] Inventory current checkout branding, apps, payment methods, shipping methods, scripts, pixels, discounts, and validations.
- [ ] Recreate the prototype's visual direction through Shopify checkout branding settings: logo, typography, colors, buttons, form controls, order summary, and background treatments.
- [ ] Use supported Checkout UI extensions only where they add necessary functionality and the store plan permits the target surface.
- [ ] Keep address, delivery, payment, tax, fraud, authentication, Shop Pay, and order creation owned by Shopify.
- [ ] Do not build a custom HTML checkout or collect card/payment credentials in the theme.
- [ ] Make the transition from storefront/cart to hosted checkout visually coherent even where exact layout parity is unavailable.
- [ ] Test guest checkout, Shop Pay/accelerated checkout, mobile checkout, address validation, shipping rates, discount codes, failed payment, and order confirmation.
- [ ] Document prototype elements that Shopify cannot reproduce exactly and provide the nearest supported treatment.

Exit gate: checkout is supported by Shopify, secure, test-ordered successfully, and visually as close to the prototype as platform controls allow.

## Phase 8 - Quality, security, and compatibility

- [ ] Run Shopify theme validation and resolve Liquid, schema, translation, and accessibility errors.
- [ ] Test all supported browsers and representative iOS/Android devices.
- [ ] Test keyboard-only and screen-reader-critical flows for navigation, variants, cart, forms, and checkout handoff.
- [ ] Verify output escaping, safe URLs, form authenticity, CSP compatibility, and absence of exposed secrets.
- [ ] Verify no client-side code can grant discounts, alter authoritative totals, bypass inventory, or forge gifts.
- [ ] Verify app blocks and embeds before and after template changes.
- [ ] Verify SEO metadata, structured data, canonical URLs, redirects, image alt text, and heading hierarchy.
- [ ] Compare final Lighthouse/page-weight results against the Phase 0 baseline and fix material regressions.
- [ ] Test with slow network and disabled third-party apps to ensure core shopping remains usable.

Exit gate: no critical functional, security, accessibility, compatibility, or performance regressions remain.

## Phase 9 - Merchant handoff and deployment readiness

- [ ] Document each new theme setting, section, block, metafield, and metaobject for the admin user.
- [ ] Provide a content-migration map from prototype copy/media to Shopify-managed sources.
- [ ] Prepare a regression checklist and rollback plan.
- [ ] Obtain approval on the local/development-theme preview.
- [ ] Perform final app-owner and merchant acceptance testing.
- [ ] Deploy only after explicit approval, using a duplicate theme and a scheduled low-risk release window.
- [ ] Recheck analytics, checkout, discounts, orders, and performance immediately after any approved deployment.

Exit gate: merchant approval is recorded and rollback is ready before publication.

## Definition of done

- [ ] Visual direction is approved across home, product, cart drawer, concierge, and checkout.
- [ ] Current catalog, product options, apps, discounts, and admin workflows continue to work.
- [ ] All content intended for routine updates is manageable without code changes.
- [ ] Shopify remains authoritative for identity, cart, pricing, discounts, inventory, payment, and orders.
- [ ] Performance is maintained or improved against the recorded baseline.
- [ ] No live environment was changed before explicit deployment approval.
