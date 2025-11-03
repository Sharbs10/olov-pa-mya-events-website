// tools/copy-files.mjs
import fs from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../../");
const dist = resolve(root, "dist/cloudflare");

// Verify folder exists before copying
if (!fs.existsSync(dist)) {
  console.error(`❌ Build output not found at: ${dist}`);
  process.exit(1);
}

console.log(`✅ Build found at: ${dist}. Ready for deployment.`);
