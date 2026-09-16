# Cadastro de Bancos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ao clicar em Cadastrar banco, a área principal do mock troca para um cadastro SA6 (browse + ficha) no visual atual, e o mesmo bundle funciona no Protheus Web via `FwCallApp`.

**Architecture:** `BoletosPage` guarda `telaAtiva` (`boletos` | `bancos-browse` | `bancos-form`) e a lista de bancos em signals. Um componente `BancosPage` renderiza browse ou ficha. Regras de filtro, validação e CRUD em memória ficam em funções puras em `bancos.logic.ts`. Sem rota Angular nova. `U_AFINBOL` continua só com `FwCallApp("automacao-financeira")`.

**Tech Stack:** Angular 21, PO-UI 21 (`po-table`, `po-input`, `po-button`, `PoNotificationService`, `PoDialogService`), Vitest, empacote `npm run package:protheus`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-08-cadastro-bancos-design.md`
- Visual navy/PO-UI atual; não copiar SmartClient
- Sem rota `/bancos`; sem API; sem SA6 real
- Recarregar a página restaura o mock inicial de 6 bancos
- Outros itens do menu (exceto `cadastra-banco`) voltam ao Gerenciador e mostram toast `Mock: {label}`
- Não editar `plug-forca-de-vendas` nem `servers.json`
- Não fazer `git commit` a menos que Beatriz peça na conversa de implementação
- Testes: `npx ng test --watch=false --include=<arquivo>`
- Verificar UI em `http://127.0.0.1:4200/` quando o serve estiver no ar

## File map

- Create: `src/app/features/boletos/bancos.logic.ts` — filtro, validação, incluir/alterar/excluir
- Create: `src/app/features/boletos/bancos.logic.spec.ts`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.ts`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.html`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.css`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.spec.ts`
- Modify: `src/app/features/boletos/boletos.model.ts` — `BancoCadastro`, `TelaAtiva`, `ModoFichaBanco`
- Modify: `src/app/features/boletos/boletos.mock.ts` — `BANCOS_MOCK`
- Modify: `src/app/features/boletos/boletos.mock.spec.ts` — 6 bancos iniciais
- Modify: `src/app/features/boletos/boletos.page.ts` / `.html` / `.css` / `.spec.ts` — troca de tela
- Modify: `protheus/resource/automacao-financeira.app` via `npm run package:protheus` (último task)
- Unchanged: `protheus/src/AFINBOL.prw`

---

### Task 1: Modelo, mock e lógica pura

**Files:**
- Modify: `src/app/features/boletos/boletos.model.ts`
- Modify: `src/app/features/boletos/boletos.mock.ts`
- Modify: `src/app/features/boletos/boletos.mock.spec.ts`
- Create: `src/app/features/boletos/bancos.logic.ts`
- Create: `src/app/features/boletos/bancos.logic.spec.ts`

**Interfaces:**
- Produces: `BancoCadastro`, `BANCOS_MOCK`, `filtrarBancos`, `bancoVazio`, `validarGravacaoBanco`, `incluirBanco`, `alterarBanco`, `excluirBanco`

- [ ] **Step 1: Write the failing tests**

Append to `boletos.mock.spec.ts` inside the existing `it`:

```ts
expect(BANCOS_MOCK.map((b) => b.codigo)).toEqual(['341', '033', '001', '422', '237', '104']);
```

Add import `BANCOS_MOCK` from `./boletos.mock`.

