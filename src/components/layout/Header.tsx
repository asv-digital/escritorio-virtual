"use client";

import { useEffect, useState } from "react";
import { getCatalog } from "@/lib/catalog/loader";
import { useConfig } from "@/lib/stores/config-store";
import { useSimulator } from "@/lib/stores/simulator-store";

function relogio() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}

export function Header() {
  const catalog = getCatalog();
  const empresa = useConfig((s) => s.empresa.nome);
  const totalOnline = useSimulator((s) => s.agents.length);
  const [hora, setHora] = useState("--:--:--");

  useEffect(() => {
    setHora(relogio());
    const id = setInterval(() => setHora(relogio()), 1000);
    return () => clearInterval(id);
  }, []);

  const titulo = empresa
    ? `${empresa} · ${catalog.metadata.titulo_painel}`
    : catalog.metadata.titulo_painel;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--fg-mute)]">
            Escritório Virtual
          </div>
          <div className="hidden text-sm font-medium text-[var(--fg-dim)] md:block">
            {titulo}
          </div>
        </div>
        <div className="flex items-center gap-5 font-mono text-xs">
          <div className="hidden items-center gap-2 md:flex">
            <span className="status-online-dot inline-block h-2 w-2 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--fg-dim)]">
              {totalOnline} agentes online
            </span>
          </div>
          <div className="text-[var(--fg-mute)]">{hora}</div>
        </div>
      </div>
    </header>
  );
}
