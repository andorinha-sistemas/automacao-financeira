import { Component, computed, inject, signal } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';

import {
  aplicarFiltroRapido,
  calcularTotais,
  filtrarTitulos,
  temFiltroAplicado,
} from './boletos.logic';
import { BOLETOS_MOCK } from './boletos.mock';
import { AcaoSidebar, FILTROS_INICIAIS, FiltrosRapidos } from './boletos.model';
import { ActionSidebar } from './components/action-sidebar/action-sidebar';
import { AppHeader } from './components/app-header/app-header';
import { QuickFilters } from './components/quick-filters/quick-filters';
import { TitlesTable } from './components/titles-table/titles-table';
import { TotalsBar } from './components/totals-bar/totals-bar';

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
  readonly contexto = BOLETOS_MOCK.context;
  readonly acoes = BOLETOS_MOCK.actions;
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