Create `bancos.logic.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { alterarBanco, excluirBanco, filtrarBancos, incluirBanco, validarGravacaoBanco } from './bancos.logic';
import { BANCOS_MOCK } from './boletos.mock';
import { BancoCadastro } from './boletos.model';

const vazio: BancoCadastro = {
  codigo: '',
  nome: '',
  nomeReduzido: '',
  agencia: '',
  dvAgencia: '',
  conta: '',
  dvConta: '',
  moeda: '1',
};

describe('bancos.logic', () => {
  it('filters by codigo nome reduzido agencia or conta', () => {
    expect(filtrarBancos(BANCOS_MOCK, '237').map((b) => b.codigo)).toEqual(['237']);
    expect(filtrarBancos(BANCOS_MOCK, 'safra').map((b) => b.codigo)).toEqual(['422']);
    expect(filtrarBancos(BANCOS_MOCK, '').length).toBe(6);
  });

  it('rejects include without codigo or nome and duplicate codigo', () => {
    expect(validarGravacaoBanco({ ...vazio, nome: 'X' }, BANCOS_MOCK, 'incluir').erro).toBe(
      'Informe o código e o nome do banco.',
    );
    expect(validarGravacaoBanco({ ...vazio, codigo: '341', nome: 'X' }, BANCOS_MOCK, 'incluir').erro).toBe(
      'Já existe um banco com este código.',
    );
  });

  it('includes alters and deletes in memory', () => {
    const novo = { ...vazio, codigo: '999', nome: 'Teste Banco' };
    const afterIncluir = incluirBanco(BANCOS_MOCK, novo);
    expect(afterIncluir).toHaveLength(7);
    const afterAlterar = alterarBanco(afterIncluir, { ...novo, nome: 'Teste Banco SA' });
    expect(afterAlterar.find((b) => b.codigo === '999')?.nome).toBe('Teste Banco SA');
    expect(excluirBanco(afterAlterar, '999')).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx ng test --watch=false --include=src/app/features/boletos/bancos.logic.spec.ts`

Expected: FAIL (file or exports missing).

- [ ] **Step 3: Implement model, mock and logic**

Add to `boletos.model.ts`:

```ts
export type TelaAtiva = 'boletos' | 'bancos-browse' | 'bancos-form';
export type ModoFichaBanco = 'incluir' | 'alterar' | 'visualizar';

export interface BancoCadastro {
  codigo: string;
  nome: string;
  nomeReduzido: string;
  agencia: string;
  dvAgencia: string;
  conta: string;
  dvConta: string;
  moeda: string;
}
```

Export `BANCOS_MOCK` from `boletos.mock.ts` (same 6 rows as the spec table).

Create `bancos.logic.ts`:

```ts
import { BancoCadastro, ModoFichaBanco } from './boletos.model';

export function bancoVazio(): BancoCadastro {
  return {
    codigo: '',
    nome: '',
    nomeReduzido: '',
    agencia: '',
    dvAgencia: '',
    conta: '',
    dvConta: '',
    moeda: '1',
  };
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function filtrarBancos(bancos: BancoCadastro[], busca: string): BancoCadastro[] {
  const q = norm(busca);
  if (!q) {
    return bancos;
  }
  return bancos.filter((b) =>
    [b.codigo, b.nome, b.nomeReduzido, b.agencia, b.conta].some((v) => norm(v).includes(q)),
  );
}

export function validarGravacaoBanco(
  banco: BancoCadastro,
  lista: BancoCadastro[],
  modo: ModoFichaBanco,
): { ok: true } | { ok: false; erro: string } {
  if (!banco.codigo.trim() || !banco.nome.trim()) {
    return { ok: false, erro: 'Informe o código e o nome do banco.' };
  }
  if (modo === 'incluir' && lista.some((b) => b.codigo.trim() === banco.codigo.trim())) {
    return { ok: false, erro: 'Já existe um banco com este código.' };
  }
  return { ok: true };
}

export function incluirBanco(lista: BancoCadastro[], banco: BancoCadastro): BancoCadastro[] {
  return [...lista, { ...banco, codigo: banco.codigo.trim() }];
}

export function alterarBanco(lista: BancoCadastro[], banco: BancoCadastro): BancoCadastro[] {
  return lista.map((b) => (b.codigo === banco.codigo ? { ...banco } : b));
}

export function excluirBanco(lista: BancoCadastro[], codigo: string): BancoCadastro[] {
  return lista.filter((b) => b.codigo !== codigo);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```
npx ng test --watch=false --include=src/app/features/boletos/bancos.logic.spec.ts
npx ng test --watch=false --include=src/app/features/boletos/boletos.mock.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit only if Beatriz asked**

Skip unless she explicitly requested a commit.

---

### Task 2: Trocar a área principal ao clicar Cadastrar banco

