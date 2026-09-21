# Reel Pipeline

This is the initial deterministic rendering layer for product Reels. It turns a JSON
campaign description and Shopify product media into an Instagram-ready
vertical MP4 without requiring a generative-video subscription.

## Render the example

From the repository root:

```powershell
npm --prefix tools/reel-pipeline run render:example
```

The result is written to `marketing/generated/lostcherry-pipeline-reel.mp4`,
with a JPEG cover beside it.

## Campaign format

Required fields are `product.title`, at least three `product.images`, `product.url`,
`output.video`, and at least one timed entry in `scenes`.

Optional fields include product price, brand colors and fonts, music,
voiceover, duration, frame rate, dimensions, and a cover-image output path.
Paths can be absolute or relative to the campaign JSON file. The renderer
creates a silent AAC track when no audio is provided so every output has a
consistent video-and-audio stream layout.

## Catalog and posting workflow

Set `SHOPIFY_STORE` and `SHOPIFY_ACCESS_TOKEN`, then run:

```powershell
npm --prefix tools/reel-pipeline run shopify:sync
npm --prefix tools/reel-pipeline run product:select
npm --prefix tools/reel-pipeline run history
```

The sync uses Shopify's GraphQL Admin API. Product selection requires three
images and excludes products generated or posted in the last 30 days. Override
that window with `node tools/reel-pipeline/select-product.mjs --cooldown 45`.

`data/reel-history.jsonl` is an append-only text ledger. Successful renders
record `generated` automatically when `historyFile` is present in the campaign.
After a successful platform publish, record `posted` with:

```powershell
npm --prefix tools/reel-pipeline run history:record -- --product-key HANDLE --title "PRODUCT" --status posted --reel-path "PATH"
```

The campaign JSON is the contract between Shopify selection, the
`aarnorae-reel-director` skill, the renderer, and future Instagram publishing.
