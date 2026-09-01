# Gerenciador de Boletos (mock PO-UI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold an Angular 21 + PO-UI app in this repo and ship a clickable Gerenciador de Boletos mock with the 13 titles and totals from the spec.

**Architecture:** Route `/` renders `BoletosPage`. The page owns filter/search/selection state, derives the visible grid and totals from pure functions, and passes slices to presentational children. Sidebar actions only fire `PoNotificationService.information('Mock: {ação}')`. No HTTP, no Protheus client.

**Tech Stack:** Angular 21, `@po-ui/ng-components` ^21, Vitest (`ng test`), TypeScript 5.9, npm.

## Global Constraints

- Repo root is `C:\Users\Beatriz\Documents\GitHub\automacao-financeira` — never write into `plug-forca-de-vendas`.
- Angular 21 + `@po-ui/ng-components` ^21.30; do not add `@totvs/protheus-lib-core` or REST clients.
- Theme: `./node_modules/@po-ui/style/css/po-theme-default.min.css`. Header text `TOTVS | Financeiro` is TOTVS red (`#c10015`); do not clone Central 4FIN logo or solid-red row selection.
- Single route `''` → `BoletosPage`. `App` template is only `<router-outlet />`.
- Mock data is the 13 titles in the spec (ids `t01`–`t13`). Initial selection is only `t13`.
- Totals use cent-rounding (`Math.round(n * 100)`) so `272,61` is exact. Display with `pt-BR` 2 decimal places.
- Filter Não Conciliados = `conciliado === false`. Totals card **Não Conciliado** = sum of visible rows with `status === 'baixado' && conciliado === false`.
- Sidebar click never mutates titles. **Sair** is a no-op.
- No mobile layout. No E2E.

## File map

Create (after scaffold):

- `src/app/app.ts` — router-outlet only
- `src/app/app.html` — `<router-outlet />`
- `src/app/app.config.ts` — router + HttpClient + `PoHttpRequestModule` (PO-UI needs it)
- `src/app/app.routes.ts` — `''` → `BoletosPage`
- `src/app/features/boletos/boletos.model.ts`
- `src/app/features/boletos/boletos.mock.ts`
- `src/app/features/boletos/boletos.mock.spec.ts`
- `src/app/features/boletos/boletos.logic.ts`
- `src/app/features/boletos/boletos.logic.spec.ts`
- `src/app/features/boletos/boletos.page.ts|html|css`
- `src/app/features/boletos/boletos.page.spec.ts`
- `src/app/features/boletos/components/app-header/app-header.ts|html|css`
- `src/app/features/boletos/components/action-sidebar/action-sidebar.ts|html|css`
- `src/app/features/boletos/components/quick-filters/quick-filters.ts|html|css`
- `src/app/features/boletos/components/titles-table/titles-table.ts|html|css`
- `src/app/features/boletos/components/totals-bar/totals-bar.ts|html|css`

Keep `docs/superpowers/specs/2026-09-01-automacao-financeira-mock-design.md` untouched.

---

### Task 1: Scaffold Angular 21 + PO-UI at repo root

**Files:**

- Create: Angular CLI tree (`package.json`, `angular.json`, `src/`, `tsconfig*.json`, `.gitignore`, …)
- Modify: `src/app/app.html`, `src/app/app.ts`, `src/app/app.config.ts` (later tasks replace routes; this task only gets a compiling app with PO-UI theme)
- Test: `npm test` (default App spec)

**Interfaces:**

- Consumes: existing git repo with spec/plan under `docs/`
- Produces: `ng serve` and `ng test` work; PO-UI CSS in `angular.json` styles

- [ ] **Step 1: Generate the Angular app beside `docs/` without clobbering git**

The folder already has `docs/` and `.git`. Generate into a temp dir, then move files up.

```powershell
cd C:\Users\Beatriz\Documents\GitHub\automacao-financeira
npx -y @angular/cli@21 new automacao-tmp --directory=tmp-ng --routing --style=css --ssr=false --skip-git --defaults --package-manager=npm
```

Expected: `tmp-ng/` contains `package.json`, `src/`, `angular.json`.

- [ ] **Step 2: Move scaffold to repo root**

```powershell
Get-ChildItem tmp-ng -Force | ForEach-Object {
  Move-Item $_.FullName -Destination . -Force
}
Remove-Item tmp-ng -Recurse -Force
```

If `README.md` already exists, keep the Angular one (overwrite). Do not delete `docs/`.

- [ ] **Step 3: Add PO-UI**

```powershell
npx ng add @po-ui/ng-components --skip-confirmation
```

Expected: `@po-ui/ng-components` in `package.json`; `angular.json` `styles` includes `./node_modules/@po-ui/style/css/po-theme-default.min.css`.

If `ng add` prompts for theme, choose default.

- [ ] **Step 4: Wire HttpClient like a standard PO-UI app**

Replace `src/app/app.config.ts` with:

```typescript
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { PoHttpRequestModule } from '@po-ui/ng-components';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom([PoHttpRequestModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
```

- [ ] **Step 5: Confirm tests pass**

Run: `npm test -- --watch=false`

Expected: PASS (generated App spec). If the spec looks for `Hello, automacao-tmp`, update the assertion to whatever `app.html` currently renders, or simplify `src/app/app.spec.ts` to:

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { App } from './app';

