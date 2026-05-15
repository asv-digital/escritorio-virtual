import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AparenciaForm } from "@/components/configurar/AparenciaForm";
import { BackupRestore } from "@/components/configurar/BackupRestore";
import { ClientesManager } from "@/components/configurar/ClientesManager";
import { EmpresaForm } from "@/components/configurar/EmpresaForm";

export default function Configurar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[var(--fg-dim)] transition-colors hover:text-[var(--fg)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>
          <div className="ml-auto font-mono text-xs text-[var(--fg-mute)]">
            Configurações
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--fg)]">
            Personalize seu Escritório Virtual
          </h1>
          <p className="mt-2 text-sm text-[var(--fg-dim)]">
            Quanto mais real ficar, mais útil vai ser. Tudo fica salvo só no seu navegador.
          </p>
        </div>
        <div className="space-y-5">
          <EmpresaForm />
          <ClientesManager />
          <AparenciaForm />
          <BackupRestore />
        </div>
      </main>
      <footer className="border-t border-[var(--border)] py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-mute)]">
        Bravy · ASV Digital · Escritório Virtual 24h
      </footer>
    </>
  );
}
