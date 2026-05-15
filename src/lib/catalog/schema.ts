import { z } from "zod";

export const NichoSchema = z.enum([
  "contadores",
  "advogados",
  "engenheiros",
  "arquitetos",
  "marketing",
  "funcionarios",
]);
export type Nicho = z.infer<typeof NichoSchema>;

export const FrequenciaSchema = z.enum(["alta", "media", "baixa"]);
export type Frequencia = z.infer<typeof FrequenciaSchema>;

export const DuracaoSchema = z.object({
  min: z.number().int().positive(),
  media: z.number().int().positive(),
  max: z.number().int().positive(),
});

export const AgentDefSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id deve ser kebab-case"),
  nome: z.string().min(2).max(60),
  categoria: z.string().min(2).max(40),
  icone: z.string().min(1),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "cor deve ser hex #RRGGBB"),
  descricao: z.string().min(10).max(200),
  tarefas_template: z.array(z.string().min(5).max(80)).min(3),
  duracao_seg: DuracaoSchema,
  frequencia: FrequenciaSchema,
  horario_pico: z
    .tuple([z.number().int().min(0).max(23), z.number().int().min(0).max(23)])
    .refine(([a, b]) => a <= b, "horario_pico[0] deve ser <= horario_pico[1]"),
  economia_brl: z.number().nonnegative(),
  tags: z.array(z.string()).default([]),
});
export type AgentDef = z.infer<typeof AgentDefSchema>;

export const PaletaSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  surface: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const CatalogMetadataSchema = z.object({
  titulo_painel: z.string().min(5).max(50),
  descricao: z.string().min(10).max(200),
  paleta: PaletaSchema,
  tom: z.enum([
    "serio",
    "formal",
    "tecnico",
    "minimalista",
    "vibrante",
    "confiante",
  ]),
});
export type CatalogMetadata = z.infer<typeof CatalogMetadataSchema>;

export const CatalogSchema = z.object({
  nicho: NichoSchema,
  versao: z.string().regex(/^\d+\.\d+\.\d+$/, "semver"),
  metadata: CatalogMetadataSchema,
  agents: z.array(AgentDefSchema).length(57, "cada nicho deve ter exatamente 57 agents"),
  pool_clientes_fallback: z.array(z.string()).min(10),
});
export type Catalog = z.infer<typeof CatalogSchema>;

export function validateCatalog(data: unknown): Catalog {
  return CatalogSchema.parse(data);
}