describe('App', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json src public .gitignore .editorconfig .vscode README.md
git commit -m "chore: scaffold Angular 21 with PO-UI"
```

Do not `git add` `node_modules/` or `.angular/`.

---

### Task 2: Model + 13-title mock

**Files:**

- Create: `src/app/features/boletos/boletos.model.ts`
- Create: `src/app/features/boletos/boletos.mock.ts`
- Test: `src/app/features/boletos/boletos.mock.spec.ts`

**Interfaces:**

- Consumes: nothing from Task 1 except the app compiles
- Produces: `TituloReceber`, `FiltrosRapidos`, `FILTROS_INICIAIS`, `AcaoSidebar`, `BoletosContexto`, `BoletosMock`, `BOLETOS_MOCK`

- [ ] **Step 1: Write the failing mock spec**

Create `src/app/features/boletos/boletos.mock.spec.ts`:

```typescript
import { describe, expect, it } from 'vitest';

import { BOLETOS_MOCK } from './boletos.mock';

function cents(n: number): number {
  return Math.round(n * 100);
}

describe('BOLETOS_MOCK', () => {
  it('has 13 titles that sum to 272.61 with t01 settled and t13 overdue', () => {
    const titulos = BOLETOS_MOCK.titulos;
    expect(titulos.map((t) => t.id)).toEqual([
      't01', 't02', 't03', 't04', 't05', 't06', 't07',
      't08', 't09', 't10', 't11', 't12', 't13',
    ]);
    expect(titulos.reduce((s, t) => s + cents(t.valor), 0)).toBe(27261);
    expect(titulos[0]).toMatchObject({
      numero: '1000',
      parcela: '01',
      status: 'baixado',
      conciliado: true,
      portador: '341',
      banco: 'itau',
    });
    expect(titulos[12]).toMatchObject({
      id: 't13',
      numero: '29032025',
      parcela: '06',
      valor: 1,
      atrasado: true,
      portador: '',
      banco: '',
    });
    expect(titulos.every((t) => t.nomeCliente === 'GUILHERME')).toBe(true);
    expect(BOLETOS_MOCK.actions).toHaveLength(20);
    expect(BOLETOS_MOCK.context.usuario).toBe('Administrador');
  });
});
```

- [ ] **Step 2: Run the spec and confirm it fails**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.mock.spec.ts`

Expected: FAIL — `Cannot find module './boletos.mock'` (or equivalent).

- [ ] **Step 3: Write model + mock**

`src/app/features/boletos/boletos.model.ts`:

```typescript
export type BancoCodigo = 'itau' | 'santander' | 'bb' | 'safra' | '';
export type TituloStatus = 'aberto' | 'parcBaixado' | 'baixado';

export interface TituloReceber {
  id: string;
  filial: string;
  prefixo: string;
  numero: string;
  parcela: string;
  tipo: string;
  natureza: string;
  portador: string;
  banco: BancoCodigo;
  cliente: string;
  loja: string;
  nomeCliente: string;
  emissao: string;
  vencimento: string;
  vencimentoReal: string;
  valor: number;
  irrf: number;
  status: TituloStatus;
  bordero: boolean;
  adiantamento: boolean;
  conciliado: boolean;
  alerta: boolean;
  atrasado: boolean;
}

export interface FiltrosRapidos {
  todos: boolean;
  aberto: boolean;
  parcBaixado: boolean;
  baixado: boolean;
  comBordero: boolean;
  semBordero: boolean;
  adiantamento: boolean;
  conciliado: boolean;
  naoConciliado: boolean;
  itau: boolean;
  santander: boolean;
  bb: boolean;
  safra: boolean;
}

export const FILTROS_INICIAIS: FiltrosRapidos = {
  todos: true,
  aberto: false,
  parcBaixado: false,
  baixado: false,
  comBordero: false,
  semBordero: false,
  adiantamento: false,
  conciliado: false,
  naoConciliado: false,
  itau: false,
  santander: false,
  bb: false,
  safra: false,
};

export interface AcaoSidebar {
  id: string;
  label: string;
}

export interface BoletosContexto {
  servidor: string;
  usuario: string;
  data: string;
  empresa: string;
}

export interface TotaisBoletos {
  contagem: number;
  total: number;
  aberto: number;
  baixado: number;
  conciliado: number;
  naoConciliado: number;
  marcado: number;
}

export interface BoletosMock {
  context: BoletosContexto;
  actions: AcaoSidebar[];
  titulos: TituloReceber[];
}
```

`src/app/features/boletos/boletos.mock.ts`:

```typescript
import { AcaoSidebar, BoletosMock, TituloReceber } from './boletos.model';

const COMUM = {
  filial: '0101',
  prefixo: 'TST',
  tipo: 'BOL',
  cliente: '000097',
  loja: '01',
  nomeCliente: 'GUILHERME',
  irrf: 0,
  bordero: false,
  adiantamento: false,
  alerta: false,
} as const;

function titulo(
  partial: Omit<TituloReceber, keyof typeof COMUM> & Partial<typeof COMUM>,
): TituloReceber {
  return { ...COMUM, atrasado: false, ...partial };
}

const ACTIONS: AcaoSidebar[] = [
  { id: 'filtro-central', label: 'Filtro Central' },
  { id: 'titulo', label: 'Título' },
  { id: 'gerar-boleto', label: 'Gerar Boleto' },
  { id: 'enviar-boleto', label: 'Enviar Boleto' },
  { id: 'cancelar-boleto', label: 'Cancelar Boleto' },
  { id: 'baixar-titulo', label: 'Baixar Título' },
  { id: 'cancela-baixa', label: 'Cancela Baixa' },
  { id: 'conciliar', label: 'Conciliar' },
  { id: 'estorno-concil', label: 'Estorno Concil' },
  { id: 'itau', label: 'Itaú' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'retorno-api', label: 'Retorno API' },
  { id: 'posicao-cliente', label: 'Posição Cliente' },
  { id: 'tit-aberto', label: 'Tít Aberto' },
  { id: 'tit-recebidos', label: 'Tít Recebidos' },
  { id: 'pedidos-em-aberto', label: 'Pedidos Em Aberto' },
  { id: 'faturamento', label: 'Faturamento' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'compensar-ncc-ra', label: 'Compensar NCC/RA' },
  { id: 'moedas', label: 'Moedas' },
];

export const BOLETOS_MOCK: BoletosMock = {
  context: {
    servidor: 'TOTVS Serviços MSSQL Apresentacao',
    usuario: 'Administrador',
    data: '29/03/2025',
    empresa: 'FAS SOLUTIONS CONSULTING / FAS SOLUTIONS TECNOLOGIA DA INFORMAÇÃO',
  },
  actions: ACTIONS,
  titulos: [
    titulo({
      id: 't01', numero: '1000', parcela: '01', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '16/02/2025',
      vencimento: '18/02/2025', vencimentoReal: '18/02/2025', valor: 0.1,
      status: 'baixado', conciliado: true,
    }),
    titulo({
      id: 't02', numero: '19022025', parcela: '', natureza: '20200010',
      portador: '', banco: '', emissao: '19/02/2025',
      vencimento: '26/02/2025', vencimentoReal: '26/02/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't03', numero: '2000', parcela: '', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '17/02/2025',
      vencimento: '20/02/2025', vencimentoReal: '20/02/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't04', numero: '20032025', parcela: '1', natureza: '20180011',
      portador: '341', banco: 'itau', emissao: '20/03/2025',
      vencimento: '03/04/2025', vencimentoReal: '03/04/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't05', numero: '20032025', parcela: '2', natureza: '20180012',
      portador: '', banco: '', emissao: '20/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't06', numero: '26022025', parcela: '', natureza: '20200010',
      portador: '', banco: '', emissao: '26/02/2025',
      vencimento: '05/03/2025', vencimentoReal: '05/03/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't07', numero: '26022025', parcela: '01', natureza: '20100012',
      portador: '', banco: '', emissao: '26/02/2025',
      vencimento: '12/03/2025', vencimentoReal: '12/03/2025', valor: 0.01,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't08', numero: '26022025', parcela: '01', natureza: '20100012',
      portador: '341', banco: 'itau', emissao: '26/02/2025',
      vencimento: '12/03/2025', vencimentoReal: '12/03/2025', valor: 10,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't09', numero: '29032025', parcela: '', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 10,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't10', numero: '29032025', parcela: '02', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 100,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't11', numero: '29032025', parcela: '03', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 150,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't12', numero: '29032025', parcela: '05', natureza: '20200011',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't13', numero: '29032025', parcela: '06', natureza: '20200010',
      portador: '', banco: '', emissao: '29/03/2025',
      vencimento: '18/04/2025', vencimentoReal: '18/04/2025', valor: 1,
      status: 'aberto', conciliado: false, atrasado: true,
    }),
  ],
};
```

- [ ] **Step 4: Run the spec and confirm it passes**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.mock.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/app/features/boletos/boletos.model.ts src/app/features/boletos/boletos.mock.ts src/app/features/boletos/boletos.mock.spec.ts
git commit -m "feat: add SE1 mock with 13 titles from the print"
```

---

### Task 3: Filter, search, and totals logic

**Files:**

- Create: `src/app/features/boletos/boletos.logic.ts`
- Test: `src/app/features/boletos/boletos.logic.spec.ts`

**Interfaces:**

- Consumes: `TituloReceber`, `FiltrosRapidos`, `FILTROS_INICIAIS`, `TotaisBoletos`, `BOLETOS_MOCK` from Task 2
- Produces:
  - `toCents(n: number): number`
  - `formatBrl(n: number): string`
  - `aplicarFiltroRapido(atual: FiltrosRapidos, chave: keyof FiltrosRapidos): FiltrosRapidos`
  - `temFiltroAplicado(filtros: FiltrosRapidos, busca: string): boolean`
  - `filtrarTitulos(titulos: TituloReceber[], filtros: FiltrosRapidos, busca: string): TituloReceber[]`
  - `calcularTotais(visiveis: TituloReceber[], selecionados: ReadonlySet<string>): TotaisBoletos`

- [ ] **Step 1: Write the failing logic spec**

Create `src/app/features/boletos/boletos.logic.spec.ts`:

```typescript
import { describe, expect, it } from 'vitest';

import {
  aplicarFiltroRapido,
  calcularTotais,
  filtrarTitulos,
  formatBrl,
  temFiltroAplicado,
} from './boletos.logic';
import { BOLETOS_MOCK } from './boletos.mock';
import { FILTROS_INICIAIS, FiltrosRapidos } from './boletos.model';

const titulos = BOLETOS_MOCK.titulos;

describe('boletos.logic', () => {
  it('formats money in pt-BR with 2 decimals', () => {
    expect(formatBrl(272.61)).toBe('272,61');
    expect(formatBrl(0.1)).toBe('0,10');
  });

  it('computes print totals with t13 selected', () => {
    const totais = calcularTotais(titulos, new Set(['t13']));
    expect(totais).toEqual({
      contagem: 13,
      total: 272.61,
      aberto: 272.51,
      baixado: 0.1,
      conciliado: 0.1,
      naoConciliado: 0,
      marcado: 1,
    });
  });

  it('filters Itaú to portador 341 only', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, todos: false, itau: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.portador === '341')).toBe(true);
    expect(visiveis.length).toBe(titulos.filter((t) => t.portador === '341').length);
  });

  it('turns on Itaú and turns off Todos', () => {
    const next = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    expect(next.todos).toBe(false);
    expect(next.itau).toBe(true);
  });

  it('restores Todos when the last specific filter is cleared', () => {
    const withItau = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    const next = aplicarFiltroRapido(withItau, 'itau');
    expect(next.todos).toBe(true);
    expect(next.itau).toBe(false);
  });

  it('ANDs status and bank groups', () => {
    const filtros: FiltrosRapidos = {
      ...FILTROS_INICIAIS,
      todos: false,
      aberto: true,
      itau: true,
    };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.status === 'aberto' && t.banco === 'itau')).toBe(true);
  });

  it('filters search by numero, nome, or prefixo', () => {
    const found = filtrarTitulos(titulos, FILTROS_INICIAIS, '1000');
    expect(found.map((t) => t.id)).toEqual(['t01']);
  });

  it('reports applied filters when Todos is off or search is set', () => {
    expect(temFiltroAplicado(FILTROS_INICIAIS, '')).toBe(false);
    expect(temFiltroAplicado({ ...FILTROS_INICIAIS, todos: false, itau: true }, '')).toBe(true);
    expect(temFiltroAplicado(FILTROS_INICIAIS, 'GUI')).toBe(true);
  });

  it('zeros marcado when selected row is not visible', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, todos: false, itau: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    const totais = calcularTotais(visiveis, new Set(['t13']));
    expect(totais.marcado).toBe(0);
  });
});
```

- [ ] **Step 2: Run the spec and confirm it fails**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.logic.spec.ts`

