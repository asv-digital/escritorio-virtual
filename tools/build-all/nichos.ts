export const NICHOS = [
  "contadores",
  "advogados",
  "engenheiros",
  "arquitetos",
  "marketing",
  "funcionarios",
] as const;

export type Nicho = (typeof NICHOS)[number];

export const NICHO_LABEL: Record<Nicho, string> = {
  contadores: "Contadores",
  advogados: "Advogados",
  engenheiros: "Engenheiros",
  arquitetos: "Arquitetos",
  marketing: "Marketing",
  funcionarios: "Funcionarios",
};

export const NICHO_TITULO: Record<Nicho, string> = {
  contadores: "Escritório Contábil 24h",
  advogados: "Escritório Jurídico 24h",
  engenheiros: "Escritório de Engenharia 24h",
  arquitetos: "Estúdio de Arquitetura 24h",
  marketing: "Agência de Marketing 24h",
  funcionarios: "Departamento Operacional 24h",
};
