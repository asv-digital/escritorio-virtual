import { Header } from "@/components/layout/Header";
import { AgentGrid } from "@/components/painel/AgentGrid";
import { FeedAtividade } from "@/components/painel/FeedAtividade";
import { MetricasTopo } from "@/components/painel/MetricasTopo";
import { SimulatorBoot } from "@/components/painel/SimulatorBoot";

export default function Painel() {
  return (
    <>
      <SimulatorBoot />
      <Header />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6">
        <div className="mb-6">
          <MetricasTopo />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <section>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-mute)]">
              Agentes em operação
            </h2>
            <AgentGrid />
          </section>
          <FeedAtividade />
        </div>
      </main>
      <footer className="border-t border-[var(--border)] py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-mute)]">
        Bravy · ASV Digital · Escritório Virtual 24h
      </footer>
    </>
  );
}