Expected: FAIL — `Cannot find module './boletos.logic'`.

- [ ] **Step 3: Implement logic**

`src/app/features/boletos/boletos.logic.ts`:

```typescript
import {
  FILTROS_INICIAIS,
  FiltrosRapidos,
  TituloReceber,
  TotaisBoletos,
} from './boletos.model';

const STATUS_KEYS = ['aberto', 'parcBaixado', 'baixado'] as const;
const BORDERO_KEYS = ['comBordero', 'semBordero'] as const;
const CONCIL_KEYS = ['conciliado', 'naoConciliado'] as const;
const BANCO_KEYS = ['itau', 'santander', 'bb', 'safra'] as const;
const SPECIFIC_KEYS = [
  ...STATUS_KEYS,
  ...BORDERO_KEYS,
  'adiantamento',
  ...CONCIL_KEYS,
  ...BANCO_KEYS,
] as const;

export function toCents(n: number): number {
  return Math.round(n * 100);
}

export function fromCents(c: number): number {
  return c / 100;
}

export function formatBrl(n: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function aplicarFiltroRapido(
  atual: FiltrosRapidos,
  chave: keyof FiltrosRapidos,
): FiltrosRapidos {
  if (chave === 'todos') {
    return { ...FILTROS_INICIAIS };
  }

  const next: FiltrosRapidos = { ...atual, [chave]: !atual[chave], todos: false };
  const anySpecific = SPECIFIC_KEYS.some((key) => next[key]);
  if (!anySpecific) {
    return { ...FILTROS_INICIAIS };
  }
  return next;
}

export function temFiltroAplicado(filtros: FiltrosRapidos, busca: string): boolean {
  return !filtros.todos || busca.trim().length > 0;
}

function matchesGroup<K extends keyof FiltrosRapidos>(
  filtros: FiltrosRapidos,
  keys: readonly K[],
  match: (key: K) => boolean,
): boolean {
  const active = keys.filter((key) => filtros[key]);
  if (active.length === 0) {
    return true;
  }
  return active.some(match);
}

export function filtrarTitulos(
  titulos: TituloReceber[],
  filtros: FiltrosRapidos,
  busca: string,
): TituloReceber[] {
  const q = busca.trim().toLowerCase();
  return titulos.filter((t) => {
    if (q) {
      const blob = `${t.numero} ${t.nomeCliente} ${t.prefixo}`.toLowerCase();
      if (!blob.includes(q)) {
        return false;
      }
    }
    if (filtros.todos) {
      return true;
    }
    const statusOk = matchesGroup(filtros, STATUS_KEYS, (key) => t.status === key);
    const borderoOk = matchesGroup(filtros, BORDERO_KEYS, (key) =>
      key === 'comBordero' ? t.bordero : !t.bordero,
    );
    const adiantOk = !filtros.adiantamento || t.adiantamento;
    const concilOk = matchesGroup(filtros, CONCIL_KEYS, (key) =>
      key === 'conciliado' ? t.conciliado : !t.conciliado,
    );
    const bancoOk = matchesGroup(filtros, BANCO_KEYS, (key) => t.banco === key);
    return statusOk && borderoOk && adiantOk && concilOk && bancoOk;
  });
}

export function calcularTotais(
  visiveis: TituloReceber[],
  selecionados: ReadonlySet<string>,
): TotaisBoletos {
  const sum = (pred: (t: TituloReceber) => boolean): number =>
    fromCents(visiveis.filter(pred).reduce((s, t) => s + toCents(t.valor), 0));

  return {
    contagem: visiveis.length,
    total: sum(() => true),
    aberto: sum((t) => t.status === 'aberto'),
    baixado: sum((t) => t.status === 'baixado'),
    conciliado: sum((t) => t.conciliado),
    naoConciliado: sum((t) => t.status === 'baixado' && !t.conciliado),
    marcado: sum((t) => selecionados.has(t.id)),
  };
}
```

