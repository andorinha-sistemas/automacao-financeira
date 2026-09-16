import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { BOLETOS_MOCK } from '../../boletos.mock';
import { TableResizeDirective } from '../../table-resize.directive';
import { TitulosReceberPage } from './titulos-receber-page';

describe('TitulosReceberPage', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [TitulosReceberPage],
    }).compileComponents();
    const fixture = TestBed.createComponent(TitulosReceberPage);
    fixture.componentRef.setInput('titulos', BOLETOS_MOCK.titulos);
    fixture.detectChanges();
    return fixture;
  }

  it('renders FINA740 browse with receivable mock titles', async () => {
    const fixture = await render();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Contas a Receber');
    expect(text).toContain('FINA740');
    expect(text).toContain('000097');
    expect(text).toContain('Contas Recebidas');
    expect(text).toContain('Transf/Borderô');
    expect(text).toContain('Títulos Antecip.');
    expect(text).toContain('Outras Ações');
    expect(text).toContain('Voltar');
    expect(fixture.nativeElement.querySelector('app-titles-table')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.receber__legenda')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Banco');
    expect(fixture.nativeElement.textContent).toContain('Nº Título');
    expect(fixture.nativeElement.querySelector('table.ficha')).toBeNull();
  });

  it('gives Títulos Antecip. and Voltar the same bordered secondary kind', async () => {
    const fixture = await render();
    const kinds = Object.fromEntries(
      [...fixture.nativeElement.querySelectorAll('.receber__actions po-button')].map((el: HTMLElement) => [
        el.getAttribute('ng-reflect-p-label') || el.getAttribute('p-label') || el.textContent?.trim(),
        el.getAttribute('ng-reflect-p-kind') || el.getAttribute('p-kind'),
      ]),
    );
    expect(kinds['Títulos Antecip.']).toBe('secondary');
    expect(kinds['Voltar']).toBe('secondary');
  });

  it('lists FINA740 extra actions in Outras Ações', async () => {
    const fixture = await render();
    fixture.nativeElement.querySelector('[data-outras-acoes] button')?.click();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Pesquisar');
    expect(text).toContain('Legenda');
    expect(text).toContain('Compensação');
    expect(text).toContain('Imprimir Browse');
  });

  it('resizes a browse column when the header edge is dragged', async () => {
    const fixture = await render();
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
