import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PoDialogService, PoNotificationService, PoTableComponent } from '@po-ui/ng-components';
import { describe, expect, it, vi } from 'vitest';

import { BoletosPage } from './boletos.page';
import { TableResizeDirective } from './table-resize.directive';
import { tituloPagarVazio } from './titulos-pagar.logic';

describe('BoletosPage', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [BoletosPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: PoNotificationService,
          useValue: { information: vi.fn(), warning: vi.fn() },
        },
        {
          provide: PoDialogService,
          useValue: { confirm: vi.fn((opts: { confirm: () => void }) => opts.confirm()) },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(BoletosPage);
    fixture.detectChanges();
    return fixture;
  }

  function http(): HttpTestingController {
    return TestBed.inject(HttpTestingController);
  }

  function flushBanksList(
    items: Array<{
      codigo: string;
      agencia?: string;
      conta?: string;
      nome?: string;
      reduzido?: string;
      cnpj?: string;
    }> = [{ codigo: '341', agencia: '1', conta: '1', nome: 'ITAU', reduzido: 'ITAU', cnpj: '' }],
  ): void {
    http()
      .expectOne((req) => req.method === 'GET' && req.url.includes('/andorinha/v1/banks'))
      .flush({ items });
  }

  function flushReceivablesList(
    items: Array<Record<string, string | number>> = [],
  ): void {
    http()
      .expectOne((req) => req.method === 'GET' && req.url.includes('/andorinha/v1/receivables'))
      .flush({ items });
  }

  it('renders GUILHERME and the print totals', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent as string;
    const totais = fixture.nativeElement.querySelector('app-totals-bar') as HTMLElement;
    expect(text).toContain('Financeiro');
    expect(fixture.nativeElement.querySelector('img.fin-header__logo[alt="TOTVS"]')).toBeTruthy();
    expect(text).toContain('GUILHERME');
    expect(text).toContain('Itaú');
    expect(text).toContain('Bradesco');
    expect(text).toContain('Caixa Econômica');
    expect(fixture.nativeElement.querySelector('img.banco__icon[src*="itau"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img.banco__icon[src*="bradesco"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img.banco__icon[src*="caixa"]')).toBeTruthy();
    expect(text).toContain('13');
    expect(text).toContain('272,61');
    expect(totais.textContent).toContain('1,00');
  });

  it('renders notification, help and settings icons before Sair', async () => {
    const fixture = await render();
    const header = fixture.nativeElement.querySelector('.fin-header') as HTMLElement;
    const labels = [...header.querySelectorAll('button')].map(
      (btn) => btn.getAttribute('aria-label') || btn.textContent?.trim(),
    );
    expect(labels).toEqual(['Notificações', 'Ajuda', 'Configurações', 'Sair']);
    expect(header.querySelector('.fin-header__badge')?.textContent?.trim()).toBe('5');
  });

  it('keeps the titles table in a constrained scroll area above Totais', async () => {
    const fixture = await render();
    const wrap = fixture.nativeElement.querySelector('app-titles-table .grid__table');
    const table = wrap?.querySelector('po-table');
    const totais = fixture.nativeElement.querySelector('app-totals-bar');
    expect(wrap).toBeTruthy();
    expect(table).toBeTruthy();
    expect(totais).toBeTruthy();
  });

  it('hides po-table select-all so header selection cannot desync Total Marcado', async () => {
    const fixture = await render();
    const table = fixture.debugElement.query(By.directive(PoTableComponent));
    expect(table.componentInstance.hideSelectAll).toBe(true);
  });

  it('places Banco immediately after the row checkbox with no empty header gap', async () => {
    const fixture = await render();
    const ths = [...fixture.nativeElement.querySelectorAll('app-titles-table thead th')] as HTMLElement[];
    expect(ths[0].classList.contains('po-table-column-selectable')).toBe(true);
    expect(ths[1].textContent).toContain('Banco');
  });

  it('resizes a titles column when the header edge is dragged', async () => {
    const fixture = await render();
    const titles = fixture.debugElement.query(By.css('app-titles-table'));
    const resize = titles.query(By.directive(TableResizeDirective));
    resize.injector.get(TableResizeDirective).resizeColumn('statusLabel', 160);
    fixture.detectChanges();
    const th = [...fixture.nativeElement.querySelectorAll('app-titles-table thead th')].find(
      (el: HTMLElement) => el.textContent?.includes('Status'),
    ) as HTMLElement;
    expect(th.style.width).toBe('160px');
    expect(th.style.minWidth).toBe('160px');
  });

  it('keeps Todos checked after clicking it while already selected', async () => {
    const fixture = await render();
    const todos = fixture.debugElement.query(By.css('app-quick-filters po-checkbox'));
    expect(todos.componentInstance.label).toBe('Todos');
    expect(todos.componentInstance.checkboxValue).toBe(true);

    const beforeInstance = todos.componentInstance;
    const qf = fixture.debugElement.query(By.css('app-quick-filters'));
    todos.nativeElement.querySelector('.container-po-checkbox').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(qf.componentInstance.filtrosVersion()).toBe(1);
    expect(fixture.componentInstance.filtros().todos).toBe(true);
    const after = fixture.debugElement.query(By.css('app-quick-filters po-checkbox'));
    expect(after.componentInstance).not.toBe(beforeInstance);
    expect(after.componentInstance.label).toBe('Todos');
    expect(after.componentInstance.checkboxValue).toBe(true);
  });

  it('filters Itaú to portador 341 rows', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onToggleFiltro('itau');
    fixture.detectChanges();
    expect(page.titulosVisiveis().every((t) => t.portador === '341')).toBe(true);
    expect(page.titulosVisiveis().some((t) => t.id === 't13')).toBe(false);
  });

  it('renders Bancos between Filtros Rápidos and Títulos a Receber', async () => {
    const fixture = await render();
    const panels = fixture.nativeElement.querySelectorAll('app-quick-filters');
    expect(panels).toHaveLength(2);
    expect(panels[0].querySelector('h2')?.textContent).toContain('Filtros Rápidos');
    expect(panels[1].querySelector('h2')?.textContent).toContain('Bancos');
    expect(panels[0].textContent).toContain('Vencidos');
    expect(panels[0].textContent).not.toContain('Itaú');
    expect(panels[1].textContent).toContain('Itaú');
    expect(panels[1].textContent).toContain('Todos');
    const main = fixture.nativeElement.querySelector('.shell__main') as HTMLElement;
    const children = [...main.children].map((el) => el.tagName.toLowerCase());
    expect(children.lastIndexOf('app-quick-filters')).toBeLessThan(
      children.indexOf('app-titles-table'),
    );
  });

  it('filters Vencidos to overdue title t13', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onToggleFiltro('vencido');
    fixture.detectChanges();
    expect(page.titulosVisiveis().map((t) => t.id)).toEqual(['t13']);
  });

  it('filters Bradesco and Caixa Econômica by portador', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onToggleFiltro('bradesco');
    fixture.detectChanges();
    expect(page.titulosVisiveis().map((t) => t.id)).toEqual(['t02']);
    page.onToggleFiltro('bancosTodos');
    page.onToggleFiltro('caixa');
    fixture.detectChanges();
    expect(page.titulosVisiveis().map((t) => t.id)).toEqual(['t05']);
  });

  it('updates marcado when only t08 is selected', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onLimparSelecao();
    page.onToggleSelecao('t08');
    fixture.detectChanges();
    expect(page.totais().marcado).toBe(10);
    const totais = fixture.nativeElement.querySelector('app-totals-bar') as HTMLElement;
    expect(totais.textContent).toContain('10,00');
  });

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
    expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');

    page.onAcao({ id: 'bancos', label: 'Bancos' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');
    expect(fixture.nativeElement.textContent).toContain('Títulos a Receber');
    expect(notify.information).not.toHaveBeenCalled();

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

  it('includes a bank from the form and blocks alter without selection', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const notify = TestBed.inject(PoNotificationService);

    page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' });
    flushBanksList();
    page.onIncluirBanco();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Bancos - INCLUIR');

    page.onGravarFicha({
      ...page.bancos()[0],
      codigo: '999',
      nome: 'Banco Teste',
      nomeReduzido: 'Teste',
      agencia: '1',
      dvAgencia: '0',
      conta: '2',
      dvConta: '0',
      moeda: '1',
    });
    http()
      .expectOne((req) => req.method === 'POST' && req.url.includes('/andorinha/v1/banks'))
      .flush({ success: true, codigo: '999' }, { status: 201, statusText: 'Created' });
    flushBanksList([
      { codigo: '999', agencia: '1', conta: '2', nome: 'Banco Teste', reduzido: 'Teste', cnpj: '' },
    ]);
    fixture.detectChanges();
    expect(page.bancos().some((b) => b.codigo === '999')).toBe(true);
    expect(page.telaAtiva()).toBe('bancos-browse');

    page.onAlterarBanco();
    expect(notify.warning).toHaveBeenCalledWith('Selecione um banco.');
  });

  it('deletes the selected bank after confirm', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const dialog = fixture.debugElement.injector.get(PoDialogService);
    vi.spyOn(dialog, 'confirm').mockImplementation((opts) => {
      (opts.confirm as () => void)();
    });
    page.onAcao({ id: 'cadastra-banco', label: 'Cadastrar banco' });
    flushBanksList();
    page.onExcluirBanco(page.bancos()[0]);
    http()
      .expectOne((req) => req.method === 'DELETE' && req.url.endsWith('/banks/341'))
      .flush({ success: true });
    flushBanksList([]);
    fixture.detectChanges();
    expect(page.bancos().map((b) => b.codigo)).not.toContain('341');
  });

  it('opens Contas a Pagar from Títulos a Pagar and returns via Voltar', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const notify = TestBed.inject(PoNotificationService);

    page.onAcao({ id: 'titulos-a-pagar', label: 'Títulos a Pagar' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Contas a Pagar');
    expect(fixture.nativeElement.textContent).toContain('FINA050');
    expect(fixture.nativeElement.querySelector('app-totals-bar')).toBeNull();
    expect(notify.information).not.toHaveBeenCalled();

    page.onVoltarTitulosPagar();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');
    expect(fixture.nativeElement.textContent).toContain('Títulos a Receber');
  });

  it('includes a payable title from the form and blocks alter without selection', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const notify = TestBed.inject(PoNotificationService);

    page.onAcao({ id: 'titulos-a-pagar', label: 'Títulos a Pagar' });
    page.onIncluirTituloPagar();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Dados Gerais');
    expect(fixture.nativeElement.textContent).toContain('Salvar');
    expect(fixture.nativeElement.textContent).not.toContain('FINA050');

    page.onGravarTituloPagar({
      ...tituloPagarVazio(),
      numero: '000009999',
      tipo: 'NF',
      natureza: '2001001',
      fornecedor: '000123',
      loja: '01',
      nomeFornecedor: 'NOVO FORNECEDOR',
      vencimento: '30/04/2025',
      vencimentoReal: '30/04/2025',
      valor: 10,
      valorRs: 10,
      saldo: 10,
    });
    fixture.detectChanges();
    expect(page.titulosPagar().some((t) => t.numero === '000009999')).toBe(true);
    expect(page.telaAtiva()).toBe('titulos-pagar');
    expect(fixture.nativeElement.textContent).toContain('FINA050');
    expect(fixture.nativeElement.textContent).toContain('NOVO FORNECEDOR');

    page.onAlterarTituloPagar();
    expect(notify.warning).toHaveBeenCalledWith('Selecione um título.');
  });

  it('cancels payable include without adding and returns to browse from Títulos menu', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const before = page.titulosPagar().length;

    page.onAcao({ id: 'titulos-a-pagar', label: 'Títulos a Pagar' });
    page.onIncluirTituloPagar();
    fixture.detectChanges();
    page.onCancelarFichaPagar();
    fixture.detectChanges();
    expect(page.titulosPagar().length).toBe(before);
    expect(page.telaAtiva()).toBe('titulos-pagar');
    expect(fixture.nativeElement.textContent).toContain('FINA050');

    page.onIncluirTituloPagar();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Dados Gerais');
    page.onAcao({ id: 'titulos', label: 'Títulos' });
    fixture.detectChanges();
    expect(page.telaAtiva()).toBe('titulos-pagar-form');
    expect(fixture.nativeElement.textContent).toContain('Dados Gerais');
    page.onAcao({ id: 'titulos-a-pagar', label: 'Títulos a Pagar' });
    fixture.detectChanges();
    expect(page.telaAtiva()).toBe('titulos-pagar');
    expect(fixture.nativeElement.textContent).toContain('FINA050');
  });

  it('updates a payable title on alterar', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    page.onAcao({ id: 'titulos-a-pagar', label: 'Títulos a Pagar' });
    const original = page.titulosPagar()[0];
    page.onAlterarTituloPagar(original);
    fixture.detectChanges();
    page.onGravarTituloPagar({ ...original, historico: 'Ajuste mock', valor: 2000 });
    fixture.detectChanges();
    expect(page.titulosPagar()[0].historico).toBe('Ajuste mock');
    expect(page.titulosPagar()[0].valor).toBe(2000);
    expect(page.telaAtiva()).toBe('titulos-pagar');
  });

  it('opens Clientes MATA030 from Cliente and returns via Voltar', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const notify = TestBed.inject(PoNotificationService);

    page.onAcao({ id: 'cliente', label: 'Cliente' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Clientes');
    expect(fixture.nativeElement.textContent).toContain('MATA030');
    expect(fixture.nativeElement.textContent).toContain('CLIENTE PADRAO');
    expect(fixture.nativeElement.querySelector('app-totals-bar')).toBeNull();
    expect(notify.information).not.toHaveBeenCalled();

    page.onAcao({ id: 'cliente-grupo', label: 'Cliente' });
    fixture.detectChanges();
    expect(page.telaAtiva()).toBe('clientes');
    expect(notify.information).not.toHaveBeenCalled();

    page.onVoltarClientes();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');
    expect(fixture.nativeElement.textContent).toContain('Títulos a Receber');
  });

  it('opens Moedas MATA090 from Moedas and returns via Voltar', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const notify = TestBed.inject(PoNotificationService);

    page.onAcao({ id: 'moedas', label: 'Moedas' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Moedas');
    expect(fixture.nativeElement.textContent).toContain('MATA090');
    expect(fixture.nativeElement.textContent).toContain('31/12/1899');
    expect(fixture.nativeElement.querySelector('app-totals-bar')).toBeNull();
    expect(notify.information).not.toHaveBeenCalled();

    page.onVoltarMoedas();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');
  });

  it('opens Contas a Receber FINA740 from Títulos a Receber and returns via Voltar', async () => {
    const fixture = await render();
    const page = fixture.componentInstance;
    const notify = TestBed.inject(PoNotificationService);

    page.onAcao({ id: 'titulos-a-receber', label: 'Títulos a Receber' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Contas a Receber');
    expect(fixture.nativeElement.textContent).toContain('FINA740');
    expect(fixture.nativeElement.textContent).toContain('000097');
    expect(fixture.nativeElement.querySelector('app-totals-bar')).toBeNull();
    expect(notify.information).not.toHaveBeenCalled();

    flushReceivablesList([
      {
        filial: 'D MG',
        prefixo: 'API',
        num: '000000999',
        parcela: '01',
        tipo: 'NF',
        natureza: '001',
        cliente: '000001',
        loja: '01',
        nomcli: 'CLIENTE TESTE',
        emissao: '20260908',
        vencto: '20261008',
        vencrea: '20261008',
        valor: 1500,
        saldo: 1500,
        historico: 'API',
        portador: '341',
      },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('000000999');
    expect(fixture.nativeElement.textContent).toContain('000001');
    expect(fixture.nativeElement.textContent).toContain('Itaú');

    page.onVoltarTitulosReceber();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gerenciador de Boletos');
    expect(fixture.nativeElement.textContent).toContain('Títulos a Receber');
  });
});