- [ ] **Step 4: Run the spec and confirm it passes**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.logic.spec.ts`

Expected: PASS. If `totais.total` is `272.61` vs `272.6100000001`, the cent helpers must be used (they are). If Vitest fails on `{ baixado: 0.1 }` vs `0.10`, compare with `toBeCloseTo` only as a last resort — `fromCents(10)` is `0.1` and should match.

- [ ] **Step 5: Commit**

```powershell
git add src/app/features/boletos/boletos.logic.ts src/app/features/boletos/boletos.logic.spec.ts
git commit -m "feat: filter titles and compute boleto totals"
```

---

### Task 4: Page state, children, and route

**Files:**

- Create: all five component folders under `src/app/features/boletos/components/`
- Create: `src/app/features/boletos/boletos.page.ts|html|css`
- Modify: `src/app/app.routes.ts`, `src/app/app.html`, `src/app/app.ts`
- Test: `src/app/features/boletos/boletos.page.spec.ts`

**Interfaces:**

- Consumes: `BOLETOS_MOCK`, `FILTROS_INICIAIS`, logic functions from Task 3
- Produces: `BoletosPage` with `titulosVisiveis`, `totais`, `onToggleFiltro`, `onBusca`, `onLimparFiltros`, `onToggleSelecao`, `onAcao`, `onSair`

- [ ] **Step 1: Write the failing page spec (spec acceptance tests)**

Create `src/app/features/boletos/boletos.page.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { describe, expect, it, vi } from 'vitest';