**Files:**
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.ts`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.html`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.css`
- Create: `src/app/features/boletos/components/bancos-page/bancos-page.spec.ts` (mínimo: renderiza título)
- Modify: `src/app/features/boletos/boletos.page.ts`
- Modify: `src/app/features/boletos/boletos.page.html`
- Modify: `src/app/features/boletos/boletos.page.css`
- Modify: `src/app/features/boletos/boletos.page.spec.ts`

**Interfaces:**
- Consumes: `BANCOS_MOCK`, `TelaAtiva`, `AcaoSidebar`
- Produces: `BancosPage` with inputs `bancos`, `tela` (`bancos-browse` | `bancos-form`) and output `voltar`; `BoletosPage.onAcao` / `onVoltarBancos`

- [ ] **Step 1: Write the failing page tests**

Add to `boletos.page.spec.ts` (extend notify mock with `warning: vi.fn()`). Helpers: click the sidebar child **Cadastrar banco** via `page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' })`.

```ts
it('opens Cadastro de Bancos from Cadastrar banco and returns via Voltar or another menu item', async () => {
  const fixture = await render();
  const page = fixture.componentInstance;
  const notify = TestBed.inject(PoNotificationService);

  page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' });
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Cadastro de Bancos');
  expect(fixture.nativeElement.textContent).not.toContain('Títulos a Receber');
  expect(fixture.nativeElement.querySelector('app-totals-bar')).toBeNull();

  page.onVoltarBancos();
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Títulos a Receber');
  expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');

  page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' });
  fixture.detectChanges();
  page.onAcao({ id: 'retorno-api', label: 'Retorno API' });
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');
  expect(notify.information).toHaveBeenCalledWith('Mock: Retorno API');
});
```

- [ ] **Step 2: Run the page spec — expect FAIL**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.page.spec.ts`

Expected: FAIL (`onVoltarBancos` missing and/or still showing titles).

- [ ] **Step 3: Scaffold BancosPage and wire BoletosPage**

`bancos-page.ts` (browse-only for this task; form comes in Task 3):

```ts
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { filtrarBancos } from '../../bancos.logic';
import { BancoCadastro, ModoFichaBanco, TelaAtiva } from '../../boletos.model';

@Component({
  selector: 'app-bancos-page',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule],
  templateUrl: './bancos-page.html',
  styleUrl: './bancos-page.css',
})
export class BancosPage {
  readonly bancos = input.required<BancoCadastro[]>();
  readonly tela = input.required<Exclude<TelaAtiva, 'boletos'>>();
  readonly voltar = output<void>();
  readonly incluir = output<void>();
  readonly alterar = output<BancoCadastro>();
  readonly visualizar = output<BancoCadastro>();
  readonly excluir = output<BancoCadastro>();
  readonly gravar = output<BancoCadastro>();
  readonly cancelarFicha = output<void>();
  readonly modoFicha = input<ModoFichaBanco>('incluir');
  readonly rascunho = input<BancoCadastro | null>(null);

  readonly busca = signal('');
  readonly selecionado = signal<BancoCadastro | null>(null);

  readonly visiveis = computed(() => filtrarBancos(this.bancos(), this.busca()));

  readonly columns: PoTableColumn[] = [
    { property: 'codigo', label: 'Código', width: '90px' },
    { property: 'nome', label: 'Nome' },
    { property: 'nomeReduzido', label: 'Nome reduzido' },
    { property: 'agencia', label: 'Agência', width: '100px' },
    { property: 'conta', label: 'Conta', width: '120px' },
  ];

  onSelect(row: BancoCadastro): void {
    this.selecionado.set(row);
  }

  onUnselect(): void {
    this.selecionado.set(null);
  }
}
```

`bancos-page.html` (browse): title **Cadastro de Bancos**, `po-input` Pesquisar, five `po-button` (Incluir, Alterar, Visualizar, Excluir, Voltar), `po-table` selectable hide-select-all. Wire Voltar to `voltar.emit()`. Incluir/Alterar/Visualizar/Excluir can no-op emit for now (Alterar emits `selecionado()` if set).

In `boletos.page.ts`:

```ts
readonly telaAtiva = signal<TelaAtiva>('boletos');
readonly bancos = signal<BancoCadastro[]>([...BANCOS_MOCK]);

onAcao(action: AcaoSidebar): void {
  if (action.id === 'cadastra-banco') {
    this.telaAtiva.set('bancos-browse');
    return;
  }
  this.telaAtiva.set('boletos');
  this.notify.information(`Mock: ${action.label}`);
}

