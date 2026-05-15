"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plus, Sparkles, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { getCatalog } from "@/lib/catalog/loader";
import { useConfig } from "@/lib/stores/config-store";

type Etapa = "welcome" | "empresa" | "clientes" | "finalizado";

export function OnboardingWizard() {
  const onboardingCompleto = useConfig((s) => s.onboarding_completo);
  const setOnboardingCompleto = useConfig((s) => s.setOnboardingCompleto);
  const empresa = useConfig((s) => s.empresa);
  const setEmpresa = useConfig((s) => s.setEmpresa);
  const clientes = useConfig((s) => s.clientes);
  const addCliente = useConfig((s) => s.addCliente);
  const removeCliente = useConfig((s) => s.removeCliente);

  const [hydrated, setHydrated] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("welcome");
  const [nome, setNome] = useState("");
  const [cliNome, setCliNome] = useState("");

  // Aguarda hidratar pra não abrir modal antes de ler LocalStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || onboardingCompleto) return null;

  const catalog = getCatalog();

  function avancar() {
    if (etapa === "welcome") setEtapa("empresa");
    else if (etapa === "empresa") {
      if (nome.trim()) setEmpresa({ nome: nome.trim() });
      setEtapa("clientes");
    } else if (etapa === "clientes") {
      setEtapa("finalizado");
    } else {
      setOnboardingCompleto(true);
    }
  }

  function pular() {
    setOnboardingCompleto(true);
  }

  function addClienteRapido() {
    if (cliNome.trim().length < 2) return;
    addCliente({ nome: cliNome.trim(), ativo: true });
    setCliNome("");
  }

  return (
    <Dialog open onClose={pular} closable={etapa === "welcome"} className="max-w-xl">
      <motion.div
        key={etapa}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="p-6"
      >
        {etapa === "welcome" && (
          <>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)]/10">
              <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-semibold">
              Bem-vindo ao {catalog.metadata.titulo_painel}
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-dim)]">
              {catalog.metadata.descricao}
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--fg-mute)]">
                  Em 60 segundos
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--fg-dim)]">
                  <li>① Cadastre o nome da sua empresa</li>
                  <li>② Adicione alguns clientes que você atende</li>
                  <li>③ Veja seus 57 agentes trabalhando 24h</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={pular}
                className="text-xs text-[var(--fg-mute)] hover:text-[var(--fg)]"
              >
                Pular configuração
              </button>
              <Button onClick={avancar}>
                Vamos lá <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {etapa === "empresa" && (
          <>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)]/10">
              <Users className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-semibold">Como se chama sua empresa?</h2>
            <p className="mt-2 text-sm text-[var(--fg-dim)]">
              Aparece no header do painel, dá um toque pessoal. Você pode mudar depois.
            </p>
            <div className="mt-6 space-y-1.5">
              <Label htmlFor="onb-empresa">Nome da empresa</Label>
              <Input
                id="onb-empresa"
                autoFocus
                placeholder="Ex: Contabilidade Silva & Associados"
                value={nome || empresa.nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && avancar()}
                maxLength={60}
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={pular} className="text-xs text-[var(--fg-mute)] hover:text-[var(--fg)]">
                Pular
              </button>
              <Button onClick={avancar}>
                Próximo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {etapa === "clientes" && (
          <>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)]/10">
              <Plus className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-semibold">Quem você atende?</h2>
            <p className="mt-2 text-sm text-[var(--fg-dim)]">
              Adicione 3-5 clientes. Eles vão aparecer nas tarefas dos agents — fica como se
              estivessem trabalhando pra sua carteira real. ({clientes.length}/20)
            </p>
            <div className="mt-5 flex gap-2">
              <Input
                autoFocus
                placeholder="Ex: Loja do João"
                value={cliNome}
                onChange={(e) => setCliNome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addClienteRapido()}
                maxLength={50}
              />
              <Button onClick={addClienteRapido} disabled={cliNome.trim().length < 2}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-3 max-h-44 space-y-1 overflow-y-auto">
              {clientes.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-md bg-[var(--surface-2)] px-3 py-1.5 text-sm"
                >
                  <span className="truncate">{c.nome}</span>
                  <button
                    onClick={() => removeCliente(c.id)}
                    className="text-[var(--fg-mute)] hover:text-[var(--danger)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={pular} className="text-xs text-[var(--fg-mute)] hover:text-[var(--fg)]">
                Pular (uso nomes genéricos)
              </button>
              <Button onClick={avancar} disabled={clientes.length === 0}>
                Quase lá <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {etapa === "finalizado" && (
          <>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--success)]/15">
              <Sparkles className="h-5 w-5 text-[var(--success)]" />
            </div>
            <h2 className="text-xl font-semibold">Tudo pronto, {empresa.nome.split(" ")[0] || "amigo"}!</h2>
            <p className="mt-2 text-sm text-[var(--fg-dim)]">
              Seus 57 agentes já começaram a trabalhar. Acompanhe no painel, e use{" "}
              <strong>Configurações</strong> sempre que quiser ajustar.
            </p>
            <div className="mt-6 flex justify-end">
              <Button onClick={avancar}>
                Abrir painel <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </Dialog>
  );
}