import { BoletosPage } from './boletos.page';

describe('BoletosPage', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [BoletosPage],
      providers: [
        {
          provide: PoNotificationService,
          useValue: { information: vi.fn() },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(BoletosPage);
    fixture.detectChanges();
    return fixture;
  }

  it('renders GUILHERME and the print totals', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('GUILHERME');
    expect(text).toContain('13');
    expect(text).toContain('272,61');
    expect(text).toContain('1,00');
  });

  it('filters Itaú to portador 341 rows', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onToggleFiltro('itau');
    fixture.detectChanges();
    expect(page.titulosVisiveis.every((t) => t.portador === '341')).toBe(true);
    expect(page.titulosVisiveis.some((t) => t.id === 't13')).toBe(false);
  });

  it('updates marcado when only t08 is selected', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onLimparSelecao();
    page.onToggleSelecao('t08');
    fixture.detectChanges();
    expect(page.totais.marcado).toBe(10);
    expect(fixture.nativeElement.textContent).toContain('10,00');
  });
});
```

- [ ] **Step 2: Run the spec and confirm it fails**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.page.spec.ts`

Expected: FAIL — `Cannot find module './boletos.page'`.

- [ ] **Step 3: Implement presentational children**

`src/app/features/boletos/components/app-header/app-header.ts`:

```typescript
import { Component, input, output } from '@angular/core';

import { BoletosContexto } from '../../boletos.model';

@Component({
  selector: 'app-fin-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  readonly context = input.required<BoletosContexto>();
  readonly sair = output<void>();
}
```

`src/app/features/boletos/components/app-header/app-header.html`:

```html
<header class="fin-header">
  <div class="fin-header__brand">TOTVS <span class="fin-header__pipe">|</span> Financeiro</div>
  <div class="fin-header__meta">
    <span>{{ context().servidor }}</span>
    <span>{{ context().usuario }}</span>
    <span>{{ context().data }}</span>
    <span>{{ context().empresa }}</span>
    <button type="button" class="fin-header__sair" (click)="sair.emit()">Sair</button>
  </div>
</header>
```

`src/app/features/boletos/components/app-header/app-header.css`:

```css
.fin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.fin-header__brand {
  color: #c10015;
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
}
.fin-header__pipe { font-weight: 400; }
.fin-header__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  font-size: 12px;
  color: #334155;
}
.fin-header__sair {
  border: 1px solid #c10015;
  background: #fff;
  color: #c10015;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
}
```

`src/app/features/boletos/components/action-sidebar/action-sidebar.ts`:

```typescript
import { Component, input, output } from '@angular/core';
import { PoButtonModule } from '@po-ui/ng-components';

import { AcaoSidebar } from '../../boletos.model';

@Component({
  selector: 'app-action-sidebar',
  imports: [PoButtonModule],
  templateUrl: './action-sidebar.html',
  styleUrl: './action-sidebar.css',
})
export class ActionSidebar {
  readonly actions = input.required<AcaoSidebar[]>();
  readonly acao = output<AcaoSidebar>();
}
```

`src/app/features/boletos/components/action-sidebar/action-sidebar.html`:

```html
<aside class="actions">
  <div class="actions__logo">Automação Financeira</div>
  <p class="actions__caption">Ações</p>
  @for (action of actions(); track action.id) {
    <po-button
      [p-label]="action.label"
      p-kind="tertiary"
      [p-small]="true"
      (p-click)="acao.emit(action)"
    />
  }
</aside>
```

`src/app/features/boletos/components/action-sidebar/action-sidebar.css`:

```css
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  min-width: 220px;
  padding: 16px 12px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow: auto;
}
.actions__logo {
  font-weight: 700;
  font-size: 16px;
  color: #0c6dc7;
  padding: 8px 4px 12px;
}
.actions__caption {
  margin: 0 4px 4px;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
}
```

`src/app/features/boletos/components/quick-filters/quick-filters.ts`:

```typescript
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoFieldModule } from '@po-ui/ng-components';

import { FiltrosRapidos } from '../../boletos.model';

@Component({
  selector: 'app-quick-filters',
  imports: [FormsModule, PoFieldModule],
  templateUrl: './quick-filters.html',
  styleUrl: './quick-filters.css',
})
export class QuickFilters {
  readonly filtros = input.required<FiltrosRapidos>();
  readonly toggle = output<keyof FiltrosRapidos>();

  readonly options: { key: keyof FiltrosRapidos; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'aberto', label: 'Abertos' },
    { key: 'parcBaixado', label: 'Parc. Baixados' },
    { key: 'baixado', label: 'Baixados' },
    { key: 'comBordero', label: 'Com Borderô' },
    { key: 'semBordero', label: 'Sem Borderô' },
    { key: 'adiantamento', label: 'Adiantamento' },
    { key: 'conciliado', label: 'Conciliados' },
    { key: 'naoConciliado', label: 'Não Conciliados' },
    { key: 'itau', label: 'Itaú' },
    { key: 'santander', label: 'Santander' },
    { key: 'bb', label: 'Banco Brasil' },
    { key: 'safra', label: 'Safra' },
  ];
}
```

