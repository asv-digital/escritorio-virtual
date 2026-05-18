/**
 * Substitui __SW_VERSION__ no out/<nicho>/sw.js por NICHO-versao-timestamp.
 * Roda no postbuild.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

const nicho = process.env.NICHO || "contadores";
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const version = pkg.version;
const stamp = Date.now();

const swPath = join(ROOT, "out", nicho, "sw.js");
if (!existsSync(swPath)) {
  console.warn(`[pwa] sw.js não encontrado em ${swPath}, pulando`);
  process.exit(0);
}

const fingerprint = `${nicho}-${version}-${stamp}`;
const content = readFileSync(swPath, "utf-8").replace(/__SW_VERSION__/g, fingerprint);
writeFileSync(swPath, content);

console.log(`✓ SW versionado: ${fingerprint}`);
