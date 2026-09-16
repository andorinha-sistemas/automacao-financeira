import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { bancoVazio, filtrarBancos } from '../../bancos.logic';
import { BancoCadastro, ModoFichaBanco } from '../../boletos.model';
import { paginaDe, TAMANHO_PAGINA, totalPaginas } from '../../table-page';
import { TablePageSizeDirective } from '../../table-page-size.directive';
import { TablePager } from '../table-pager/table-pager';
import { TableResizeDirective } from '../../table-resize.directive';

@Component({
  selector: 'app-bancos-page',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule, TableResizeDirective, TablePageSizeDirective, TablePager],
  templateUrl: './bancos-page.html',
  styleUrl: './bancos-page.css',
})
export class BancosPage {
  readonly bancos = input.required<BancoCadastro[]>();
  readonly tela = input.required<'bancos-browse' | 'bancos-form'>();
  readonly modoFicha = input<ModoFichaBanco>('incluir');
  readonly rascunho = input<BancoCadastro | null>(null);
  readonly voltar = output<void>();
  readonly incluir = output<void>();
  readonly alterar = output<BancoCadastro | undefined>();
  readonly visualizar = output<BancoCadastro | undefined>();
  readonly excluir = output<BancoCadastro | undefined>();
  readonly gravar = output<BancoCadastro>();
  readonly cancelarFicha = output<void>();

  readonly busca = signal('');
  readonly pagina = signal(1);
  readonly tamanho = signal(TAMANHO_PAGINA);
  readonly selecionado = signal<BancoCadastro | null>(null);
  readonly ficha = signal(bancoVazio());

  readonly visiveis = computed(() => filtrarBancos(this.bancos(), this.busca()));
  readonly paginaAtual = computed(() => paginaDe(this.visiveis(), this.pagina(), this.tamanho()));
  readonly tituloFicha = computed(() => {
    const modo = this.modoFicha();
    if (modo === 'alterar') {
      return 'Bancos - ALTERAR';
    }
    if (modo === 'visualizar') {
      return 'Bancos - VISUALIZAR';
    }
    return 'Bancos - INCLUIR';
  });
  readonly somenteLeitura = computed(() => this.modoFicha() === 'visualizar');
  readonly codigoTravado = computed(() => this.modoFicha() !== 'incluir');
  readonly aba = signal('cadastrais');
  readonly abas = [
    { id: 'cadastrais', label: 'Cadastrais' },
    { id: 'comunicacao', label: 'Comunicação Online' },
    { id: 'movimentos', label: 'Movimentos' },
    { id: 'contabil', label: 'Contábil' },
    { id: 'integracoes', label: 'Integrações' },
    { id: 'outros', label: 'Outros' },
  ];
  readonly opcoesTitularidade = [
    { label: '1 - Própria', value: '1' },
    { label: '2 - Outra', value: '2' },
  ];
  readonly opcoesBloqueado = [
    { label: '1 - Sim', value: '1' },
    { label: '2 - Não', value: '2' },
  ];
  readonly opcoesSimNao = [
    { label: '1 - Sim', value: '1' },
    { label: '2 - Não', value: '2' },
  ];

  readonly columns: PoTableColumn[] = [
    { property: 'filial', label: 'Filial', width: '90px' },
    { property: 'codigo', label: 'Código', width: '90px' },
    { property: 'nome', label: 'Nome' },
    { property: 'nomeReduzido', label: 'Nome reduzido' },
    { property: 'agencia', label: 'Agência', width: '100px' },
    { property: 'conta', label: 'Conta', width: '120px' },
  ];

  constructor() {
    effect(() => {
      const r = this.rascunho();
      this.ficha.set(r ? { ...r } : bancoVazio());
    });
    effect(() => {
      this.busca();
      this.bancos();
      this.pagina.set(1);
    });
  }

  patch(campo: keyof BancoCadastro, valor: string): void {
    this.ficha.update((atual) => ({ ...atual, [campo]: valor }));
  }

  onSelect(row: BancoCadastro): void {
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

  onAlterar(): void {
    this.alterar.emit(this.selecionado() ?? undefined);
  }

  onVisualizar(): void {
    this.visualizar.emit(this.selecionado() ?? undefined);
  }

  onExcluir(): void {
    this.excluir.emit(this.selecionado() ?? undefined);
  }
}
