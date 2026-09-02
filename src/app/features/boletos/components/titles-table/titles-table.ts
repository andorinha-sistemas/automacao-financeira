import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { formatBrl } from '../../boletos.logic';
import { TituloReceber } from '../../boletos.model';

@Component({
  selector: 'app-titles-table',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule],
  templateUrl: './titles-table.html',
  styleUrl: './titles-table.css',
})
export class TitlesTable {
  readonly items = input.required<TituloReceber[]>();
  readonly selecionados = input.required<ReadonlySet<string>>();
  readonly busca = input.required<string>();
  readonly filtrosAplicados = input.required<boolean>();
  readonly buscaChange = output<string>();
  readonly limparFiltros = output<void>();
  readonly toggleSelecao = output<string>();

  readonly formatBrl = formatBrl;

  readonly columns: PoTableColumn[] = [
    { property: 'atrasadoFlag', label: ' ', width: '24px', type: 'columnTemplate' },
    { property: 'bancoLabel', label: 'Banco', width: '70px' },
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
      atrasadoFlag: t.atrasado ? '•' : '',
      bancoLabel: t.banco === 'itau' ? 'Itaú' : t.banco,
      statusLabel:
        t.status === 'aberto' ? 'Aberto' : t.status === 'baixado' ? 'Baixado' : 'Parc. Baixado',
      alertaLabel: t.alerta ? '!' : '',
      valorLabel: formatBrl(t.valor),
      irrfLabel: formatBrl(t.irrf),
      $selected: this.selecionados().has(t.id),
    })),
  );

  onSelect(row: TituloReceber): void {
    this.toggleSelecao.emit(row.id);
  }

  onUnselect(row: TituloReceber): void {
    this.toggleSelecao.emit(row.id);
  }
}
