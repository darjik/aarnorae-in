import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { appendHistory, readHistory } from "./lib/history.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const action = args[0] || "list";

function option(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
}

const historyPath = resolve(option("file", `${here}/data/reel-history.jsonl`));

if (action === "list") {
  const history = readHistory(historyPath);
  if (!history.length) console.log(`No reel history in ${historyPath}`);
  else console.table(history.map((entry) => ({
    product: entry.title || entry.handle || entry.productKey,
    status: entry.status,
    generated: entry.generatedAt || "",
    posted: entry.postedAt || "",
    platform: entry.platform || "",
  })));
} else if (action === "record") {
  const status = option("status");
  const key = option("product-key");
  const title = option("title");
  if (!key || !title || !["generated", "posted"].includes(status)) {
    console.error("Usage: node history.mjs record --product-key KEY --title TITLE --status generated|posted [--reel-path PATH]");
    process.exit(1);
  }
  const now = new Date().toISOString();
  appendHistory(historyPath, {
    productKey: key,
    title,
    status,
    generatedAt: status === "generated" ? now : null,
    postedAt: status === "posted" ? now : null,
    platform: option("platform", "instagram"),
    reelPath: option("reel-path", null),
  });
  console.log(`Recorded ${status} for ${title}`);
} else {
  console.error(`Unknown history action: ${action}`);
  process.exit(1);
}
