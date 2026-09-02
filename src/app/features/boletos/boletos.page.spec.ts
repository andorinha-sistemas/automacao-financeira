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
    expect(fixture.nativeElement.textContent).toContain('10,00');
  });
});
