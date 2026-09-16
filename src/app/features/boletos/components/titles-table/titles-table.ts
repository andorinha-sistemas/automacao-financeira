import { afterEveryRender, Component, computed, effect, ElementRef, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { BANCO_ICONS, BANCO_NOMES } from '../../boletos.bancos';
import { formatBrl } from '../../boletos.logic';
import { TituloReceber } from '../../boletos.model';
import { paginaDe, TAMANHO_PAGINA, totalPaginas } from '../../table-page';
import { TablePageSizeDirective } from '../../table-page-size.directive';
import { TablePager } from '../table-pager/table-pager';
import { TableResizeDirective } from '../../table-resize.directive';

@Component({
  selector: 'app-titles-table',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule, TableResizeDirective, TablePageSizeDirective, TablePager],
  templateUrl: './titles-table.html',
  styleUrl: './titles-table.css',
})
export class TitlesTable {
  private readonly host = inject(ElementRef);

  readonly items = input.required<TituloReceber[]>();
  readonly selecionados = input.required<ReadonlySet<string>>();
  readonly busca = input.required<string>();
  readonly filtrosAplicados = input.required<boolean>();
  readonly showBar = input(true);
  readonly buscaChange = output<string>();
  readonly limparFiltros = output<void>();
  readonly toggleSelecao = output<string>();
  readonly pagina = signal(1);
  readonly tamanho = signal(TAMANHO_PAGINA);

  readonly formatBrl = formatBrl;

  readonly columns: PoTableColumn[] = [
    { property: 'banco', label: 'Banco', width: '210px', type: 'columnTemplate' },
    { property: 'statusLabel', label: 'Status', width: '80px' },
    { property: 'alertaLabel', label: 'Alerta', width: '70px' },
    { property: 'filial', label: 'Filial' },
    { property: 'prefixo', label: 'Prefixo' },
    { property: 'numero', label: 'Nº Título' },
    { property: 'parcela', label: 'Parcela' },
    { property: 'tipo', label: 'Tipo' },
    { property: 'natureza', label: 'Natureza' },
    { property: 'portador', label: 'Portador' },
    { property: 'cliente', label: 'Cliente' },
    { property: 'loja', label: 'Loja' },
    { property: 'nomeCliente', label: 'Nome Cliente' },
    { property: 'emissao', label: 'Dt Emissão' },
    { property: 'vencimento', label: 'Vencimento' },
    { property: 'vencimentoReal', label: 'Vencto Real' },
    { property: 'valorLabel', label: 'Vlr Título' },
    { property: 'irrfLabel', label: 'IRRF' },
  ];

  readonly rows = computed(() =>
    this.items().map((t) => ({
      ...t,
      bancoLabel: BANCO_NOMES[t.banco] ?? t.banco,
      statusLabel:
        t.status === 'aberto' ? 'Aberto' : t.status === 'baixado' ? 'Baixado' : 'Parc. Baixado',
      alertaLabel: t.alerta ? '!' : '',
      valorLabel: formatBrl(t.valor),
      irrfLabel: formatBrl(t.irrf),
      $selected: this.selecionados().has(t.id),
    })),
  );
  readonly paginaAtual = computed(() => paginaDe(this.rows(), this.pagina(), this.tamanho()));

  iconFor(banco: string): string {
    return BANCO_ICONS[banco] ?? '';
  }

  nomeFor(banco: string): string {
    return BANCO_NOMES[banco] ?? banco;
  }

  constructor() {
    afterEveryRender(() => {
      this.markAtrasadoRows();
    });
    effect(() => {
      this.items();
      this.busca();
      this.pagina.set(1);
    });
  }

  onPagina(pagina: number): void {
    this.pagina.set(pagina);
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

  onSelect(row: TituloReceber): void {
    this.toggleSelecao.emit(row.id);
  }

  onUnselect(row: TituloReceber): void {
    this.toggleSelecao.emit(row.id);
  }

  private markAtrasadoRows(): void {
    const root = this.host.nativeElement as HTMLElement;
    const bodyRows = Array.from(root.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
    const data = this.paginaAtual();
    bodyRows.forEach((tr, i) => {
      tr.classList.toggle('js-atrasado-row', !!data[i]?.atrasado);
    });
  }
}
