"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
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
  const logo = useConfig((s) => s.empresa.logo_base64);
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
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-3">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt="logo"
              className="h-9 w-9 shrink-0 rounded object-contain"
            />
          ) : (
            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)] sm:flex">
              <span className="font-mono text-sm font-bold">EV</span>
            </div>
          )}
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--fg-mute)]">
              Escritório Virtual
            </div>
            <div className="truncate text-sm font-medium text-[var(--fg)]">
              {titulo}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden items-center gap-2 md:flex">
            <span className="status-online-dot inline-block h-2 w-2 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--fg-dim)]">
              {totalOnline} online
            </span>
          </div>
          <div className="hidden text-[var(--fg-mute)] sm:block">{hora}</div>
          <Link
            href="/configurar"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--fg-dim)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Configurar</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
