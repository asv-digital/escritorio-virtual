/**
 * Gera public/manifest.webmanifest e public/icons/*.svg por nicho.
 * Executado antes do build via prebuild script.
 *
 * Uso: tsx tools/pwa/generate-manifest.ts <nicho?>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

interface Catalog {
  nicho: string;
  versao: string;
  metadata: {
    titulo_painel: string;
    descricao: string;
    paleta: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
    };
  };
}

const SIGLAS_NICHO: Record<string, string> = {
  contadores: "EC",
  advogados: "EJ",
  engenheiros: "EE",
  arquitetos: "AR",
  marketing: "MK",
  funcionarios: "OP",
};

const SHORT_NAME: Record<string, string> = {
  contadores: "Contábil",
  advogados: "Jurídico",
  engenheiros: "Engenharia",
  arquitetos: "Arquitetura",
  marketing: "Marketing",
  funcionarios: "Operacional",
};

function svgIcon(size: number, paleta: Catalog["metadata"]["paleta"], sigla: string, maskable = false): string {
  const pad = maskable ? size * 0.15 : 0;
  const inner = size - pad * 2;
  const fontSize = Math.floor(inner * 0.38);
  const radius = maskable ? 0 : size * 0.18;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${paleta.background}"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${radius * 0.6}" fill="${paleta.primary}"/>
  <text x="${size / 2}" y="${size / 2}" font-family="monospace" font-size="${fontSize}" font-weight="800" fill="${paleta.background}" text-anchor="middle" dominant-baseline="central">${sigla}</text>
</svg>`;
}

function gerarParaNicho(nicho: string) {
  const catalogPath = join(ROOT, "src", "data", "catalogs", `${nicho}.json`);
  if (!existsSync(catalogPath)) {
    console.warn(`[pwa] catálogo não encontrado: ${nicho}, pulando`);
    return;
  }
  const catalog: Catalog = JSON.parse(readFileSync(catalogPath, "utf-8"));
  const { paleta } = catalog.metadata;
  const sigla = SIGLAS_NICHO[nicho] || "EV";

  const publicDir = join(ROOT, "public");
  const iconsDir = join(publicDir, "icons");
  if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

  // Ícones SVG (192, 512, maskable 512)
  writeFileSync(join(iconsDir, "icon-192.svg"), svgIcon(192, paleta, sigla, false));
  writeFileSync(join(iconsDir, "icon-512.svg"), svgIcon(512, paleta, sigla, false));
  writeFileSync(join(iconsDir, "icon-maskable.svg"), svgIcon(512, paleta, sigla, true));
  writeFileSync(join(iconsDir, "favicon.svg"), svgIcon(64, paleta, sigla, false));

  // Manifest
  const manifest = {
    name: `${catalog.metadata.titulo_painel} — Bravy`,
    short_name: `Escritório ${SHORT_NAME[nicho] || ""}`.trim(),
    description: catalog.metadata.descricao,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    theme_color: paleta.background,
    background_color: paleta.background,
    lang: "pt-BR",
    categories: ["productivity", "business"],
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-maskable.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
  writeFileSync(
    join(publicDir, "manifest.webmanifest"),
    JSON.stringify(manifest, null, 2),
  );

  console.log(
    `✓ PWA assets gerados para "${nicho}" (${SHORT_NAME[nicho]}, sigla ${sigla})`,
  );
}

const nicho = process.argv[2] || process.env.NICHO || "contadores";
gerarParaNicho(nicho);