onVoltarBancos(): void {
  this.telaAtiva.set('boletos');
}
```

`boletos.page.html`: wrap current filters/table/totals in `@if (telaAtiva() === 'boletos')`. `@else` render `<app-bancos-page [bancos]="bancos()" [tela]="telaAtiva() === 'boletos' ? 'bancos-browse' : telaAtiva()" (voltar)="onVoltarBancos()" />`. Title `h1`: `Gerenciador de Boletos` only on boletos; bancos page has its own h1.

CSS: `app-bancos-page { flex: 1; min-height: 0; display: flex; flex-direction: column; }`

Import `BANCOS_MOCK` and `BancosPage`.

- [ ] **Step 4: Run tests**

Run: `npx ng test --watch=false --include=src/app/features/boletos/boletos.page.spec.ts`

Expected: PASS, including the new navigation test. Existing tests still see Títulos a Receber (default tela boletos).

- [ ] **Step 5: Browser**

Open `http://127.0.0.1:4200/`, menu Bancos → Cadastrar banco, confirmar que some a grade e aparece Cadastro de Bancos; Voltar e Retorno API devolvem o Gerenciador.

- [ ] **Step 6: Commit only if asked**

---

### Task 3: Ficha Incluir / Alterar / Visualizar

**Files:**
- Modify: `src/app/features/boletos/components/bancos-page/*`
- Modify: `src/app/features/boletos/boletos.page.ts`
- Modify: `src/app/features/boletos/boletos.page.spec.ts`
- Modify: `src/app/features/boletos/components/bancos-page/bancos-page.spec.ts`

**Interfaces:**
- Consumes: `bancoVazio`, `validarGravacaoBanco`, `incluirBanco`, `alterarBanco`
- Produces: `onIncluir`, `onAlterar`, `onVisualizar`, `onGravarFicha`, `onCancelarFicha` on `BoletosPage`

- [ ] **Step 1: Write failing tests**

Page spec:

```ts
it('includes a bank from the form and blocks alter without selection', async () => {
  const fixture = await render();
  const page = fixture.componentInstance;
  const notify = TestBed.inject(PoNotificationService) as { warning: ReturnType<typeof vi.fn> };

  page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' });
  page.onIncluirBanco();
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Incluir banco');

  page.onGravarFicha({
    codigo: '999',
    nome: 'Banco Teste',
    nomeReduzido: 'Teste',
    agencia: '1',
    dvAgencia: '0',
    conta: '2',
    dvConta: '0',
    moeda: '1',
  });
  fixture.detectChanges();
  expect(page.bancos().some((b) => b.codigo === '999')).toBe(true);
  expect(page.telaAtiva()).toBe('bancos-browse');

  page.onAlterarBanco();
  expect(notify.warning).toHaveBeenCalledWith('Selecione um banco.');
});
```

Provide `warning: vi.fn()` in the `PoNotificationService` mock.

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement form**

On `BoletosPage` keep `modoFicha` and `rascunho` signals.

- `onIncluirBanco`: `modoFicha='incluir'`, `rascunho=bancoVazio()`, `telaAtiva='bancos-form'`
- `onAlterarBanco(banco?)`: if no banco, `notify.warning('Selecione um banco.')`; else fill rascunho, modo alterar, tela form. Código permanece no rascunho; ficha desabilita o campo código.
- `onVisualizarBanco(banco?)`: same selection guard; modo visualizar
- `onGravarFicha(banco)`: `validarGravacaoBanco`; if erro, `notify.warning(erro)`; else incluir or alterar list, `telaAtiva='bancos-browse'`
- `onCancelarFicha`: `telaAtiva='bancos-browse'`
- Clicking `cadastra-banco` again while on form: `telaAtiva='bancos-browse'` (descarta rascunho)

`bancos-page.html` `@if (tela() === 'bancos-form')` show form with po-input for all 8 fields, Confirmar (hidden when visualizar), Cancelar/Voltar. `[p-disabled]` on all fields when visualizar; código disabled when alterar.

