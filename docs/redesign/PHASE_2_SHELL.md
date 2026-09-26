# Phase 2 Storefront Shell

## Implemented

- Restyled the merchant-editable announcement ticker without changing its Shopify block model.
- Restyled the Horizon header while retaining its menu, sticky, search, account, localization, and cart components.
- Restyled the existing mobile drawer without replacing Horizon's lazy hydration, focus management, Escape handling, or scroll lock.
- Restyled the merchant-editable footer while retaining newsletter, contact, policies, copyright, and social links.
- Completed a prototype-aligned four-column footer using Shopify menus, brand copy, the native newsletter form, page links, policies, and social profiles.
- Left `content_for_header`, app embeds, cart pricing, and checkout behavior untouched.

## Verification

- Shopify targeted validation passes for the announcement, footer, and header/footer group files.
- The unchanged Horizon header and drawer still report the Phase 0 duplicate static-block and locale-key baseline findings.
- Local development-theme preview: `158979129499`; no live theme was published or modified.
- Mobile preview confirms drawer hydration, visible labels, Escape close, and focus return to the menu trigger.
- Phase 2 is complete. Horizon's native customer-account state handling remains unchanged; long-label stress testing is skipped by merchant decision.
- Country and language selectors are disabled for the single-region launch. Shopify Markets, catalog pricing, and checkout configuration remain unchanged.
