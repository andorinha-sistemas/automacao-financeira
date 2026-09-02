import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PoNotificationService, PoTableComponent } from '@po-ui/ng-components';
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
    const totais = fixture.nativeElement.querySelector('app-totals-bar') as HTMLElement;
    expect(text).toContain('GUILHERME');
    expect(text).toContain('13');
    expect(text).toContain('272,61');
    expect(totais.textContent).toContain('1,00');
  });

  it('hides po-table select-all so header selection cannot desync Total Marcado', async () => {
    const fixture = await render();
    const table = fixture.debugElement.query(By.directive(PoTableComponent));
    expect(table.componentInstance.hideSelectAll).toBe(true);
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
});
