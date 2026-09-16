import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoNotificationService } from '@po-ui/ng-components';

import { TituloReceber } from '../../boletos.model';
import { filtrarTitulosReceber } from '../../titulos-receber.logic';
import { TitlesTable } from '../titles-table/titles-table';

@Component({
  selector: 'app-titulos-receber-page',
  imports: [FormsModule, PoFieldModule, PoButtonModule, TitlesTable],
  templateUrl: './titulos-receber-page.html',
  styleUrl: './titulos-receber-page.css',
})
export class TitulosReceberPage {
  private readonly notify = inject(PoNotificationService, { optional: true });

  readonly titulos = input.required<TituloReceber[]>();
  readonly voltar = output<void>();

  readonly busca = signal('');
  readonly menuAberto = signal(false);
  readonly selecionados = signal<ReadonlySet<string>>(new Set());
  readonly visiveis = computed(() => filtrarTitulosReceber(this.titulos() ?? [], this.busca()));

  readonly outrasAcoes = [
    'Pesquisar',
    'Legenda',
    'Incluir',
    'Alterar',
    'Visualizar',
    'Excluir',
    'Compensação',
    'Liquidação',
    'Imprimir Browse',
  ];

  onToggleSelecao(id: string): void {
    const next = new Set(this.selecionados());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selecionados.set(next);
  }

  onAcaoBarra(acao: string): void {
    this.notify?.information(`Mock: ${acao}`);
  }

  onOutraAcao(item: string): void {
    this.menuAberto.set(false);
    if (item === 'Pesquisar') {
      const inputEl = document.querySelector('.receber__tools input') as HTMLInputElement | null;
      inputEl?.focus();
      return;
    }
    if ((item === 'Excluir' || item === 'Alterar' || item === 'Visualizar') && this.selecionados().size !== 1) {
      this.notify?.warning('Selecione um título.');
      return;
    }
    this.notify?.information(`Mock: ${item}`);
  }
}
