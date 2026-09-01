# Automação Financeira — mock Gerenciador de Boletos (PO-UI)

Data: 2026-09-01  
Repo: `C:\Users\Beatriz\Documents\GitHub\automacao-financeira`  
App: Angular 21 + PO-UI (protheusweb)  
Referência visual: print Central 4FIN — Gerenciador de Boletos (layout e dados; identidade TOTVS, não clone da 4FIN)

## Objetivo

Projeto **novo e isolado** do `plug-forca-de-vendas`. Mock clicável da tela **Gerenciador de Boletos** (títulos a receber / SE1) para a Automação Financeira Integrada ao TOTVS Protheus. Dados mockados. Sem API, sem autenticação, sem geração real de boleto.

## Fora de escopo

- Integração Protheus / REST / dicionário SX / AppServer
- Autenticação e botão Sair funcional (no-op)
- Fluxos reais das ações da sidebar (apenas dialog/toast)
- Layout mobile
- Outras rotas além de `/`
- Clone visual da Central 4FIN (logo, cores de seleção vermelho chapado, chrome proprietário)

## Arquitetura

A rota `/` renderiza só o gerenciador. `App` expõe `router-outlet`. Casca do módulo financeiro é da própria page (não o starter `po-menu` + `po-toolbar` globais).

```
src/app/
  app.ts                 # router-outlet
  app.html
  app.routes.ts          # path: '' → BoletosPage
  features/boletos/
    boletos.page.ts
    boletos.page.html
    boletos.page.css
    boletos.mock.ts
    boletos.model.ts
    boletos.page.spec.ts
    components/
      app-header/
      action-sidebar/
      quick-filters/
      titles-table/
      totals-bar/
```

Componentes são presentacionais: recebem fatias do estado e emitem eventos. A page aplica filtro, busca, seleção e totais. Nenhum serviço HTTP.

## Identidade e chrome

- Produto (logo da sidebar): **Automação Financeira**
- Header esquerda: **TOTVS | Financeiro** (vermelho TOTVS padrão)
- Título da página: **Gerenciador de Boletos**
- Header direita (constantes do mock):
  - Servidor: `TOTVS Serviços MSSQL Apresentacao`
  - Usuário: `Administrador`
  - Data: `29/03/2025`
  - Empresa: `FAS SOLUTIONS CONSULTING / FAS SOLUTIONS TECNOLOGIA DA INFORMAÇÃO`
  - Botão **Sair**: no-op
- Visual: tema default PO-UI / TOTVS. Sidebar de ações com botões PO-UI (`po-button`), não a paleta/logo da 4FIN.
- Linha em destaque: classe semântica PO-UI (warning/danger row), não vermelho sólido da 4FIN.

## Ações da sidebar (ordem)

Filtro Central, Título, Gerar Boleto, Enviar Boleto, Cancelar Boleto, Baixar Título, Cancela Baixa, Conciliar, Estorno Concil, Itaú, Cliente, Retorno API, Posição Cliente, Tít Aberto, Tít Recebidos, Pedidos Em Aberto, Faturamento, Natureza, Compensar NCC/RA, Moedas.

Clique abre `PoDialog` ou `PoNotification` com o texto `Mock: {ação}`. Nenhum título muda.

## Filtros rápidos

Checkboxes, da esquerda para a direita: Todos (padrão ligado), Abertos, Parc. Baixados, Baixados, Com Borderô, Sem Borderô, Adiantamento, Conciliados, Não Conciliados, Itaú, Santander, Banco Brasil, Safra.

Regras:

- Ligar **Todos** desmarca os demais e mostra o mock inteiro.
- Ligar qualquer outro desmarca **Todos**.
- Vários filtros do mesmo grupo combinam com OR (ex.: Itaú + Santander).
- Grupos diferentes combinam com AND (ex.: Abertos AND Itaú).
- Grupos: status (`aberto` | `parcBaixado` | `baixado`); borderô (`com` | `sem`); adiantamento; conciliação (`conciliado` | `naoConciliado`); banco (`itau` | `santander` | `bb` | `safra`).
- Banner no grid: `Há filtros aplicados ao browse` + **Remover**. **Remover** zera busca e filtros e religa **Todos**.
- Busca do `po-table` filtra por número, nome do cliente e prefixo (contém, case-insensitive).

## Modelo de dados

Um objeto `BoletosMock` em `boletos.mock.ts`.

### Título (`TituloReceber`)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` | estável, único (`t01`…`t13`) |
| `filial` | `string` | |
| `prefixo` | `string` | |
| `numero` | `string` | |
| `parcela` | `string` | vazio permitido |
| `tipo` | `string` | sempre `BOL` |
| `natureza` | `string` | |
| `portador` | `string` | vazio ou `341` |
| `banco` | `'itau' \| 'santander' \| 'bb' \| 'safra' \| ''` | `341` → `itau`; vazio → `''` |
| `cliente` | `string` | |
| `loja` | `string` | |
| `nomeCliente` | `string` | |
| `emissao` | `string` | `dd/mm/aaaa` |
| `vencimento` | `string` | |
| `vencimentoReal` | `string` | |
| `valor` | `number` | reais, duas casas |
| `irrf` | `number` | sempre `0` |
| `status` | `'aberto' \| 'parcBaixado' \| 'baixado'` | |
| `bordero` | `boolean` | |
| `adiantamento` | `boolean` | |
| `conciliado` | `boolean` | |
| `alerta` | `boolean` | ícone de aviso na linha |
| `atrasado` | `boolean` | linha em destaque |

### Contexto e ações

- `context`: servidor, usuário, data, empresa
- `actions`: array `{ id, label }` na ordem da sidebar

