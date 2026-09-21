import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isRecentlyUsed, latestUse, readHistory } from "./lib/history.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
}
function stop(message) { console.error(message); process.exit(1); }

const catalogPath = resolve(option("catalog", `${here}/data/shopify-products.json`));
const historyPath = resolve(option("history", `${here}/data/reel-history.jsonl`));
const outputPath = resolve(option("output", `${here}/data/selected-product.json`));
const assetDir = resolve(option("assets", `${here}/data/selected-assets`));
const cooldownDays = Number(option("cooldown", "30"));
if (!Number.isFinite(cooldownDays) || cooldownDays < 0) stop("--cooldown must be zero or a positive number");
if (!existsSync(catalogPath)) stop(`Catalog not found: ${catalogPath}. Run npm run shopify:sync first.`);

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const products = Array.isArray(catalog) ? catalog : catalog.products;
const history = readHistory(historyPath);
const candidates = products
  .filter((product) => product.url && product.images?.length >= 3)
  .filter((product) => !isRecentlyUsed(history, product, cooldownDays))
  .sort((a, b) => {
    const aUsed = latestUse(history, a)?.getTime() || 0;
    const bUsed = latestUse(history, b)?.getTime() || 0;
    return aUsed - bUsed || b.images.length - a.images.length || a.title.localeCompare(b.title);
  });

if (!candidates.length) stop(`No eligible product has three images and falls outside the ${cooldownDays}-day cooldown.`);
const selected = candidates[0];
mkdirSync(assetDir, { recursive: true });

async function acquire(source, index) {
  const value = typeof source === "string" ? source : source.url;
  let extension = ".jpg";
  try { extension = extname(new URL(value).pathname) || extension; } catch { extension = extname(value) || extension; }
  const destination = resolve(assetDir, `${selected.handle || "product"}-${index + 1}${extension}`);
  if (/^https?:\/\//i.test(value)) {
    const response = await fetch(value);
    if (!response.ok) throw new Error(`Image download failed (${response.status}): ${value}`);
    writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
  } else {
    const sourcePath = resolve(dirname(catalogPath), value);
    if (!existsSync(sourcePath)) throw new Error(`Local image not found: ${sourcePath}`);
    copyFileSync(sourcePath, destination);
  }
  return destination;
}

const images = [];
for (const [index, source] of selected.images.slice(0, 3).entries()) images.push(await acquire(source, index));
const result = { ...selected, images, selectedAt: new Date().toISOString(), cooldownDays, previousUse: latestUse(history, selected)?.toISOString() || null };
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(`Selected ${selected.title}`);
console.log(`Prepared ${images.length} images and wrote ${outputPath}`);
