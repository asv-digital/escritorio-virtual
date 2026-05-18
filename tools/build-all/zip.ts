/**
 * Empacota out/<nicho> em releases/v<versao>/Escritorio-Virtual-<Nicho>.zip
 * Inclui LEIA-ME.md gerado dinamicamente.
 * Uso: pnpm zip:all
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NICHOS, NICHO_LABEL } from "./nichos";
import { gerarLeiame } from "./leiame";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const versao = pkg.version;
const RELEASE_DIR = join(ROOT, "releases", `v${versao}`);
mkdirSync(RELEASE_DIR, { recursive: true });

console.log(`📦 Empacotando v${versao} em releases/v${versao}/\n`);

for (const nicho of NICHOS) {
  const outDir = join(ROOT, "out", nicho);
  if (!existsSync(outDir)) {
    console.error(`✗ out/${nicho} não existe — rode pnpm build:all antes`);
    process.exit(1);
  }

  const stage = join(ROOT, ".tmp-zip", nicho);
  rmSync(stage, { recursive: true, force: true });
  mkdirSync(stage, { recursive: true });

  // copia o build inteiro
  cpSync(outDir, stage, { recursive: true });

  // grava LEIA-ME.md (Markdown) + LEIA-ME.txt (cópia ASCII pra Windows que não abre .md por padrão)
  const leiame = gerarLeiame(nicho, versao);
  writeFileSync(join(stage, "LEIA-ME.md"), leiame);
  writeFileSync(join(stage, "LEIA-ME.txt"), leiame.replace(/[#*`]/g, ""));

  const zipName = `Escritorio-Virtual-${NICHO_LABEL[nicho]}.zip`;
  const zipPath = join(RELEASE_DIR, zipName);
  rmSync(zipPath, { force: true });

  // -X tira metadados extra-attr do macOS; -r recursivo; cd no stage pra raiz do zip ser limpa
  execSync(`cd "${stage}" && zip -rqX "${zipPath}" .`, { stdio: "inherit" });

  const sz = (statSync(zipPath).size / 1024 / 1024).toFixed(2);
  console.log(`✓ ${zipName}: ${sz}MB`);
}

rmSync(join(ROOT, ".tmp-zip"), { recursive: true, force: true });
console.log(`\n🏁 6 zips em releases/v${versao}/`);
