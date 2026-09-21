# Campaign Contract

Write JSON accepted by `tools/reel-pipeline/render.mjs`.

Required structure:

```json
{
  "product": {
    "id": "Shopify product ID",
    "handle": "product-handle",
    "title": "Display name",
    "price": "From Rs. 349",
    "url": "https://store.example/products/handle",
    "images": ["absolute-or-relative-path-1", "path-2", "path-3"]
  },
  "brand": {
    "name": "AARNORAE PARFUMS",
    "accent": "F0CFA4",
    "font": "C:/Windows/Fonts/georgiab.ttf",
    "bodyFont": "C:/Windows/Fonts/arial.ttf"
  },
  "duration": 12,
  "fps": 30,
  "scenes": [
    { "start": 0.3, "end": 3, "text": "HOOK", "style": "hero" },
    { "start": 3, "end": 6, "text": "ATTRIBUTE", "style": "body" },
    { "start": 6, "end": 9, "text": "OCCASION OR BENEFIT", "style": "body" },
    { "start": 9, "end": 12, "text": "SHOP PRODUCT", "style": "cta" }
  ],
  "audio": {
    "music": "optional-cleared-audio-path",
    "voiceover": "optional-voiceover-path",
    "musicVolume": 0.18,
    "voiceoverVolume": 1
  },
  "historyFile": "data/reel-history.jsonl",
  "output": { "video": "output.mp4", "cover": "cover.jpg" }
}
```

Constraints:

- Include at least three image paths.
- Scene times must not overlap the duration boundary.
- Use only `hero`, `body`, or `cta` styles.
- Keep overlay lines short enough for a 1080x1920 frame.
- Omit `audio.music` unless the file is licensed for commercial social use.
