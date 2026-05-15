# Operação — Escritório Virtual

## Adicionar / editar agent

1. Edite o JSON do nicho em `src/data/catalogs/<nicho>.json`
2. Cada agent precisa ter:
   - `id` (kebab-case, único)
   - `nome`, `categoria`, `icone` (Lucide), `cor` (hex)
   - `descricao` (10-200 char)
   - `tarefas_template` (mín. 3 frases com `{cliente}`)
   - `duracao_seg` `{min, media, max}`
   - `frequencia` (`alta` / `media` / `baixa`)
   - `horario_pico` `[h_inicio, h_fim]`
   - `economia_brl` (R$/execução)
3. Roda `pnpm typecheck` — schema Zod valida tudo
4. Roda `NICHO=<nicho> pnpm build` — confirma que builda

## Sincronizar catálogo com os repos `agents-*`

Cada nicho deve ter exatamente **57 agents**, mapeando 1:1 com os `agents/*.md` do repo correspondente (`asv-digital/agents-contadores`, etc).

Quando o repo do pacote ganhar agent novo:

```sh
# Sprint futuro: comando dedicado
pnpm catalog:sync --nicho contadores
```

(por enquanto manual via script Python em `/tmp/gen_catalog_<nicho>.py`)

## Release

```sh
# 1. Atualiza versão no package.json
# 2. Builda os 6 nichos
pnpm build:all

# 3. Empacota
pnpm zip:all

# 4. Cria release no GitHub
gh release create v0.X.0 releases/v0.X.0/*.zip \
  --title "Escritório Virtual v0.X.0" \
  --notes "..."
```

## Distribuição ao cliente

- Cliente compra pacote (ex: `agents-contadores`)
- Na área de membros do Hotmart/Kiwify, coloca link do release do nicho dele
- Cliente baixa `Escritorio-Virtual-Contadores.zip`
- Descompacta e abre `index.html`
- Funciona offline daí em diante

## Rotina de manutenção

| O que | Quando | Como |
|---|---|---|
| Atualizar agents (novos, removidos, renomeados) | quando o pacote `agents-*` mudar | editar JSON + rebuild + release |
| Adicionar nicho novo | conforme demanda | criar JSON + entrada no loader + build script + release |
| Corrigir bug | rapidamente | hotfix patch (v0.X.Y) + rebuild + release |
| Refresh visual | trimestral | revisar paletas, ícones, tipografia |

## Estrutura de versionamento

Semver:
- **MAJOR (1.x.x)** — quebra estrutura (catálogo, schema, layout)
- **MINOR (x.1.x)** — agents novos, features
- **PATCH (x.x.1)** — bug fix, ajustes

Cliente sempre baixa o zip mais recente do nicho dele. Não há update automático (é zip estático).
