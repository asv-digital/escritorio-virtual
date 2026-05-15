import { type Catalog, type Nicho, validateCatalog } from "./schema";
import contadoresRaw from "@/data/catalogs/contadores.json";

const CATALOGS: Partial<Record<Nicho, unknown>> = {
  contadores: contadoresRaw,
  // advogados: ..., engenheiros: ..., etc. (próximos sprints)
};

let cached: Catalog | null = null;

export function getCatalog(): Catalog {
  if (cached) return cached;
  const nicho = (process.env.NEXT_PUBLIC_NICHO || "contadores") as Nicho;
  const raw = CATALOGS[nicho];
  if (!raw) {
    throw new Error(
      `Catálogo do nicho "${nicho}" não disponível neste build. Disponíveis: ${Object.keys(CATALOGS).join(", ")}`,
    );
  }
  cached = validateCatalog(raw);
  return cached;
}

export function getNicho(): Nicho {
  return getCatalog().nicho;
}
