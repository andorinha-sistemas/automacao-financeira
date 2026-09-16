# Ficha Contas a Pagar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Incluir, Alterar e Visualizar no browse FINA050 abrem a ficha de Contas a Pagar (Dados Gerais) no padrão da ficha de Bancos, com gravação em memória.

**Architecture:** `BoletosPage` passa a guardar `titulosPagar` em signal e `telaAtiva` `titulos-pagar` | `titulos-pagar-form`. `TitulosPagarPage` renderiza browse ou ficha (`tela` + `modoFicha` + `rascunho`). Regras em `titulos-pagar.logic.ts`. Sem rota nova.

**Tech Stack:** Angular 21, PO-UI 21, Vitest, inputs nativos em `table.ficha`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-08-titulos-pagar-ficha-design.md`
- Inputs nativos na ficha (não `po-input`); 5 colunas
- Só Dados Gerais preenchida; outras abas vazias e clicáveis
- Sem API; recarregar restaura o mock
- Não commitar a menos que Beatriz peça
- Testes: `npx ng test --watch=false --include=<arquivo>`
- Verificar UI em `http://127.0.0.1:4200/`

## File map

- Modify: `src/app/features/boletos/boletos.model.ts` — campos extras + `TelaAtiva`
- Modify: `src/app/features/boletos/boletos.mock.ts` — preencher novos campos
- Modify: `src/app/features/boletos/titulos-pagar.logic.ts` / `.spec.ts`
- Modify: `src/app/features/boletos/components/titulos-pagar-page/*`
- Modify: `src/app/features/boletos/boletos.page.ts` / `.html` / `.spec.ts`

---

### Task 1: Modelo, mock e lógica pura

**Files:**
- Modify: `src/app/features/boletos/boletos.model.ts`
- Modify: `src/app/features/boletos/boletos.mock.ts`
- Modify: `src/app/features/boletos/titulos-pagar.logic.ts`
- Test: `src/app/features/boletos/titulos-pagar.logic.spec.ts`

**Produces:** `tituloPagarVazio()`, `validarGravacaoTituloPagar()`, `incluirTituloPagar()`, `alterarTituloPagar()`, `chaveTituloPagar()`

- [ ] **Step 1: Write failing tests** in `titulos-pagar.logic.spec.ts` for empty title defaults, required validation, duplicate key, include and update.
- [ ] **Step 2: Run tests — expect FAIL** (`tituloPagarVazio` not exported).
- [ ] **Step 3: Extend `TituloPagar`, mock rows, and logic functions.**
- [ ] **Step 4: Run tests — expect PASS.**

Não commitar.

---

### Task 2: Ficha no componente

**Files:**
- Modify: `titulos-pagar-page.ts` / `.html` / `.css` / `.spec.ts`

**Consumes:** logic + `tela` `titulos-pagar` | `titulos-pagar-form`, `modoFicha`, `rascunho`

- [ ] **Step 1: Failing tests** — Incluir ficha 5 cols native fields; other tabs empty; Visualizar hides Salvar and disables inputs.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Render ficha matching spec (Dados Gerais + lookups toast).**
- [ ] **Step 4: Run — expect PASS.**

Não commitar.

---

### Task 3: Ligar no BoletosPage

**Files:**
- Modify: `boletos.page.ts` / `.html` / `.spec.ts`

- [ ] **Step 1: Failing tests** — Incluir válido adiciona linha; Cancelar não adiciona; Alterar atualiza; sidebar Títulos com ficha aberta volta ao browse.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Signal da lista, `titulos-pagar-form`, gravar/cancelar.**
- [ ] **Step 4: Run page + pagar specs — expect PASS.**
- [ ] **Step 5: Verificar no browser** Incluir / Alterar / Visualizar / Cancelar / Salvar / abas vazias.

Não commitar.
