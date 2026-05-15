import type { AgentDef } from "@/lib/catalog/schema";
import type { AgentRuntimeState, EventoFeed } from "@/lib/catalog/types";
import { nanoId, pickRandom, randomInt, randomNormal } from "@/lib/utils";

const TICK_MS = 500;
const CONCLUIDO_HOLD_MS = 8_000;
const AGUARDANDO_INPUT_CHANCE = 0.06;
const AGUARDANDO_MIN_MS = 30_000;
const AGUARDANDO_MAX_MS = 90_000;
const AGUARDANDO_TIMEOUT_MS = 5 * 60_000;

const FREQ_BASE_POR_TICK = {
  alta: 0.04,
  media: 0.018,
  baixa: 0.006,
} as const;

export interface SimulatorTickInput {
  now: number;
  agents: AgentDef[];
  state: Record<string, AgentRuntimeState>;
  clientes: string[];
}

export interface SimulatorTickOutput {
  state: Record<string, AgentRuntimeState>;
  novosEventos: EventoFeed[];
  economiaTickBrl: number;
  tarefasConcluidas: number;
}

function multiplicadorHorario(now: Date, agent: AgentDef): number {
  const h = now.getHours();
  const [pi, pf] = agent.horario_pico;
  if (h >= pi && h <= pf) return 1.5;
  if (h >= pi - 2 && h <= pf + 2) return 0.9;
  if (h >= 6 && h <= 22) return 0.45;
  return 0.15;
}

function escolherTarefa(agent: AgentDef, cliente: string): string {
  const template = pickRandom(agent.tarefas_template);
  return template
    .replace(/\{cliente\}/g, cliente)
    .replace(/\{anexo\}/g, pickRandom(["I", "II", "III", "IV", "V"]));
}

function novaTarefa(
  agent: AgentDef,
  now: number,
  clientes: string[],
): AgentRuntimeState {
  const cliente = pickRandom(clientes);
  const duracaoSeg = randomNormal(
    agent.duracao_seg.min,
    agent.duracao_seg.media,
    agent.duracao_seg.max,
  );
  return {
    id: agent.id,
    status: "executando",
    tarefa_atual: escolherTarefa(agent, cliente),
    cliente_atual: cliente,
    iniciou_em: now,
    termina_em: now + duracaoSeg * 1000,
    progresso: 0,
  };
}

export function tick(input: SimulatorTickInput): SimulatorTickOutput {
  const { now, agents, state, clientes } = input;
  const newState: Record<string, AgentRuntimeState> = { ...state };
  const novosEventos: EventoFeed[] = [];
  let economiaTickBrl = 0;
  let tarefasConcluidas = 0;
  const nowDate = new Date(now);

  for (const agent of agents) {
    const s = newState[agent.id] || { id: agent.id, status: "standby" };

    switch (s.status) {
      case "standby": {
        const prob =
          FREQ_BASE_POR_TICK[agent.frequencia] *
          multiplicadorHorario(nowDate, agent) *
          (0.8 + Math.random() * 0.4);
        if (Math.random() < prob) {
          const nova = novaTarefa(agent, now, clientes);
          newState[agent.id] = nova;
          novosEventos.push({
            id: nanoId(),
            ts: now,
            agent_id: agent.id,
            agent_nome: agent.nome,
            cliente_nome: nova.cliente_atual,
            tipo: "iniciou",
            texto: nova.tarefa_atual!,
            cor: agent.cor,
          });
        }
        break;
      }
      case "executando": {
        const total = (s.termina_em || now) - (s.iniciou_em || now);
        const elapsed = now - (s.iniciou_em || now);
        const progresso = total > 0 ? Math.min(1, elapsed / total) : 1;

        if (progresso >= 1) {
          if (Math.random() < AGUARDANDO_INPUT_CHANCE) {
            const ate = now + randomInt(AGUARDANDO_MIN_MS, AGUARDANDO_MAX_MS);
            newState[agent.id] = {
              ...s,
              status: "aguardando_input",
              termina_em: ate,
              progresso: 1,
            };
            novosEventos.push({
              id: nanoId(),
              ts: now,
              agent_id: agent.id,
              agent_nome: agent.nome,
              cliente_nome: s.cliente_atual,
              tipo: "aguardando",
              texto: `Aguardando input — ${s.cliente_atual ?? ""}`,
              cor: agent.cor,
            });
          } else {
            newState[agent.id] = {
              ...s,
              status: "concluido",
              termina_em: now + CONCLUIDO_HOLD_MS,
              progresso: 1,
              ultima_economia_brl: agent.economia_brl,
            };
            economiaTickBrl += agent.economia_brl;
            tarefasConcluidas += 1;
            novosEventos.push({
              id: nanoId(),
              ts: now,
              agent_id: agent.id,
              agent_nome: agent.nome,
              cliente_nome: s.cliente_atual,
              tipo: "concluiu",
              texto: `${s.tarefa_atual ?? agent.nome} concluído`,
              cor: agent.cor,
              economia_brl: agent.economia_brl,
            });
          }
        } else {
          newState[agent.id] = { ...s, progresso };
        }
        break;
      }
      case "concluido": {
        if (now >= (s.termina_em || 0)) {
          newState[agent.id] = { id: agent.id, status: "standby" };
        }
        break;
      }
      case "aguardando_input": {
        if (now >= (s.termina_em || 0)) {
          const remaining =
            now - (s.iniciou_em || now) < AGUARDANDO_TIMEOUT_MS
              ? "executando"
              : "standby";
          if (remaining === "executando") {
            const dur = randomNormal(
              agent.duracao_seg.min / 2,
              agent.duracao_seg.media / 2,
              agent.duracao_seg.max / 2,
            );
            newState[agent.id] = {
              ...s,
              status: "executando",
              iniciou_em: now,
              termina_em: now + dur * 1000,
              progresso: 0,
            };
          } else {
            newState[agent.id] = { id: agent.id, status: "standby" };
          }
        }
        break;
      }
    }
  }

  return { state: newState, novosEventos, economiaTickBrl, tarefasConcluidas };
}

export { TICK_MS };
