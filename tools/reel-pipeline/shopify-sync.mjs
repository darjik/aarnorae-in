import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const store = process.env.SHOPIFY_STORE;
const token = process.env.SHOPIFY_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";
const output = resolve(process.argv[2] || `${here}/data/shopify-products.json`);

if (!store || !token) {
  console.error("Set SHOPIFY_STORE (for example, brand.myshopify.com) and SHOPIFY_ACCESS_TOKEN.");
  process.exit(1);
}

const query = `
  query ReelProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, query: "status:active") {
      nodes {
        id
        title
        handle
        description
        onlineStoreUrl
        media(first: 10, query: "media_type:IMAGE", sortKey: POSITION) {
          nodes {
            alt
            ... on MediaImage {
              image { url width height altText }
            }
          }
        }
        variants(first: 1) { nodes { price } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const products = [];
let after = null;
do {
  const response = await fetch(`https://${store}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables: { first: 50, after } }),
  });
  if (!response.ok) throw new Error(`Shopify returned ${response.status}: ${await response.text()}`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
  const connection = payload.data.products;
  products.push(...connection.nodes.map((product) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    url: product.onlineStoreUrl,
    price: product.variants.nodes[0]?.price || null,
    currency: null,
    images: product.media.nodes
      .filter((media) => media.image?.url)
      .map((media) => ({ url: media.image.url, alt: media.image.altText || media.alt || "", width: media.image.width, height: media.image.height })),
  })));
  after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
} while (after);

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify({ syncedAt: new Date().toISOString(), store, products }, null, 2)}\n`, "utf8");
console.log(`Synced ${products.length} active products to ${output}`);