`src/app/features/boletos/components/quick-filters/quick-filters.html`:

```html
<section class="filters">
  <h2 class="filters__title">Filtros Rápidos</h2>
  <div class="filters__row">
    @for (opt of options; track opt.key) {
      <po-checkbox
        [p-label]="opt.label"
        [ngModel]="filtros()[opt.key]"
        (ngModelChange)="toggle.emit(opt.key)"
      />
    }
  </div>
</section>
```

`po-checkbox` needs `FormsModule` for `ngModel`. Add `FormsModule` to `imports` of `QuickFilters`.

`src/app/features/boletos/components/quick-filters/quick-filters.css`:

```css
.filters {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px 12px;
}
.filters__title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
}
.filters__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
}
```

`src/app/features/boletos/components/titles-table/titles-table.ts`:

```typescript
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoTableModule, PoTableColumn } from '@po-ui/ng-components';

import { TituloReceber } from '../../boletos.model';
import { formatBrl } from '../../boletos.logic';

@Component({
  selector: 'app-titles-table',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule],
  templateUrl: './titles-table.html',
  styleUrl: './titles-table.css',
})
export class TitlesTable {
  readonly items = input.required<TituloReceber[]>();
  readonly selecionados = input.required<ReadonlySet<string>>();
  readonly busca = input.required<string>();
  readonly filtrosAplicados = input.required<boolean>();
  readonly buscaChange = output<string>();
  readonly limparFiltros = output<void>();
  readonly toggleSelecao = output<string>();

  readonly formatBrl = formatBrl;

  readonly columns: PoTableColumn[] = [
    { property: 'atrasadoFlag', label: ' ', width: '24px' },
    { property: 'bancoLabel', label: 'Banco', width: '70px' },
    { property: 'statusLabel', label: 'Status', width: '80px' },
    { property: 'alertaLabel', label: 'Alerta', width: '70px' },
    { property: 'filial', label: 'Filial' },
    { property: 'prefixo', label: 'Prefixo' },
    { property: 'numero', label: 'Nº Título' },
    { property: 'parcela', label: 'Parcela' },
    { property: 'tipo', label: 'Tipo' },
    { property: 'natureza', label: 'Natureza' },
    { property: 'portador', label: 'Portador' },
    { property: 'cliente', label: 'Cliente' },
    { property: 'loja', label: 'Loja' },
    { property: 'nomeCliente', label: 'Nome Cliente' },
    { property: 'emissao', label: 'Dt Emissão' },
    { property: 'vencimento', label: 'Vencimento' },
    { property: 'vencimentoReal', label: 'Vencto Real' },
    { property: 'valorLabel', label: 'Vlr Título' },
    { property: 'irrfLabel', label: 'IRRF' },
  ];

  rows(): Array<TituloReceber & {
    atrasadoFlag: string;
    bancoLabel: string;
    statusLabel: string;
    alertaLabel: string;
    valorLabel: string;
    irrfLabel: string;
    $selected: boolean;
  }> {
    return this.items().map((t) => ({
      ...t,
      atrasadoFlag: t.atrasado ? '•' : '',
      bancoLabel: t.banco === 'itau' ? 'Itaú' : t.banco,
      statusLabel:
        t.status === 'aberto' ? 'Aberto' : t.status === 'baixado' ? 'Baixado' : 'Parc. Baixado',
      alertaLabel: t.alerta ? '!' : '',
      valorLabel: formatBrl(t.valor),
      irrfLabel: formatBrl(t.irrf),
      $selected: this.selecionados().has(t.id),
    }));
  }

  onSelect(row: TituloReceber): void {
    this.toggleSelecao.emit(row.id);
  }

  onUnselect(row: TituloReceber): void {
    this.toggleSelecao.emit(row.id);
  }
}
```

`src/app/features/boletos/components/titles-table/titles-table.html`:

```html
<section class="grid">
  <div class="grid__bar">
    <h2>Títulos a Receber</h2>
    <div class="grid__tools">
      @if (filtrosAplicados()) {
        <p class="grid__banner">
          Há filtros aplicados ao browse
          <button type="button" (click)="limparFiltros.emit()">Remover</button>
        </p>
      }
      <po-input
        name="busca"
        p-placeholder="Pesquisar"
        [ngModel]="busca()"
        (ngModelChange)="buscaChange.emit($event)"
      />
    </div>
  </div>
  <po-table
    [p-columns]="columns"
    [p-items]="rows()"
    [p-selectable]="true"
    [p-hide-columns-manager]="true"
    [p-striped]="true"
    (p-selected)="onSelect($event)"
    (p-unselected)="onUnselect($event)"
  >
    <ng-template p-table-column-template [p-property]="'atrasadoFlag'" let-row>
      <span [class.js-atrasado]="row.atrasado"></span>
    </ng-template>
  </po-table>
</section>
```

`src/app/features/boletos/components/titles-table/titles-table.css`:

