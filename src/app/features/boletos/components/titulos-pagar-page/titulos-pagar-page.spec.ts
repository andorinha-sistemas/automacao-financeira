import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TITULOS_PAGAR_MOCK } from '../../boletos.mock';
import { TableResizeDirective } from '../../table-resize.directive';
import { TitulosPagarPage } from './titulos-pagar-page';

describe('TitulosPagarPage', () => {
  it('renders FINA050 browse with payable mock titles', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Contas a Pagar');
    expect(fixture.nativeElement.textContent).toContain('FINA050');
    expect(fixture.nativeElement.textContent).toContain('FORNECEDOR ALPHA LTDA');
    expect(fixture.nativeElement.textContent).toContain('Voltar');
    expect(fixture.nativeElement.textContent).toContain('Incluir');
    expect(fixture.nativeElement.textContent).toContain('Alterar');
    expect(fixture.nativeElement.textContent).toContain('Visualizar');
    expect(fixture.nativeElement.textContent).toContain('Contas Pagas');
    expect(fixture.nativeElement.textContent).toContain('Outras Ações');
    expect(fixture.nativeElement.querySelector('.pagar__outras po-button')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.pagar__outras-btn')).toBeNull();
  });

  it('gives browse toolbar buttons a bordered secondary kind except Incluir', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.detectChanges();
    const kinds = Object.fromEntries(
      [...fixture.nativeElement.querySelectorAll('.pagar__actions po-button')].map((el: HTMLElement) => [
        el.getAttribute('ng-reflect-p-label') || el.getAttribute('p-label') || el.textContent?.trim(),
        el.getAttribute('ng-reflect-p-kind') || el.getAttribute('p-kind'),
      ]),
    );
    expect(kinds['Incluir']).toBe('primary');
    expect(kinds['Alterar']).toBe('secondary');
    expect(kinds['Visualizar']).toBe('secondary');
    expect(kinds['Contas Pagas']).toBe('secondary');
    expect(kinds['Outras Ações']).toBe('secondary');
    expect(kinds['Voltar']).toBe('secondary');
  });

  it('lists FINA050 extra actions in Outras Ações', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-outras-acoes] button')?.click();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Pesquisar');
    expect(text).toContain('Excluir');
    expect(text).toContain('Substituição de Provisórios');
    expect(text).toContain('Histórico do Título');
    expect(text).toContain('Imprimir Browse');
  });

  it('renders the incluir ficha as a 5-column table with native fields', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Contas a Pagar');
    expect(text).toContain('Dados Gerais');
    expect(text).toContain('Impostos');
    expect(text).toContain('Administrativo');
    expect(text).toContain('Banco');
    expect(text).toContain('Contábil');
    expect(text).toContain('Outros');
    expect(text).toContain('Cancelar');
    expect(text).toContain('Salvar');
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha input[name="numero"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="tipo"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('FINA050');
  });

  it('renders Outros fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.pagar__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Outros'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha select[name="rateioProj"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="codOrcam"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="classeValor"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="itemContab"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="descP100"]')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('table.ficha input[name="nomeOperad"]')?.closest('td')?.getAttribute('colspan'),
    ).toBe('2');
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="numContrato"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="nomeOperad"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="vlrRetIss"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
  });

  it('renders Contábil fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.pagar__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Contábil'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha select[name="rateio"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="ctaContabil"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="cCusto"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="seqDiario"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="codDiario"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
  });

  it('renders Banco fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.pagar__tab')].find((el: HTMLElement) =>
      el.textContent?.trim() === 'Banco',
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha input[name="portador"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="modPagto"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="codBarras"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="linhaDig"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="formaPgto"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="agenciaFor"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="contaFor"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
  });

  it('renders Administrativo fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.pagar__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Administrativo'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha input[name="taxaPerman"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="porcJuros"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="aprovador"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="fluxoCaixa"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="desdobramento"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="multNatur"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="possuiDesc"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="noSolicitacao"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
  });

  it('renders Impostos fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.pagar__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Impostos'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha input[name="iss"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="irrf"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="inss"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="sestSenat"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="codServIss"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="aplicVlMin"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="comDet"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="formRetIss"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="baseInss"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="basePcc"]') as HTMLInputElement).disabled,
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
  });

  it('hides Salvar and disables fields in visualizar', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.componentRef.setInput('tela', 'titulos-pagar-form');
    fixture.componentRef.setInput('modoFicha', 'visualizar');
    fixture.componentRef.setInput('rascunho', TITULOS_PAGAR_MOCK[0]);
    fixture.detectChanges();
    const salvar = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLElement) => b.textContent?.trim() === 'Salvar',
    );
    expect(salvar).toBeFalsy();
    expect((fixture.nativeElement.querySelector('table.ficha input[name="numero"]') as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it('resizes a browse column when the header edge is dragged', async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPagarPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosPagarPage);
    fixture.componentRef.setInput('titulos', TITULOS_PAGAR_MOCK);
    fixture.detectChanges();
    const resize = fixture.debugElement.query(By.directive(TableResizeDirective));
    resize.injector.get(TableResizeDirective).resizeColumn('numero', 160);
    fixture.detectChanges();
    const th = [...fixture.nativeElement.querySelectorAll('thead th')].find((el: HTMLElement) =>
      el.textContent?.includes('Nº Título'),
    ) as HTMLElement;
    expect(th.style.width).toBe('160px');
    expect(th.style.minWidth).toBe('160px');
  });
});
