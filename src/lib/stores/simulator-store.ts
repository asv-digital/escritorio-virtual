"use client";

import { create } from "zustand";
import type { AgentDef } from "@/lib/catalog/schema";
import type { AgentRuntimeState, EventoFeed } from "@/lib/catalog/types";
import { TICK_MS, tick } from "@/lib/simulator/engine";

const MAX_EVENTOS_FEED = 50;

interface SimulatorStore {
  agents: AgentDef[];
  state: Record<string, AgentRuntimeState>;
  feed: EventoFeed[];
  metricas: {
    tarefas_hoje: number;
    tempo_trabalhado_ms: number;
    economia_hoje_brl: number;
    iniciado_em: number;
  };
  paused: boolean;
  intervalId: number | null;

  init(agents: AgentDef[]): void;
  start(clientes: string[]): void;
  stop(): void;
  pause(): void;
  resume(): void;
  reset(): void;
}

export const useSimulator = create<SimulatorStore>((set, get) => ({
  agents: [],
  state: {},
  feed: [],
  metricas: {
    tarefas_hoje: 0,
    tempo_trabalhado_ms: 0,
    economia_hoje_brl: 0,
    iniciado_em: Date.now(),
  },
  paused: false,
  intervalId: null,

  init(agents: AgentDef[]) {
    const state: Record<string, AgentRuntimeState> = {};
    for (const a of agents) {
      state[a.id] = { id: a.id, status: "standby" };
    }
    set({ agents, state });
  },

  start(clientes: string[]) {
    const existing = get().intervalId;
    if (existing) return;

    const id = window.setInterval(() => {
      const st = get();
      if (st.paused) return;
      const now = Date.now();
      const out = tick({
        now,
        agents: st.agents,
        state: st.state,
        clientes,
      });

      const ativosCount = Object.values(out.state).filter(
        (a) => a.status === "executando",
      ).length;
      const tempoIncremento = (ativosCount * TICK_MS) / 1;

      set({
        state: out.state,
        feed: [...out.novosEventos, ...st.feed].slice(0, MAX_EVENTOS_FEED),
        metricas: {
          ...st.metricas,
          tarefas_hoje: st.metricas.tarefas_hoje + out.tarefasConcluidas,
          tempo_trabalhado_ms: st.metricas.tempo_trabalhado_ms + tempoIncremento,
          economia_hoje_brl:
            st.metricas.economia_hoje_brl + out.economiaTickBrl,
        },
      });
    }, TICK_MS);

    set({ intervalId: id as unknown as number });
  },

  stop() {
    const id = get().intervalId;
    if (id) window.clearInterval(id);
    set({ intervalId: null });
  },

  pause() {
    set({ paused: true });
  },

  resume() {
    set({ paused: false });
  },

  reset() {
    get().stop();
    const state: Record<string, AgentRuntimeState> = {};
    for (const a of get().agents) {
      state[a.id] = { id: a.id, status: "standby" };
    }
    set({
      state,
      feed: [],
      metricas: {
        tarefas_hoje: 0,
        tempo_trabalhado_ms: 0,
        economia_hoje_brl: 0,
        iniciado_em: Date.now(),
      },
      paused: false,
    });
  },
}));
