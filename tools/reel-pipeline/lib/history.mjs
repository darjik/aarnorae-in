import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

export function productKey(product) {
  return String(product.productKey || product.handle || product.id || product.url || product.title)
    .trim()
    .toLowerCase();
}

export function readHistory(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try { return JSON.parse(line); }
      catch (error) { throw new Error(`Invalid history entry on line ${index + 1}: ${error.message}`); }
    });
}

export function appendHistory(path, entry) {
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${JSON.stringify(entry)}\n`, "utf8");
}

export function latestUse(history, product) {
  const key = productKey(product);
  return history
    .filter((entry) => productKey(entry) === key)
    .map((entry) => entry.postedAt || entry.generatedAt || entry.createdAt)
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .sort((a, b) => b - a)[0] || null;
}

export function isRecentlyUsed(history, product, cooldownDays, now = new Date()) {
  const latest = latestUse(history, product);
  if (!latest) return false;
  return now - latest < cooldownDays * 86400000;
}