## Os 13 títulos (obrigatório, idênticos ao print)

Comum a todos: Filial `0101`, Prefixo `TST`, Tipo `BOL`, Cliente `000097`, Loja `01`, Nome `GUILHERME`, IRRF `0`. Sem borderô, sem adiantamento, sem alerta, salvo onde indicado.

| id | Nº Título | Parcela | Natureza | Portador | Emissão | Vencimento | Vencto real | Vlr | Flags extras |
|---|---|---|---|---|---|---|---|---|
| t01 | 1000 | 01 | 20200010 | 341 | 16/02/2025 | 18/02/2025 | 18/02/2025 | 0,10 | `status=baixado`, `conciliado=true` |
| t02 | 19022025 | _(vazio)_ | 20200010 | _(vazio)_ | 19/02/2025 | 26/02/2025 | 26/02/2025 | 0,10 | aberto |
| t03 | 2000 | _(vazio)_ | 20200010 | 341 | 17/02/2025 | 20/02/2025 | 20/02/2025 | 0,10 | aberto |
| t04 | 20032025 | 1 | 20180011 | 341 | 20/03/2025 | 03/04/2025 | 03/04/2025 | 0,10 | aberto |
| t05 | 20032025 | 2 | 20180012 | _(vazio)_ | 20/03/2025 | 10/04/2025 | 10/04/2025 | 0,10 | aberto |
| t06 | 26022025 | _(vazio)_ | 20200010 | _(vazio)_ | 26/02/2025 | 05/03/2025 | 05/03/2025 | 0,10 | aberto |
| t07 | 26022025 | 01 | 20100012 | _(vazio)_ | 26/02/2025 | 12/03/2025 | 12/03/2025 | 0,01 | aberto |
| t08 | 26022025 | 01 | 20100012 | 341 | 26/02/2025 | 12/03/2025 | 12/03/2025 | 10,00 | aberto |
| t09 | 29032025 | _(vazio)_ | 20200010 | 341 | 29/03/2025 | 10/04/2025 | 10/04/2025 | 10,00 | aberto |
| t10 | 29032025 | 02 | 20200010 | 341 | 29/03/2025 | 10/04/2025 | 10/04/2025 | 100,00 | aberto |
| t11 | 29032025 | 03 | 20200010 | 341 | 29/03/2025 | 10/04/2025 | 10/04/2025 | 150,00 | aberto |
| t12 | 29032025 | 05 | 20200011 | 341 | 29/03/2025 | 10/04/2025 | 10/04/2025 | 1,00 | aberto |
| t13 | 29032025 | 06 | 20200010 | _(vazio)_ | 29/03/2025 | 18/04/2025 | 18/04/2025 | 1,00 | aberto, `atrasado=true`, selecionado no estado inicial |

Estado inicial da seleção: somente `t13`. Banco: portador `341` → `itau`; portador vazio → `''`.

Colunas visíveis do grid, nesta ordem: checkbox, banco (ícone/texto Itaú quando `341`), status, alerta, Filial, Prefixo, Nº Título, Parcela, Tipo, Natureza, Portador, Cliente, Loja, Nome Cliente, Dt Emissão, Vencimento, Vencto Real, Vlr Título, IRRF.

## Totais

Sempre sobre o conjunto **visível** (filtro + busca), exceto **Marcado**, que soma `valor` das linhas selecionadas que ainda estão visíveis.

| Card | Estado inicial (Todos, sem busca) |
|---|---|
| Contagem | 13 |
| Total R$ | 272,61 |
| Total em Aberto R$ | 272,51 |
| Total Baixado R$ | 0,10 |
| Total Conciliado R$ | 0,10 |
| Total Não Conciliado R$ | 0,00 |
| Total Marcado R$ | 1,00 |

Regra de **Não Conciliado** neste mock: soma `valor` dos visíveis com `status === 'baixado'` e `conciliado === false`. No estado inicial isso é `0,00` (só `t01` está baixado e ele está conciliado). Aberto e demais não entram nesse card — replica o print.

**Aberto** = soma `status === 'aberto'`. **Baixado** = soma `status === 'baixado'` (parc. baixado não entra neste card). **Conciliado** = soma `conciliado === true`.

Valores em `pt-BR` (`0,10`, `272,61`).

## Fluxo de dados

`boletos.mock.ts` exporta `BOLETOS_MOCK` (títulos + context + actions). `BoletosPage` guarda:

- `titulos` — cópia readonly do mock
- `filtros` — flags dos checkboxes
- `busca` — string
- `selecionados` — `Set<string>` de ids (inicia com `t13`)

Grid e totais são derivados. Sem signals de servidor, sem `loading` / `error`. Refresh do browser volta ao mock inicial (incluindo `t13` marcado).

## Tratamento de erro

Não há I/O. Filtro que zera o grid: empty state do `po-table`; totais zerados; Marcado `0,00` se a seleção sair do visível. Sem tela de erro.

## Teste

Um spec Vitest de `BoletosPage`:

- renderiza `GUILHERME`
- Contagem `13` e Total R$ `272,61`
- Total Marcado `1,00` no estado inicial
- filtrar **Itaú** deixa só linhas com portador `341`
- desmarcar todas as linhas e marcar só `t08` → Total Marcado `10,00`

Sem E2E.

## Critério de aceite

Alguém colocando o print ao lado de `ng serve` no repo `automacao-financeira` reconhece a mesma hierarquia (header, sidebar, filtros rápidos, grid, totais), os mesmos 13 títulos e os mesmos totais iniciais. Visual PO-UI/TOTVS; diferenças de pixel, logo e cor de seleção são esperadas. Conteúdo e estrutura não divergem.
