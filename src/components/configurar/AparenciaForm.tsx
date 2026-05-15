"use client";

import { Moon, Sun, Monitor, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfig } from "@/lib/stores/config-store";
import { cn } from "@/lib/utils";

const TEMAS = [
  { id: "dark", label: "Escuro", icone: Moon },
  { id: "light", label: "Claro", icone: Sun },
  { id: "auto", label: "Automático", icone: Monitor },
] as const;

export function AparenciaForm() {
  const tema = useConfig((s) => s.preferencias.tema);
  const setTema = useConfig((s) => s.setTema);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>Como o painel se adapta ao seu olho.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-[var(--fg-mute)]">
            Tema
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TEMAS.map(({ id, label, icone: Icone }) => (
              <button
                key={id}
                onClick={() => setTema(id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-md border-2 p-4 text-sm transition-all",
                  tema === id
                    ? "border-[var(--primary)] bg-[var(--surface-2)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--fg-mute)]",
                )}
              >
                <Icone className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--fg-mute)]">
            Por enquanto só temos dark — vamos liberar light e auto em breve.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
