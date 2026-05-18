/**
 * Builda os 6 nichos em sequência. Falha-rápido.
 * Uso: pnpm build:all
 */
import { execSync } from "node:child_process";
import { rmSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { NICHOS } from "./nichos";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

function pasta_size_mb(dir: string): string {
  let total = 0;
  function walk(p: string) {
    for (const ent of readdirSync(p, { withFileTypes: true })) {
      const f = join(p, ent.name);
      if (ent.isDirectory()) walk(f);
      else total += statSync(f).size;
    }
  }
  walk(dir);
  return (total / 1024 / 1024).toFixed(2);
}

console.log("🧹 Limpando out/...");
rmSync(join(ROOT, "out"), { recursive: true, force: true });

const inicio = Date.now();

for (const n of NICHOS) {
  console.log(`\n▸ Building ${n}...`);
  const t0 = Date.now();
  try {
    execSync(`NICHO=${n} pnpm build`, {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "inherit"],
    });
  } catch {
    console.error(`✗ Falhou em ${n}`);
    process.exit(1);
  }
  const dur = ((Date.now() - t0) / 1000).toFixed(1);
  const sz = pasta_size_mb(join(ROOT, "out", n));
  console.log(`✓ ${n}: ${dur}s · ${sz}MB`);
}

const total = ((Date.now() - inicio) / 1000).toFixed(1);
console.log(`\n🏁 Build de ${NICHOS.length} nichos em ${total}s`);
