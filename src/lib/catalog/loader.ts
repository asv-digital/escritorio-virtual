import { type Catalog, type Nicho, validateCatalog } from "./schema";
import contadoresRaw from "@/data/catalogs/contadores.json";
import advogadosRaw from "@/data/catalogs/advogados.json";
import engenheirosRaw from "@/data/catalogs/engenheiros.json";
import arquitetosRaw from "@/data/catalogs/arquitetos.json";
import marketingRaw from "@/data/catalogs/marketing.json";
import funcionariosRaw from "@/data/catalogs/funcionarios.json";

const CATALOGS: Record<Nicho, unknown> = {
  contadores: contadoresRaw,
  advogados: advogadosRaw,
  engenheiros: engenheirosRaw,
  arquitetos: arquitetosRaw,
  marketing: marketingRaw,
  funcionarios: funcionariosRaw,
};

let cached: Catalog | null = null;

export function getCatalog(): Catalog {
  if (cached) return cached;
  const nicho = (process.env.NEXT_PUBLIC_NICHO || "contadores") as Nicho;
  const raw = CATALOGS[nicho];
  if (!raw) {
    throw new Error(
      `Catálogo do nicho "${nicho}" indisponível. Aceitos: ${Object.keys(CATALOGS).join(", ")}`,
    );
  }
  cached = validateCatalog(raw);
  return cached;
}

export function getNicho(): Nicho {
  return getCatalog().nicho;
}
