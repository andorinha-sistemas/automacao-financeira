import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoNotificationService, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { ClienteCadastro } from '../../boletos.model';
import { filtrarClientes } from '../../clientes.logic';
import { paginaDe, TAMANHO_PAGINA, totalPaginas } from '../../table-page';
import { TablePageSizeDirective } from '../../table-page-size.directive';
import { TablePager } from '../table-pager/table-pager';
import { TableResizeDirective } from '../../table-resize.directive';

@Component({
  selector: 'app-clientes-page',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule, TableResizeDirective, TablePageSizeDirective, TablePager],
  templateUrl: './clientes-page.html',
  styleUrl: './clientes-page.css',
})
export class ClientesPage {
  private readonly notify = inject(PoNotificationService, { optional: true });

  readonly clientes = input.required<ClienteCadastro[]>();
  readonly voltar = output<void>();

  readonly busca = signal('');
  readonly pagina = signal(1);
  readonly tamanho = signal(TAMANHO_PAGINA);
  readonly menuAberto = signal(false);
  readonly selecionado = signal<ClienteCadastro | null>(null);
  readonly visiveis = computed(() => filtrarClientes(this.clientes() ?? [], this.busca()));
  readonly paginaAtual = computed(() => paginaDe(this.visiveis(), this.pagina(), this.tamanho()));

  readonly outrasAcoes = [
    'Pesquisar',
    'Excluir',
    'Facilitador',
    'SubClientes',
    'Conhecimento',
    'Referencias',
    'Contatos',
    'Suspensão - REINF',
    'Privilégios',
    'Perfil',
    'Perfil_360',
    'Imprimir Browse',
  ];

  readonly columns: PoTableColumn[] = [
    { property: 'filial', label: 'Filial' },
    { property: 'codigo', label: 'Codigo', width: '90px' },
    { property: 'loja', label: 'Loja', width: '70px' },
    { property: 'nome', label: 'Nome' },
    { property: 'nFantasia', label: 'N Fantasia' },
    { property: 'tipo', label: 'Tipo', width: '110px' },
    { property: 'ddi', label: 'DDI', width: '70px' },
    { property: 'regiao', label: 'Regiao', width: '100px' },
    { property: 'codAbics', label: 'Cod. Abics', width: '110px' },
    { property: 'boletoEmail', label: 'Boleto Email', width: '120px' },
  ];

  onSelect(row: ClienteCadastro): void {
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
    const max = totalPaginas(this.visiveis().length, n);
    if (this.pagina() > max) {
      this.pagina.set(max);
    }
  }

  constructor() {
    effect(() => {
      this.busca();
      this.clientes();
      this.pagina.set(1);
    });
  }

  onIncluir(): void {
    this.notify?.information('Mock: Incluir');
  }

  onAlterar(): void {
    if (!this.selecionado()) {
      this.notify?.warning('Selecione um cliente.');
      return;
    }
    this.notify?.information('Mock: Alterar');
  }

  onVisualizar(): void {
    if (!this.selecionado()) {
      this.notify?.warning('Selecione um cliente.');
      return;
    }
    this.notify?.information('Mock: Visualizar');
  }

  onOutraAcao(item: string): void {
    this.menuAberto.set(false);
    if (item === 'Pesquisar') {
      const inputEl = document.querySelector('.clientes__tools input') as HTMLInputElement | null;
      inputEl?.focus();
      return;
    }
    if ((item === 'Excluir' || item === 'SubClientes' || item === 'Contatos') && !this.selecionado()) {
      this.notify?.warning('Selecione um cliente.');
      return;
    }
    this.notify?.information(`Mock: ${item}`);
  }
}
