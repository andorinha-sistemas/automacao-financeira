import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoNotificationService, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { TaxaMoeda } from '../../boletos.model';
import { filtrarMoedas, formatTaxaMoeda } from '../../moedas.logic';
import { paginaDe, TAMANHO_PAGINA, totalPaginas } from '../../table-page';
import { TablePageSizeDirective } from '../../table-page-size.directive';
import { TablePager } from '../table-pager/table-pager';
import { TableResizeDirective } from '../../table-resize.directive';

@Component({
  selector: 'app-moedas-page',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule, TableResizeDirective, TablePageSizeDirective, TablePager],
  templateUrl: './moedas-page.html',
  styleUrl: './moedas-page.css',
})
export class MoedasPage {
  private readonly notify = inject(PoNotificationService, { optional: true });

  readonly moedas = input.required<TaxaMoeda[]>();
  readonly voltar = output<void>();

  readonly busca = signal('');
  readonly pagina = signal(1);
  readonly tamanho = signal(TAMANHO_PAGINA);
  readonly menuAberto = signal(false);
  readonly detalhesAberto = signal(false);
  readonly selecionado = signal<TaxaMoeda | null>(null);
  readonly visiveis = computed(() => filtrarMoedas(this.moedas() ?? [], this.busca()));
  readonly rows = computed(() =>
    this.visiveis().map((m) => ({
      ...m,
      taxa2Label: formatTaxaMoeda(m.taxa2),
      taxa3Label: formatTaxaMoeda(m.taxa3),
      taxa4Label: formatTaxaMoeda(m.taxa4),
      taxa5Label: formatTaxaMoeda(m.taxa5),
      taxa6Label: formatTaxaMoeda(m.taxa6),
      taxa7Label: formatTaxaMoeda(m.taxa7),
    })),
  );
  readonly paginaAtual = computed(() => paginaDe(this.rows(), this.pagina(), this.tamanho()));

  readonly dataBase = '11/09/2026';
  readonly empresa = 'Grupo Totvs 1 / Filial Belo Hor';

  readonly outrasAcoes = ['Pesquisar', 'Excluir', 'Legenda', 'Imprimir Browse'];

  readonly columns: PoTableColumn[] = [
    { property: 'data', label: 'Data', width: '110px' },
    { property: 'taxa2Label', label: 'Taxa Moeda 2' },
    { property: 'taxa3Label', label: 'Taxa Moeda 3' },
    { property: 'taxa4Label', label: 'Taxa Moeda 4' },
    { property: 'taxa5Label', label: 'Taxa Moeda 5' },
    { property: 'taxa6Label', label: 'Taxa Moeda 6' },
    { property: 'taxa7Label', label: 'Taxa Moeda 7' },
  ];

  onSelect(row: TaxaMoeda): void {
    this.selecionado.set(row);
  }

  onUnselect(): void {
    this.selecionado.set(null);
  }

  onPagina(pagina: number): void {
    this.pagina.set(pagina);
    this.selecionado.set(null);
  }

  onTamanho(n: number): void {
    if (n === this.tamanho()) {
      return;
    }
    this.tamanho.set(n);
    const max = totalPaginas(this.rows().length, n);
    if (this.pagina() > max) {
      this.pagina.set(max);
    }
  }

  constructor() {
    effect(() => {
      this.busca();
      this.moedas();
      this.pagina.set(1);
    });
  }

  onIncluir(): void {
    this.notify?.information('Mock: Incluir');
  }

  onAlterar(): void {
    if (!this.selecionado()) {
      this.notify?.warning('Selecione uma taxa.');
      return;
    }
    this.notify?.information('Mock: Alterar');
  }

  onFiltrar(): void {
    this.notify?.information('Mock: Filtrar');
  }

  onMostrarDetalhes(): void {
    this.detalhesAberto.set(!this.detalhesAberto());
  }

  onOutraAcao(item: string): void {
    this.menuAberto.set(false);
    if (item === 'Pesquisar') {
      const inputEl = document.querySelector('.moedas__tools input') as HTMLInputElement | null;
      inputEl?.focus();
      return;
    }
    if (item === 'Excluir' && !this.selecionado()) {
      this.notify?.warning('Selecione uma taxa.');
      return;
    }
    this.notify?.information(`Mock: ${item}`);
  }
}