Copy rascunho into a local writable signal when the form opens so ngModel can edit (use `linkedSignal` or clone in parent and two-way via output). Simplest: parent owns rascunho as signal; child uses `[ngModel]` + `(ngModelChange)` emitting `rascunhoChange`, or child keeps `ficha = signal` set from `rascunho` input in an effect.

Use an `effect` in `BancosPage`:

```ts
constructor() {
  effect(() => {
    const r = this.rascunho();
    this.ficha.set(r ? { ...r } : bancoVazio());
  });
}
```

Confirmar emits `gravar` with `ficha()`.

Form title: Incluir banco / Alterar banco / Visualizar banco.

- [ ] **Step 4: Run tests**

```
npx ng test --watch=false --include=src/app/features/boletos/boletos.page.spec.ts
npx ng test --watch=false --include=src/app/features/boletos/components/bancos-page/bancos-page.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Browser**

Incluir 999, voltar ao browse, ver a linha; Alterar Itaú nome reduzido; Visualizar Caixa somente leitura; Alterar sem seleção mostra aviso.

- [ ] **Step 6: Commit only if asked**

---

### Task 4: Excluir com confirmação

**Files:**
- Modify: `src/app/features/boletos/boletos.page.ts`
- Modify: `src/app/features/boletos/boletos.page.spec.ts`

**Interfaces:**
- Consumes: `excluirBanco`, `PoDialogService.confirm`
- Produces: `onExcluirBanco(banco?: BancoCadastro)`

- [ ] **Step 1: Write failing test**

Mock `PoDialogService` with `confirm: vi.fn((opts) => opts.confirm())` so the test auto-confirms.

```ts
it('deletes the selected bank after confirm', async () => {
  const fixture = await render();
  const page = fixture.componentInstance;
  page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' });
  page.onExcluirBanco(page.bancos()[0]);
  fixture.detectChanges();
  expect(page.bancos().map((b) => b.codigo)).not.toContain('341');
});
```

Add `PoDialogService` to `providers` in `render()`.

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```ts
onExcluirBanco(banco?: BancoCadastro): void {
  if (!banco) {
    this.notify.warning('Selecione um banco.');
    return;
  }
  this.poDialog.confirm({
    title: 'Excluir',
    message: `Confirma a exclusão do banco ${banco.codigo}?`,
    confirm: () => this.bancos.set(excluirBanco(this.bancos(), banco.codigo)),
  });
}
```

- [ ] **Step 4: Run page spec — expect PASS**

- [ ] **Step 5: Browser** — Excluir Safra, confirmar, some da lista; cancelar no diálogo mantém.

- [ ] **Step 6: Commit only if asked**

---

### Task 5: Empacotar para Protheus Web

**Files:**
- Regenerates: `protheus/resource/automacao-financeira.app`
- Unchanged: `protheus/src/AFINBOL.prw` (`FwCallApp("automacao-financeira")`)

**Interfaces:**
- Consumes: `npm run package:protheus` (`ng build` + `scripts/package-protheus-app.ps1`)

- [ ] **Step 1: Run the packager**

Run: `npm run package:protheus`

Expected: `Created C:\Users\Beatriz\Documents\GitHub\automacao-financeira\protheus\resource\automacao-financeira.app` with a non-zero byte size.

- [ ] **Step 2: Tell Beatriz how to open it in Web**

Não editar `servers.json` e não digitar senha. Ela aponta o TDS para **localhost TCP 1002**, env **top2610**, compila `AFINBOL.prw` + `automacao-financeira.app`, e abre `U_AFINBOL` no WebApp `http://localhost:1020/`.

No Web: menu Bancos → Cadastrar banco deve mostrar o cadastro (mesmo comportamento do `http://127.0.0.1:4200/`).

- [ ] **Step 3: Commit only if asked**

---

## Spec coverage

| Spec | Task |
|---|---|
| Troca de área, menu e header ficam | 2 |
| Voltar e outros itens voltam ao Gerenciador | 2 |
| Browse colunas + 6 bancos + Pesquisar | 1, 2 |
| Ficha 8 campos, incluir/alterar/visualizar | 3 |
| Código imutável no alterar; visualizar readonly | 3 |
| Validação código/nome e código único | 1, 3 |
| Excluir com confirmação, só memória | 4 |
| Sem rota, sem SA6 real | all |
| Protheus Web via FwCallApp + package | 5 |
