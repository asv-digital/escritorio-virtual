export type { AgentDef, Catalog, Nicho, CatalogMetadata, Frequencia } from "./schema";

export type AgentStatus =
  | "standby"
  | "executando"
  | "concluido"
  | "aguardando_input";

export interface AgentRuntimeState {
  id: string;
  status: AgentStatus;
  tarefa_atual?: string;
  cliente_atual?: string;
  iniciou_em?: number;
  termina_em?: number;
  progresso?: number;
  ultima_economia_brl?: number;
}

export interface EventoFeed {
  id: string;
  ts: number;
  agent_id: string;
  agent_nome: string;
  cliente_nome?: string;
  tipo: "iniciou" | "concluiu" | "aguardando";
  texto: string;
  cor: string;
  economia_brl?: number;
}
