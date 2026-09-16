import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoFieldModule } from '@po-ui/ng-components';

import { BANCO_ICONS } from '../../boletos.bancos';
import { FiltrosRapidos } from '../../boletos.model';

export type FiltroOption = { key: keyof FiltrosRapidos; label: string; icon?: string };

export const FILTROS_RAPIDOS_OPTIONS: FiltroOption[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'aberto', label: 'Abertos' },
  { key: 'parcBaixado', label: 'Parc. Baixados' },
  { key: 'baixado', label: 'Baixados' },
  { key: 'vencido', label: 'Vencidos' },
  { key: 'comBordero', label: 'Com Borderô' },
  { key: 'semBordero', label: 'Sem Borderô' },
  { key: 'adiantamento', label: 'Adiantamento' },
  { key: 'conciliado', label: 'Conciliados' },
  { key: 'naoConciliado', label: 'Não Conciliados' },
];

export const FILTROS_BANCOS_OPTIONS: FiltroOption[] = [
  { key: 'bancosTodos', label: 'Todos' },
  { key: 'itau', label: 'Itaú', icon: BANCO_ICONS['itau'] },
  { key: 'santander', label: 'Santander', icon: BANCO_ICONS['santander'] },
  { key: 'bb', label: 'Banco Brasil', icon: BANCO_ICONS['bb'] },
  { key: 'safra', label: 'Safra', icon: BANCO_ICONS['safra'] },
  { key: 'bradesco', label: 'Bradesco', icon: BANCO_ICONS['bradesco'] },
  { key: 'caixa', label: 'Caixa Econômica', icon: BANCO_ICONS['caixa'] },
];

@Component({
  selector: 'app-quick-filters',
  imports: [FormsModule, PoFieldModule],
  templateUrl: './quick-filters.html',
  styleUrl: './quick-filters.css',
})
export class QuickFilters {
  readonly title = input('Filtros Rápidos');
  readonly options = input<FiltroOption[]>(FILTROS_RAPIDOS_OPTIONS);
  readonly filtros = input.required<FiltrosRapidos>();
  readonly toggle = output<keyof FiltrosRapidos>();
  readonly filtrosVersion = signal(0);

  onToggle(chave: keyof FiltrosRapidos): void {
    this.toggle.emit(chave);
    this.filtrosVersion.update((v) => v + 1);
  }
}
