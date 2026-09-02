import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoFieldModule } from '@po-ui/ng-components';

import { FiltrosRapidos } from '../../boletos.model';

@Component({
  selector: 'app-quick-filters',
  imports: [FormsModule, PoFieldModule],
  templateUrl: './quick-filters.html',
  styleUrl: './quick-filters.css',
})
export class QuickFilters {
  readonly filtros = input.required<FiltrosRapidos>();
  readonly toggle = output<keyof FiltrosRapidos>();
  readonly filtrosVersion = signal(0);

  readonly options: { key: keyof FiltrosRapidos; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'aberto', label: 'Abertos' },
    { key: 'parcBaixado', label: 'Parc. Baixados' },
    { key: 'baixado', label: 'Baixados' },
    { key: 'comBordero', label: 'Com Borderô' },
    { key: 'semBordero', label: 'Sem Borderô' },
    { key: 'adiantamento', label: 'Adiantamento' },
    { key: 'conciliado', label: 'Conciliados' },
    { key: 'naoConciliado', label: 'Não Conciliados' },
    { key: 'itau', label: 'Itaú' },
    { key: 'santander', label: 'Santander' },
    { key: 'bb', label: 'Banco Brasil' },
    { key: 'safra', label: 'Safra' },
  ];

  onToggle(chave: keyof FiltrosRapidos): void {
    this.toggle.emit(chave);
    this.filtrosVersion.update((v) => v + 1);
  }
}