```css
.grid { display: flex; flex-direction: column; gap: 8px; min-height: 0; }
.grid__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.grid h2 { margin: 0; font-size: 16px; }
.grid__tools { display: flex; align-items: center; gap: 12px; }
.grid__banner {
  margin: 0;
  font-size: 12px;
  color: #334155;
}
.grid__banner button {
  margin-left: 8px;
  border: 0;
  background: none;
  color: #0c6dc7;
  cursor: pointer;
  text-decoration: underline;
}
:host ::ng-deep po-table tbody tr:has(.js-atrasado) td {
  background-color: #fff4e5 !important;
}
```

Add `{ property: 'atrasadoFlag', label: ' ', width: '24px' }` as the first `PoTableColumn`. In `rows()` set `atrasadoFlag: t.atrasado ? '•' : ''`. Inside `<po-table>`:

```html
<ng-template p-table-column-template [p-property]="'atrasadoFlag'" let-row>
  <span [class.js-atrasado]="row.atrasado"></span>
</ng-template>
```

Overdue `t13` uses warning background `#fff4e5`, not 4FIN solid red. If `p-table-column-template` is missing in v21, set `color: (_value, row) => row.atrasado ? 'color-08' : ''` on the `numero` column instead.

`src/app/features/boletos/components/totals-bar/totals-bar.ts`:

```typescript
import { Component, input } from '@angular/core';

import { formatBrl } from '../../boletos.logic';
import { TotaisBoletos } from '../../boletos.model';

@Component({
  selector: 'app-totals-bar',
  templateUrl: './totals-bar.html',
  styleUrl: './totals-bar.css',
})
export class TotalsBar {
  readonly totais = input.required<TotaisBoletos>();
  readonly formatBrl = formatBrl;
}
```

`src/app/features/boletos/components/totals-bar/totals-bar.html`:

```html
<section class="totais">
  <h2>Totais</h2>
  <div class="totais__row">
    <article><span>Contagem</span><strong>{{ totais().contagem }}</strong></article>
    <article><span>Total R$</span><strong>{{ formatBrl(totais().total) }}</strong></article>
    <article><span>Total em Aberto R$</span><strong>{{ formatBrl(totais().aberto) }}</strong></article>
    <article><span>Total Baixado R$</span><strong>{{ formatBrl(totais().baixado) }}</strong></article>
    <article><span>Total Conciliado R$</span><strong>{{ formatBrl(totais().conciliado) }}</strong></article>
    <article><span>Total Não Conciliado R$</span><strong>{{ formatBrl(totais().naoConciliado) }}</strong></article>
    <article><span>Total Marcado R$</span><strong>{{ formatBrl(totais().marcado) }}</strong></article>
  </div>
</section>
```

`src/app/features/boletos/components/totals-bar/totals-bar.css`:

```css
.totais {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px 12px;
}
.totais h2 { margin: 0 0 8px; font-size: 14px; }
.totais__row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}
.totais article {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.totais span { font-size: 12px; color: #64748b; }
.totais strong { font-size: 16px; }
```

- [ ] **Step 4: Implement BoletosPage and route**

`src/app/features/boletos/boletos.page.ts`:

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';

import { ActionSidebar } from './components/action-sidebar/action-sidebar';
import { AppHeader } from './components/app-header/app-header';
import { QuickFilters } from './components/quick-filters/quick-filters';
import { TitlesTable } from './components/titles-table/titles-table';
import { TotalsBar } from './components/totals-bar/totals-bar';
import {
  aplicarFiltroRapido,
  calcularTotais,
  filtrarTitulos,
  temFiltroAplicado,
} from './boletos.logic';
import { BOLETOS_MOCK } from './boletos.mock';
import { AcaoSidebar, FILTROS_INICIAIS, FiltrosRapidos } from './boletos.model';

@Component({
  selector: 'app-boletos-page',
  imports: [AppHeader, ActionSidebar, QuickFilters, TitlesTable, TotalsBar],
  templateUrl: './boletos.page.html',
  styleUrl: './boletos.page.css',
})
export class BoletosPage {
  private readonly notify = inject(PoNotificationService);

  readonly mock = BOLETOS_MOCK;
  readonly titulos = BOLETOS_MOCK.titulos;
  readonly filtros = signal<FiltrosRapidos>({ ...FILTROS_INICIAIS });
  readonly busca = signal('');
  readonly selecionados = signal<Set<string>>(new Set(['t13']));

  readonly titulosVisiveis = computed(() =>
    filtrarTitulos(this.titulos, this.filtros(), this.busca()),
  );

  readonly totais = computed(() =>
    calcularTotais(this.titulosVisiveis(), this.selecionados()),
  );

  readonly filtrosAplicados = computed(() =>
    temFiltroAplicado(this.filtros(), this.busca()),
  );

  onToggleFiltro(chave: keyof FiltrosRapidos): void {
    this.filtros.set(aplicarFiltroRapido(this.filtros(), chave));
  }

  onBusca(value: string): void {
    this.busca.set(value);
  }

  onLimparFiltros(): void {
    this.filtros.set({ ...FILTROS_INICIAIS });
    this.busca.set('');
  }

  onToggleSelecao(id: string): void {
    const next = new Set(this.selecionados());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selecionados.set(next);
  }

  onLimparSelecao(): void {
    this.selecionados.set(new Set());
  }

  onAcao(action: AcaoSidebar): void {
    this.notify.information(`Mock: ${action.label}`);
  }

