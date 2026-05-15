# Escritório Virtual 24h

Painel visual de simulação 24/7 dos 57 agentes Bravy — **bônus dos pacotes de skills/agents da ASV Digital**.

> 57 funcionários sem CLT trabalhando na palma da sua mão. Personalizado com o nome da sua empresa e dos seus clientes. Funciona offline. Sem servidor.

## Distribuição

Produto entregue como **ZIP standalone por nicho** — cliente baixa, descompacta, abre `index.html` no navegador, funciona offline (PWA).

| Nicho | Repo do pacote | Status |
|---|---|---|
| Contadores | `asv-digital/agents-contadores` | ✅ Sprint 1 (MVP) |
| Advogados | `asv-digital/agents-advogados` | 🕒 Sprint 5 |
| Engenheiros | `asv-digital/agents-engenheiros` | 🕒 Sprint 5 |
| Arquitetos | `asv-digital/agents-arquitetos` | 🕒 Sprint 5 |
| Marketing | `asv-digital/agents-agencia-marketing` | 🕒 Sprint 5 |
| Funcionários | `asv-digital/agents-funcionarios` | 🕒 Sprint 5 |

## Stack

- **Next.js 16** + `output: 'export'` (HTML estático puro)
- **React 19** + Tailwind 4 + shadcn
- **Zustand** (state) + **Framer Motion** (animação)
- **Zod** (validação de catálogo)
- **IndexedDB** (histórico) + **LocalStorage** (config)
- **Service Worker** (offline-first, Sprint 4)

## Estrutura

```
src/
├── app/                  # Next App Router (1 página)
├── components/
│   ├── layout/           # Header, Shell
│   └── painel/           # AgentCard, AgentGrid, MetricasTopo, FeedAtividade, SimulatorBoot
├── data/catalogs/        # 6 JSONs (1 por nicho) — fonte de verdade
└── lib/
    ├── catalog/          # schema Zod + loader + types
    ├── simulator/        # engine (tick, FSM, distribuição)
    ├── stores/           # Zustand (config + simulator)
    └── utils.ts
```

## Como rodar

```sh
pnpm install
pnpm dev                    # http://localhost:3030 (default = contadores)
NICHO=contadores pnpm dev   # explícito
```

## Como buildar

```sh
pnpm build:contadores       # gera out/contadores/
pnpm build:all              # builda os 6 nichos (Sprint 5+)
pnpm zip:all                # empacota os 6 zips em releases/
pnpm release                # cria GitHub release v<X.Y.Z>
```

## Operação

Detalhes em [`OPERACAO.md`](./OPERACAO.md): como atualizar catálogo, adicionar agent, fazer release.

## Licença

Proprietary — Bravy / ASV Digital.
