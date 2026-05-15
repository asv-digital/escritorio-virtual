"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimulator } from "@/lib/stores/simulator-store";
import { formatBRL, formatHora } from "@/lib/utils";

const TIPO_ICONE: Record<string, string> = {
  iniciou: "▸",
  concluiu: "✓",
  aguardando: "⚠",
};

const TIPO_COR: Record<string, string> = {
  iniciou: "text-[var(--fg-dim)]",
  concluiu: "text-[var(--success)]",
  aguardando: "text-[var(--warn)]",
};

export function FeedAtividade() {
  const feed = useSimulator((s) => s.feed);

  return (
    <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="status-online-dot inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--fg-mute)]">
            Feed ao vivo
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[var(--fg-mute)]">
          {feed.length} eventos
        </span>
      </div>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-2 py-2">
        {feed.length === 0 && (
          <div className="px-3 py-8 text-center text-xs text-[var(--fg-mute)]">
            Aguardando primeira atividade...
          </div>
        )}
        <AnimatePresence initial={false}>
          {feed.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="group flex gap-2 rounded-md px-2 py-1.5 font-mono text-xs hover:bg-[var(--surface-2)]"
            >
              <span className="shrink-0 text-[var(--fg-mute)]">
                {formatHora(e.ts)}
              </span>
              <span className={`shrink-0 ${TIPO_COR[e.tipo]}`}>
                {TIPO_ICONE[e.tipo]}
              </span>
              <span className="min-w-0 flex-1 truncate text-[var(--fg-dim)]">
                {e.texto}
              </span>
              {e.economia_brl && (
                <span className="shrink-0 text-[var(--success)]">
                  +{formatBRL(e.economia_brl)}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
