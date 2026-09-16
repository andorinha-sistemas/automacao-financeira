import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { CLIENTES_MOCK } from '../../boletos.mock';
import { TableResizeDirective } from '../../table-resize.directive';
import { ClientesPage } from './clientes-page';

describe('ClientesPage', () => {
  it('renders MATA030 browse with customer mock rows', async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.componentRef.setInput('clientes', CLIENTES_MOCK);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Clientes');
    expect(text).toContain('MATA030');
    expect(text).toContain('CLIENTE PADRAO');
    expect(text).toContain('GUILHERME');
    expect(text).toContain('Incluir');
    expect(text).toContain('Alterar');
    expect(text).toContain('Visualizar');
    expect(text).toContain('Outras Ações');
    expect(text).toContain('Voltar');
    expect(text).toContain('Total de Registros');
    expect(fixture.nativeElement.querySelector('.clientes__outras po-button')).toBeTruthy();
  });

  it('gives browse toolbar buttons a bordered secondary kind except Incluir', async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.componentRef.setInput('clientes', CLIENTES_MOCK);
    fixture.detectChanges();
    const kinds = Object.fromEntries(
      [...fixture.nativeElement.querySelectorAll('.clientes__actions po-button')].map((el: HTMLElement) => [
        el.getAttribute('ng-reflect-p-label') || el.getAttribute('p-label') || el.textContent?.trim(),
        el.getAttribute('ng-reflect-p-kind') || el.getAttribute('p-kind'),
      ]),
    );
    expect(kinds['Incluir']).toBe('primary');
    expect(kinds['Alterar']).toBe('secondary');
    expect(kinds['Visualizar']).toBe('secondary');
    expect(kinds['Outras Ações']).toBe('secondary');
    expect(kinds['Voltar']).toBe('secondary');
  });

  it('lists extra actions in Outras Ações', async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.componentRef.setInput('clientes', CLIENTES_MOCK);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-outras-acoes] button')?.click();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Pesquisar');
    expect(text).toContain('Excluir');
    expect(text).toContain('Facilitador');
    expect(text).toContain('SubClientes');
    expect(text).toContain('Conhecimento');
    expect(text).toContain('Referencias');
    expect(text).toContain('Contatos');
    expect(text).toContain('Suspensão - REINF');
    expect(text).toContain('Privilégios');
    expect(text).toContain('Perfil_360');
    expect(text).toContain('Imprimir Browse');
    expect(text).not.toContain('Copiar');
    expect(
      fixture.nativeElement.querySelector('.clientes__outras po-button')?.getAttribute('ng-reflect-kind') ??
        fixture.nativeElement.querySelector('.clientes__outras po-button')?.getAttribute('p-kind'),
    ).toMatch(/secondary/);
  });

  it('resizes a browse column when the header edge is dragged', async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.componentRef.setInput('clientes', CLIENTES_MOCK);
    fixture.detectChanges();
    const resize = fixture.debugElement.query(By.directive(TableResizeDirective));
    resize.injector.get(TableResizeDirective).resizeColumn('nome', 160);
    fixture.detectChanges();
    const th = [...fixture.nativeElement.querySelectorAll('thead th')].find((el: HTMLElement) =>
      el.textContent?.includes('Nome'),
    ) as HTMLElement;
    expect(th.style.width).toBe('160px');
    expect(th.style.minWidth).toBe('160px');
  });
});
