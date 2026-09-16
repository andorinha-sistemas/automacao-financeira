import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { MOEDAS_MOCK } from '../../boletos.mock';
import { TableResizeDirective } from '../../table-resize.directive';
import { MoedasPage } from './moedas-page';

describe('MoedasPage', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [MoedasPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(MoedasPage);
    fixture.componentRef.setInput('moedas', MOEDAS_MOCK);
    fixture.detectChanges();
    return fixture;
  }

  it('renders MATA090 browse with currency rate mock rows', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Moedas');
    expect(text).toContain('MATA090');
    expect(text).toContain('Data base');
    expect(text).toContain('11/09/2026');
    expect(text).toContain('Grupo Totvs 1');
    expect(text).toContain('31/12/1899');
    expect(text).toContain('1.1081');
    expect(text).toContain('Incluir');
    expect(text).toContain('Alterar');
    expect(text).toContain('Outras Ações');
    expect(text).toContain('Voltar');
    expect(text).toContain('Mostrar Detalhes');
    expect(text).toContain('Taxa Moeda 2');
  });

  it('gives browse toolbar buttons a bordered secondary kind except Incluir', async () => {
    const fixture = await render();
    const kinds = Object.fromEntries(
      [...fixture.nativeElement.querySelectorAll('.moedas__actions po-button')].map((el: HTMLElement) => [
        el.getAttribute('ng-reflect-p-label') || el.getAttribute('p-label') || el.textContent?.trim(),
        el.getAttribute('ng-reflect-p-kind') || el.getAttribute('p-kind'),
      ]),
    );
    expect(kinds['Incluir']).toBe('primary');
    expect(kinds['Alterar']).toBe('secondary');
    expect(kinds['Outras Ações']).toBe('secondary');
    expect(kinds['Voltar']).toBe('secondary');
  });

  it('lists extra actions in Outras Ações', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelector('[data-outras-acoes] button')?.click();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Pesquisar');
    expect(text).toContain('Excluir');
    expect(text).toContain('Legenda');
    expect(text).toContain('Imprimir Browse');
  });

  it('resizes a browse column when the header edge is dragged', async () => {
    const fixture = await render();
    const resize = fixture.debugElement.query(By.directive(TableResizeDirective));
    resize.injector.get(TableResizeDirective).resizeColumn('data', 160);
    fixture.detectChanges();
    const th = [...fixture.nativeElement.querySelectorAll('thead th')].find((el: HTMLElement) =>
      el.textContent?.includes('Data'),
    ) as HTMLElement;
    expect(th.style.width).toBe('160px');
    expect(th.style.minWidth).toBe('160px');
  });
});
