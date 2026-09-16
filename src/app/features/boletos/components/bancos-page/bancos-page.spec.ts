import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PoTableComponent } from '@po-ui/ng-components';
import { describe, expect, it } from 'vitest';

import { BANCOS_MOCK } from '../../boletos.mock';
import { TableResizeDirective } from '../../table-resize.directive';
import { BancosPage } from './bancos-page';

describe('BancosPage', () => {
  it('renders Cadastro de Bancos and the mock bank codes', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-browse');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cadastro de Bancos');
    expect(fixture.nativeElement.textContent).toContain('Filial');
    expect(fixture.nativeElement.textContent).toContain('341');
    expect(fixture.nativeElement.textContent).toContain('Voltar');
  });

  it('gives browse toolbar buttons a bordered secondary kind except Incluir', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-browse');
    fixture.detectChanges();
    const kinds = Object.fromEntries(
      [...fixture.nativeElement.querySelectorAll('.bancos__actions po-button')].map((el: HTMLElement) => [
        el.getAttribute('ng-reflect-p-label') || el.getAttribute('p-label') || el.textContent?.trim(),
        el.getAttribute('ng-reflect-p-kind') || el.getAttribute('p-kind'),
      ]),
    );
    expect(kinds['Incluir']).toBe('primary');
    expect(kinds['Alterar']).toBe('secondary');
    expect(kinds['Visualizar']).toBe('secondary');
    expect(kinds['Excluir']).toBe('secondary');
    expect(kinds['Voltar']).toBe('secondary');
  });

  it('uses square checkboxes like the other browse tables', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-browse');
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(PoTableComponent));
    expect(table.componentInstance.singleSelect).toBe(false);
  });

  it('resizes a browse column when the header edge is dragged', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-browse');
    fixture.detectChanges();
    const resize = fixture.debugElement.query(By.directive(TableResizeDirective));
    resize.injector.get(TableResizeDirective).resizeColumn('nome', 160);
    fixture.detectChanges();
    const th = [...fixture.nativeElement.querySelectorAll('thead th')].find(
      (el: HTMLElement) => el.textContent?.trim() === 'Nome',
    ) as HTMLElement;
    expect(th.style.width).toBe('160px');
    expect(th.style.minWidth).toBe('160px');
  });

  it('renders 10 bank rows at a time and can open the next page', async () => {
    const muitos = Array.from({ length: 25 }, (_, i) => ({
      ...BANCOS_MOCK[0],
      id: `b${i}`,
      codigo: String(i).padStart(3, '0'),
      nome: `Banco ${i}`,
    }));
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', muitos);
    fixture.componentRef.setInput('tela', 'bancos-browse');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.bancos__table tbody tr').length).toBe(10);
    expect(fixture.nativeElement.textContent).toContain('1 - 10 de 25');
    expect(fixture.nativeElement.textContent).toContain('Banco 0');
    expect(fixture.nativeElement.textContent).not.toContain('Banco 10');
    const proxima = [...fixture.nativeElement.querySelectorAll('po-button')].find((el: HTMLElement) =>
      (el.getAttribute('p-label') || el.textContent)?.includes('Próxima'),
    ) as HTMLElement;
    proxima?.querySelector('button')?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('11 - 20 de 25');
    expect(fixture.nativeElement.textContent).toContain('Banco 10');
    expect(fixture.nativeElement.textContent).not.toContain('Banco 0');
  });

  it('renders the incluir ficha as a 5-column table with native fields', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-form');
    fixture.componentRef.setInput('modoFicha', 'incluir');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Bancos - INCLUIR');
    expect(fixture.nativeElement.querySelectorAll('table.ficha colgroup col').length).toBe(5);
    const primeiraLinha = fixture.nativeElement.querySelector('table.ficha tr');
    expect(primeiraLinha?.querySelectorAll('td').length).toBe(5);
    expect(fixture.nativeElement.querySelector('table.ficha input[name="codigo"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha po-input')).toBeNull();
  });

  it('renders Comunicação Online fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-form');
    fixture.componentRef.setInput('modoFicha', 'alterar');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.bancos__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Comunicação Online'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="codCedente"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="multaPix"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="diasExpPix"]')).toBeTruthy();
    const primeiraLinha = fixture.nativeElement.querySelector('table.ficha tr');
    expect(primeiraLinha?.querySelectorAll('td').length).toBe(4);
  });

  it('renders Movimentos fields on the same 5-column ficha with Saldo Atual read-only', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-form');
    fixture.componentRef.setInput('modoFicha', 'alterar');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.bancos__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Movimentos'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="retDesconto"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="saldoAtual"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="txCobSimpl"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="taxaDesconto"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="saldoAtual"]') as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it('renders Contábil fields on the same 5-column ficha', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-form');
    fixture.componentRef.setInput('modoFicha', 'alterar');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.bancos__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Contábil'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="contaContabil"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="entidadeFin"]')).toBeTruthy();
  });

  it('renders Integrações fields with Ident.Export read-only and Dados Intern as memo', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-form');
    fixture.componentRef.setInput('modoFicha', 'alterar');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.bancos__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Integrações'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="nroBanco"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="identExport"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha textarea[name="dadosIntern"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="identExport"]') as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it('renders Outros fields on the 5-column ficha with ID TechFin read-only', async () => {
    await TestBed.configureTestingModule({
      imports: [BancosPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(BancosPage);
    fixture.componentRef.setInput('bancos', BANCOS_MOCK);
    fixture.componentRef.setInput('tela', 'bancos-form');
    fixture.componentRef.setInput('modoFicha', 'alterar');
    fixture.detectChanges();
    const tab = [...fixture.nativeElement.querySelectorAll('.bancos__tab')].find((el: HTMLElement) =>
      el.textContent?.includes('Outros'),
    );
    tab?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="entDeb05"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="entCred09"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="integra"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha select[name="cntTechFin"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table.ficha input[name="idTechFin"]')).toBeTruthy();
    expect(
      (fixture.nativeElement.querySelector('table.ficha input[name="idTechFin"]') as HTMLInputElement).disabled,
    ).toBe(true);
  });
});
