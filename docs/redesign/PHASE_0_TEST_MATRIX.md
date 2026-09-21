# Phase 0 Test Matrix

Use this matrix before and after each redesign phase. All prices, discounts, availability, and totals must be asserted from Shopify responses rather than hardcoded UI values.

## Product and merchandising

| Scenario | Fixture | Expected result |
| --- | --- | --- |
| Multi-variant product | AARNORAE AVENTUS | 20ml, 50ml, and 100ml variants update price, compare-at price, media, availability, and submitted variant ID correctly. |
| Inconsistent option label | AARNORAE ALLUREX | Variant selection works even though the current option name is `Quanity`. |
| Sale pricing | Any sampled active fragrance | Current price and compare-at price render with correct INR formatting and accessible semantics. |
| Low inventory | Create or identify a development-theme fixture | Availability and purchase controls follow Shopify inventory policy. |
| Sold-out variant | Create or identify a development-theme fixture | Unavailable option is communicated and cannot be added incorrectly. |
| Sold-out product | Create or identify a development-theme fixture | Product remains informative while purchase actions are disabled. |
| Single-variant product | Create or identify a development-theme fixture | No redundant picker is shown and the correct variant ID is submitted. |
| Media-heavy product | Product with image plus video or 3D media | Gallery, thumbnails, zoom, video, and model media remain keyboard accessible and responsive. |

## Cart and bundles

| Scenario | Cart setup | Expected result |
| --- | --- | --- |
| Empty cart | No lines | Empty state, recommendations if enabled, cart count, and checkout state are correct. |
| Standard cart | One non-qualifying item | Shopify line price, compare-at display, quantity updates, removal, and total remain consistent. |
| 20ml bundle | Four eligible 20ml variants plus `MIXMATCH` | Shopify Function determines the final 4 x 20ml for Rs. 999 result. |
| 50ml bundle | Three eligible 50ml variants plus `MIXMATCH` | Shopify Function determines the final 3 x 50ml for Rs. 1,649 result. |
| 100ml bundle | Two eligible 100ml variants plus `MIXMATCH` | Shopify Function determines the final 2 x 100ml for Rs. 1,999 result. |
| Partial bundle | One fewer than a qualifying tier | Progress UI remains informational and no discount is claimed prematurely. |
| Mixed sizes | Eligible and ineligible sizes together | Only server-qualified lines receive the Shopify Function discount. |
| Multiple tiers | Cart quantity qualifies more than once | Totals and messaging reconcile with the Function's actual allocation behavior. |
| Manual code error | Invalid or incompatible discount code | Shopify error is displayed accessibly without stale totals. |
| Cart mutation error | Quantity exceeds availability | Shopify error is shown and the UI restores authoritative cart state. |
| Line properties | Product added with custom properties | Properties survive drawer updates and checkout handoff. |
| Accelerated checkout | Eligible cart | Existing accelerated checkout buttons remain functional. |
| Free-gift message | No implemented gift rule | The UI must not promise or display an unlocked gift as authoritative. |

## Global storefront

| Scenario | Expected result |
| --- | --- |
| Desktop navigation | Menus, search, account, localization, and cart are keyboard accessible and preserve current routes. |
| Mobile navigation | Focus is trapped appropriately, Escape closes overlays, and body scroll is restored. |
| Long labels | Navigation and buttons wrap or truncate intentionally without overlap. |
| INR localization | Prices and cart totals use Shopify money formatting consistently. |
| Logged-out account | Account action routes to the configured Shopify customer-account flow. |
| App unavailable | Core product and cart purchase paths remain usable if a review widget fails. |
| Reduced motion | Tickers and nonessential motion respect `prefers-reduced-motion`. |

## Concierge and forms

| Scenario | Expected result |
| --- | --- |
| Valid inquiry | Shopify contact endpoint accepts the form and displays success feedback. |
| Invalid email | Inline and server errors are associated with the correct labeled field. |
| Missing required field | Submission is blocked with accessible feedback. |
| Long message | Layout remains stable and the message reaches the approved inbox workflow. |
| Spam attempt | Shopify-supported protection handles abuse without exposing credentials or a custom public endpoint. |

## Checkout handoff

| Scenario | Expected result |
| --- | --- |
| Guest checkout | Cart lines, discounts, shipping eligibility, and INR totals transfer to Shopify checkout. |
| Accelerated checkout | Shop Pay or other enabled accelerated method remains owned by Shopify. |
| Mobile checkout | Branding is coherent and all fields remain usable at narrow viewports. |
| Discount code | Checkout reflects Shopify's authoritative discount state. |
| Failed payment | Shopify handles the failure without theme code receiving payment credentials. |
| Order confirmation | Order status and confirmation use supported Shopify customization only. |

## Regression evidence

For each release candidate, retain:

- Before and after screenshots at mobile, tablet, desktop, and wide desktop.
- Lighthouse JSON for home, collection, product, cart, and contact routes.
- Shopify theme validation output.
- Bundle Function test output for valid, partial, mixed, invalid-code, and repeated-tier carts.
- Manual results for navigation, forms, app blocks, and checkout handoff.
