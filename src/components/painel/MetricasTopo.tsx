"use client";

import { useEffect, useState } from "react";
import { useSimulator } from "@/lib/stores/simulator-store";
import { formatBRL, formatDuracao } from "@/lib/utils";

interface CardProps {
  label: string;
  valor: string;
  hint?: string;
  emoji?: string;
}

function Card({ label, valor, hint, emoji }: CardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--fg-mute)]">
        {emoji && <span className="text-base">{emoji}</span>}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-[var(--fg)]">
        {valor}
      </div>
      {hint && <div className="mt-1 text-xs text-[var(--fg-dim)]">{hint}</div>}
    </div>
  );
}

export function MetricasTopo() {
  const metricas = useSimulator((s) => s.metricas);
  const state = useSimulator((s) => s.state);
  const agents = useSimulator((s) => s.agents);

  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const executando = Object.values(state).filter(
    (s) => s.status === "executando",
  ).length;

  const top = Object.entries(state)
    .filter(([, s]) => s.status === "executando")
    .map(([id]) => agents.find((a) => a.id === id)?.nome)
    .filter(Boolean)
    .slice(0, 1)[0];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card
        label="Trabalhando agora"
        emoji="⚡"
        valor={`${executando}/${agents.length}`}
        hint="agentes executando tarefa"
      />
      <Card
        label="Tempo trabalhado hoje"
        emoji="⏱"
        valor={formatDuracao(metricas.tempo_trabalhado_ms)}
        hint="acumulado desde o início"
      />
      <Card
        label="Economia equivalente"
        emoji="💰"
        valor={formatBRL(metricas.economia_hoje_brl)}
        hint="vs salário CLT"
      />
      <Card
        label="Tarefas concluídas"
        emoji="✓"
        valor={metricas.tarefas_hoje.toString()}
        hint={top ? `top: ${top}` : "—"}
      />
    </div>
  );
}
