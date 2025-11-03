import fs from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../../");
const browser = resolve(root, "dist/cloudflare/browser");
const cloudflare = resolve(root, "dist/cloudflare");

// Verify folder exists
if (!fs.existsSync(browser)) {
  console.error(`❌ Browser folder not found at: ${browser}`);
  process.exit(1);
}

// Copy everything from browser/ to cloudflare/
fs.cpSync(browser, cloudflare, { recursive: true, force: true });

console.log(`✅ Browser files moved to ${cloudflare}. Ready for deployment.`);
