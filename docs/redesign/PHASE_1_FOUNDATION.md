# Phase 1 Design Foundation

## Scope

This phase translates the approved `Haute Parfumerie Minimaliste` direction into the existing Shopify Horizon architecture. It establishes shared settings and primitives without replacing Shopify product, cart, account, localization, app-block, or checkout behavior.

## Merchant-controlled settings

The foundation uses Horizon's existing global theme settings rather than introducing a parallel configuration system:

- Color palette controls the alabaster canvas, charcoal text, emerald brand color, parchment borders, and champagne accent.
- Typography controls use Shopify-hosted Playfair Display and Plus Jakarta Sans font objects.
- Button, input, badge, card, popover, drawer, icon, and variant controls retain their existing theme-editor settings.
- Page width remains selectable, with the normal and wide foundations capped at 1440px.

## Semantic tokens

Brand variables are defined in `snippets/theme-styles-variables.liquid` with the `--aarnorae-` prefix.

| Role | Value |
| --- | --- |
| Emerald noir | `#0B1F1A` |
| Forest shadow | `#071310` |
| Champagne gold | `#C5A059` |
| Burnished gold | `#A87541` |
| Alabaster | `#FBF9F5` |
| Sand linen | `#F0EDE4` |
| Parchment border | `#E5DFD5` |
| Charcoal ink | `#1C1917` |
| Stone muted | `#6E6A63` |

The same token layer defines fixed breakpoint typography, spacing, 48px controls, product-media shadow, frosted surfaces, and motion durations. Letter spacing remains zero to avoid compressed or unstable display text.

## Shared primitives

`assets/base.css` provides reusable classes for:

- Display, headline, body, note, and label typography.
- Price typography.
- Rectilinear badges and icon buttons.
- Disclosure rows and frosted surfaces.
- Primary, secondary, and custom button sizing.
- Input, select, and textarea sizing and focus treatment.
- A 44px minimum target for buttons, button roles, and summaries.
- Reduced-motion behavior that removes nonessential animation and smooth scrolling.

## Verification

- Shopify targeted validation: passed.
- Shopify-hosted font faces: Playfair Display and Plus Jakarta Sans resolve to WOFF2/WOFF assets with `font-display: swap`.
- Desktop preview: 1280 x 720.
- Mobile preview: 390 x 844.
- Mobile horizontal overflow: 0px.
- Full Theme Check still reports the baseline Horizon locale mismatch set in untouched files; no Phase 1 file is implicated.