  onSair(): void {
    return;
  }
}
```

`src/app/features/boletos/boletos.page.html`:

```html
<div class="shell">
  <app-fin-header [context]="mock.context" (sair)="onSair()" />
  <div class="shell__body">
    <app-action-sidebar [actions]="mock.actions" (acao)="onAcao($event)" />
    <main class="shell__main">
      <h1 class="shell__title">Gerenciador de Boletos</h1>
      <app-quick-filters [filtros]="filtros()" (toggle)="onToggleFiltro($event)" />
      <app-titles-table
        [items]="titulosVisiveis()"
        [selecionados]="selecionados()"
        [busca]="busca()"
        [filtrosAplicados]="filtrosAplicados()"
        (buscaChange)="onBusca($event)"
        (limparFiltros)="onLimparFiltros()"
        (toggleSelecao)="onToggleSelecao($event)"
      />
      <app-totals-bar [totais]="totais()" />
    </main>
  </div>
</div>
```

`src/app/features/boletos/boletos.page.css`:

```css
:host { display: block; height: 100vh; }
.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f3f4f6;
  color: #1a1f36;
  font-family: 'Nunito Sans', 'Segoe UI', sans-serif;
}
.shell__body { display: flex; flex: 1; min-height: 0; }
.shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px;
  min-width: 0;
}
.shell__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
app-titles-table { flex: 1; min-height: 0; overflow: auto; }
```

`src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

import { BoletosPage } from './features/boletos/boletos.page';

export const routes: Routes = [{ path: '', component: BoletosPage }];
```

`src/app/app.html`:

```html
<router-outlet />
```

`src/app/app.ts` must import `RouterOutlet` (already true after `ng new --routing`).

`src/styles.css` — keep global:

```css
html, body { height: 100%; margin: 0; }
```

- [ ] **Step 5: Fix QuickFilters FormsModule and checkbox wiring**

`quick-filters.ts` `imports` must be `[FormsModule, PoFieldModule]`.

`po-checkbox` with `[ngModel]` + `(ngModelChange)` that always emits the key (the page toggles) is correct even if `ngModelChange` fires the new boolean — `aplicarFiltroRapido` ignores the incoming boolean and toggles from current state. If PO-UI checkbox emits twice, debounce is not required; if tests flap, change the template to `(p-change)="toggle.emit(opt.key)"` and drop ngModelChange.

- [ ] **Step 6: Run page spec**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.page.spec.ts`

Expected: PASS (GUILHERME, `272,61`, `1,00`, Itaú filter, t08 marcado `10,00`).

If `PoNotificationService` is `providedIn: 'root'` and the mock provider is ignored, still pass as long as no dialog blocks. If compile fails on `po-checkbox` ngModel, switch to `(p-change)`.

If `10,00` appears twice (t08 valor and marcado), the assertion `toContain('10,00')` is still valid.

- [ ] **Step 7: Run the full unit suite**

Run: `npm test -- --watch=false`

Expected: PASS (App spec + mock + logic + page). Update `app.spec.ts` if it still expects the CLI starter heading.

- [ ] **Step 8: Commit**

```powershell
git add src/app src/styles.css
git commit -m "feat: render Gerenciador de Boletos mock with PO-UI"
```

---

### Task 5: Visual pass and `ng serve` check

**Files:**

- Modify: component CSS listed in Task 4 if the first paint is cramped or the table does not fill the main pane
- Test: `npm test -- --watch=false` still PASS; manual `ng serve`

**Interfaces:**

- Consumes: Task 4 UI
- Produces: desktop layout matching spec hierarchy: header, sidebar, filtros, grid, totais

- [ ] **Step 1: Serve the app**

Run: `npx ng serve --open`

Expected: `http://localhost:4200/` shows **TOTVS | Financeiro**, sidebar **Automação Financeira**, **Gerenciador de Boletos**, 13 rows, GUILHERME, totals Contagem 13 / Total 272,61 / Marcado 1,00.

- [ ] **Step 2: Exercise the mock**

Click **Itaú** — grid shrinks to portador 341; banner **Há filtros aplicados ao browse** appears; **Remover** restores 13 rows. Click **Gerar Boleto** — notification `Mock: Gerar Boleto`. Uncheck t13, check the `10,00` row — Total Marcado `10,00`. t13 row uses warning background, not solid red.

- [ ] **Step 3: Tighten CSS only if Step 2 fails visually**

Allowed tweaks: sidebar scroll, table `flex: 1`, totals 7 columns wrapping under 1280px is OK. Do not introduce 4FIN orange buttons or logo.

- [ ] **Step 4: Re-run tests**

Run: `npm test -- --watch=false`

Expected: PASS.

- [ ] **Step 5: Commit only if CSS changed**

```powershell
git add src/app/features/boletos
git commit -m "style: fit boletos mock to desktop TOTVS layout"
```

Skip this commit if Step 3 made no file changes.

---

## Spec coverage

| Spec section | Task |
|---|---|
| Isolated repo, Angular + PO-UI | 1 |
| 13 identical titles, flags t01/t13 | 2 |
| Filtros (Todos exclusive, OR/AND, busca, Remover) | 3, 4 |
| Totais formulas + pt-BR | 3, 4 |
| Sidebar 20 actions, Mock toast | 4 |
| Header chrome + Sair no-op | 4 |
| po-table columns + selection + overdue warning | 4, 5 |
| Page tests (GUILHERME, totals, Itaú, t08) | 4 |
| No API / no 4FIN clone / no mobile / no E2E | Global + 5 |

## Notes for the implementer

- `po-table` selection: page state is source of truth. If PO-UI also toggles `$selected` internally, `onSelect`/`onUnselect` still call `onToggleSelecao` once per event — do not also bind `(p-all-selected)` unless you implement it as select-all on **visible** ids.
- `QuickFilters` must import `FormsModule` for `ngModel`.
- Initial `selecionados` is `new Set(['t13'])`. Do not persist to `localStorage`.
- Package name in `package.json` should be `automacao-financeira` after the move from `tmp-ng` (edit `"name"` if CLI left `automacao-tmp`).
