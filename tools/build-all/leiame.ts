import { NICHO_TITULO, type Nicho } from "./nichos";

const POOLS: Record<Nicho, string[]> = {
  contadores: ["apuração de DAS", "fechamento mensal", "conciliação bancária", "folha", "SPED"],
  advogados: ["petição inicial", "contestação", "recurso", "audiência", "contrato"],
  engenheiros: ["cálculo estrutural", "projeto elétrico", "vistoria", "laudo", "ART"],
  arquitetos: ["estudo preliminar", "projeto executivo", "render", "detalhamento", "interiores"],
  marketing: ["criativo de anúncio", "copy de e-mail", "relatório semanal", "análise de campanha", "criação de funil"],
  funcionarios: ["tarefas de tráfego", "criativos", "follow-up de vendas", "relatório semanal", "processo operacional"],
};

export function gerarLeiame(nicho: Nicho, versao: string): string {
  const titulo = NICHO_TITULO[nicho];
  const exemplos = POOLS[nicho].slice(0, 3).join(", ");

  return `# ${titulo}

Bônus dos pacotes da **Bravy / ASV Digital**. Painel que mostra seus **57 agentes** trabalhando 24/7 — ${exemplos} e muito mais.

> Funciona **offline**. Sem servidor. Sem mensalidade. É seu pra sempre.

---

## Como abrir (60 segundos)

1. **Descompacte** este arquivo zip
2. **Dê dois cliques** em \`index.html\` — o painel abre no seu navegador padrão
3. Na primeira vez, configure rapidinho:
   - Nome da sua empresa
   - 3-5 clientes que você atende (vão aparecer nas tarefas dos agents)
4. Pronto. Seus agents começam a trabalhar.

## Instalar como app (recomendado)

Quando aparecer o botão **"Instalar como app"** (após uns 30s no painel), clique. Vira ícone na sua área de trabalho / tela inicial do celular. Abre sem navegador, **funciona offline**.

No Chrome/Edge desktop: ícone de instalação na barra de endereços.
No iPhone (Safari): botão *Compartilhar → Adicionar à Tela de Início*.
No Android (Chrome): menu \`⋮\` → *Instalar app*.

## Personalizar a qualquer momento

Clique em **Configurar** no canto superior direito:
- **Empresa** — nome + logo
- **Clientes** — até 20, com nome e segmento
- **Aparência** — tema
- **Backup** — exporte/importe suas configurações em JSON (útil pra mover de aparelho)

## Atualizações

Quando lançarmos novos agents (ou melhorarmos a simulação), você baixa o zip novo e substitui. Suas configurações ficam intactas (salvas no navegador).

Repositório: \`asv-digital/escritorio-virtual\` · Versão: ${versao}

---

**Suporte:** produtos@asv.digital
`;
}
