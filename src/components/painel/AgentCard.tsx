"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { AgentDef } from "@/lib/catalog/schema";
import type { AgentRuntimeState } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface Props {
  agent: AgentDef;
  state: AgentRuntimeState | undefined;
}

const STATUS_LABEL: Record<string, string> = {
  standby: "STANDBY",
  executando: "EXECUTANDO",
  concluido: "CONCLUÍDO",
  aguardando_input: "AGUARDANDO",
};

const STATUS_COR: Record<string, string> = {
  standby: "text-[var(--fg-mute)]",
  executando: "text-[var(--success)]",
  concluido: "text-[var(--accent)]",
  aguardando_input: "text-[var(--warn)]",
};

const STATUS_BG: Record<string, string> = {
  standby: "bg-[var(--surface-2)]",
  executando: "bg-[var(--success)]/10",
  concluido: "bg-[var(--accent)]/15",
  aguardando_input: "bg-[var(--warn)]/15",
};

export function AgentCard({ agent, state }: Props) {
  const status = state?.status ?? "standby";
  const Icone = (Icons as unknown as Record<string, React.FC<{ className?: string }>>)[
    iconKey(agent.icone)
  ] || Icons.Box;

  const progresso = state?.progresso ?? 0;
  const subtitulo =
    status === "executando"
      ? state?.tarefa_atual
      : status === "concluido"
        ? `✓ ${state?.tarefa_atual ?? agent.nome} concluído`
        : status === "aguardando_input"
          ? `⚠ Aguardando input — ${state?.cliente_atual ?? ""}`
          : agent.categoria;

  return (
    <motion.div
      layout
      className={cn(
        "group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors",
        status === "executando" && "border-[var(--success)]/30",
        status === "concluido" && "border-[var(--accent)]/30",
        status === "aguardando_input" && "border-[var(--warn)]/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            STATUS_BG[status],
          )}
          style={{ color: agent.cor }}
        >
          <Icone className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-medium text-[var(--fg)]">
              {agent.nome}
            </div>
            <span
              className={cn(
                "font-mono text-[10px] tracking-wider",
                STATUS_COR[status],
              )}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
          <div className="mt-0.5 truncate text-xs text-[var(--fg-dim)]">
            {subtitulo}
          </div>
        </div>
      </div>
      {status === "executando" && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <motion.div
            className="progress-stripe h-full"
            style={{ backgroundColor: agent.cor }}
            initial={{ width: 0 }}
            animate={{ width: `${progresso * 100}%` }}
            transition={{ duration: 0.4, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}

/** converte 'calculator' -> 'Calculator', 'file-text' -> 'FileText' */
function iconKey(name: string): string {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
