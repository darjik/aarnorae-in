# Phase 3 Homepage

## Implemented

- Replaced the generated carousel with Horizon's native merchant-editable hero section.
- Retained the existing Shopify-hosted campaign image while adding editable headline, supporting copy, and collection CTA.
- Preserved native responsive image generation, focal points, optional video, explicit media dimensions, and high LCP priority.
- Added a four-block merchant-editable service strip for concentration, social proof, courier, and concierge messaging.
- Ensured the visible hero is the homepage's single H1.
- Removed the homepage story section to match the live storefront; About Us and Contact remain dedicated pages linked from the footer.
- Removed the homepage Client Care contact-details strip and replaced it with merchant-editable About Us and Contact footer links.

## Verification

- Development theme renders the hero and four service blocks from `templates/index.json`.
- Hero image includes responsive `srcset`, explicit dimensions, and `fetchpriority="high"`.
- Mobile preview has zero horizontal overflow and no browser console errors.
- No product, collection, cart, app, pricing, or checkout logic was changed.
