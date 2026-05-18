/**
 * Cria GitHub Release com os 6 zips anexados.
 * Pré-requisitos: gh CLI autenticado, working tree limpo, builds rodados (pnpm build:all + pnpm zip:all).
 *
 * Uso: pnpm release
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NICHO_LABEL, NICHOS, NICHO_TITULO } from "./nichos";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const versao = pkg.version;
const tag = `v${versao}`;
const releaseDir = join(ROOT, "releases", tag);

// Verifica zips existem
const zips = NICHOS.map((n) => join(releaseDir, `Escritorio-Virtual-${NICHO_LABEL[n]}.zip`));
for (const z of zips) {
  if (!existsSync(z)) {
    console.error(`✗ Falta ${z} — rode pnpm zip:all antes`);
    process.exit(1);
  }
}

// Verifica gh CLI
try {
  execSync("gh auth status", { stdio: "ignore" });
} catch {
  console.error("✗ gh CLI não autenticado. Rode `gh auth login`.");
  process.exit(1);
}

// Notes
const linhas = NICHOS.map(
  (n) => `- **${NICHO_TITULO[n]}** → \`Escritorio-Virtual-${NICHO_LABEL[n]}.zip\``,
);

const notes = `## Escritório Virtual ${tag}

Bônus dos pacotes Bravy / ASV Digital. Painel standalone com 57 agentes simulados trabalhando 24/7, por nicho.

### Downloads (1 zip por nicho)

${linhas.join("\n")}

### Como usar

1. Cliente baixa o zip do nicho dele
2. Descompacta
3. Abre \`index.html\` no navegador
4. Funciona offline. Pode instalar como app (PWA).

Detalhes técnicos no \`README.md\` do repo.
`;

console.log(`🚀 Criando release ${tag}...`);

// Cria tag se não existir
try {
  execSync(`git rev-parse ${tag}`, { stdio: "ignore" });
  console.log(`(tag ${tag} já existe localmente)`);
} catch {
  execSync(`git tag ${tag}`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });
}

// Cria release
const cmd = [
  "gh release create",
  tag,
  ...zips.map((z) => `"${z}"`),
  `--title "Escritório Virtual ${tag}"`,
  `--notes "${notes.replace(/"/g, '\\"')}"`,
].join(" ");

execSync(cmd, { cwd: ROOT, stdio: "inherit" });

console.log(`\n✓ Release ${tag} publicado em github.com/asv-digital/escritorio-virtual/releases/tag/${tag}`);
