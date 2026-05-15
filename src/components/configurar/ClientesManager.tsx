"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/lib/stores/config-store";

const SEGMENTOS = [
  "Comércio",
  "Serviços",
  "Indústria",
  "Restaurante",
  "Construção",
  "Tecnologia",
  "Saúde",
  "Educação",
  "Pessoa Física",
  "Outro",
];

const LIMITE = 20;

export function ClientesManager() {
  const clientes = useConfig((s) => s.clientes);
  const addCliente = useConfig((s) => s.addCliente);
  const removeCliente = useConfig((s) => s.removeCliente);

  const [nome, setNome] = useState("");
  const [segmento, setSegmento] = useState(SEGMENTOS[0]);

  const podeAdicionar = nome.trim().length >= 2 && clientes.length < LIMITE;

  function onAdd() {
    if (!podeAdicionar) return;
    addCliente({ nome: nome.trim(), segmento, ativo: true });
    setNome("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seus clientes</CardTitle>
        <CardDescription>
          Cadastre até {LIMITE} clientes que você atende. Eles aparecerão nas tarefas dos agents
          em tempo real, dando autenticidade ao painel. ({clientes.length}/{LIMITE})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Nome do cliente (Ex: Loja do João)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
            maxLength={50}
            className="flex-1"
          />
          <select
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
          >
            {SEGMENTOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button onClick={onAdd} disabled={!podeAdicionar}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {clientes.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--fg-mute)]">
            Nenhum cliente cadastrado — o painel está usando nomes genéricos.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] rounded-md border border-[var(--border)]">
            {clientes.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--fg)]">
                    {c.nome}
                  </div>
                  <div className="text-xs text-[var(--fg-mute)]">{c.segmento}</div>
                </div>
                <button
                  onClick={() => removeCliente(c.id)}
                  className="rounded-md p-1.5 text-[var(--fg-mute)] hover:bg-[var(--surface-2)] hover:text-[var(--danger)]"
                  aria-label={`Remover ${c.nome}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
