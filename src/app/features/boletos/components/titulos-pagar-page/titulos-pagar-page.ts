import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoNotificationService, PoTableColumn, PoTableModule } from '@po-ui/ng-components';

import { formatBrl } from '../../boletos.logic';
import { ModoFicha, TituloPagar } from '../../boletos.model';
import { paginaDe, TAMANHO_PAGINA, totalPaginas } from '../../table-page';
import { TablePageSizeDirective } from '../../table-page-size.directive';
import { TablePager } from '../table-pager/table-pager';
import { TableResizeDirective } from '../../table-resize.directive';
import { filtrarTitulosPagar, tituloPagarVazio } from '../../titulos-pagar.logic';

function parseBrl(raw: string): number {
  const n = Number(String(raw).replace(/\./g, '').replace(',', '.').trim());
  return Number.isFinite(n) ? n : 0;
}

@Component({
  selector: 'app-titulos-pagar-page',
  imports: [FormsModule, PoTableModule, PoFieldModule, PoButtonModule, TableResizeDirective, TablePageSizeDirective, TablePager],
  templateUrl: './titulos-pagar-page.html',
  styleUrl: './titulos-pagar-page.css',
})
export class TitulosPagarPage {
  private readonly notify = inject(PoNotificationService, { optional: true });

  readonly titulos = input.required<TituloPagar[]>();
  readonly tela = input<'titulos-pagar' | 'titulos-pagar-form'>('titulos-pagar');
  readonly modoFicha = input<ModoFicha>('incluir');
  readonly rascunho = input<TituloPagar | null>(null);
  readonly voltar = output<void>();
  readonly incluir = output<void>();
  readonly alterar = output<TituloPagar | undefined>();
  readonly visualizar = output<TituloPagar | undefined>();
  readonly gravar = output<TituloPagar>();
  readonly cancelarFicha = output<void>();

  readonly busca = signal('');
  readonly pagina = signal(1);
  readonly tamanho = signal(TAMANHO_PAGINA);
  readonly menuAberto = signal(false);
  readonly selecionado = signal<TituloPagar | null>(null);
  readonly ficha = signal(tituloPagarVazio());
  readonly aba = signal('dados');
  readonly saldoEditado = signal(false);
  readonly visiveis = computed(() => filtrarTitulosPagar(this.titulos() ?? [], this.busca()));
  readonly rows = computed(() =>
    this.visiveis().map((t) => {
      const situacao = t.saldo <= 0 ? 'baixado' : t.saldo < t.valor ? 'parcial' : 'aberto';
      return {
        ...t,
        valorLabel: formatBrl(t.valor),
        saldoLabel: formatBrl(t.saldo),
        situacao,
        situacaoLabel: situacao === 'aberto' ? 'Aberto' : situacao === 'parcial' ? 'Parcial' : 'Baixado',
      };
    }),
  );
  readonly paginaAtual = computed(() => paginaDe(this.rows(), this.pagina(), this.tamanho()));
  readonly somenteLeitura = computed(() => this.modoFicha() === 'visualizar');
  readonly chaveTravada = computed(() => this.modoFicha() !== 'incluir');
  readonly opcoesSimNao = [
    { label: '1 - Sim', value: '1' },
    { label: '2 - Não', value: '2' },
  ];
  readonly opcoesFormRetIss = [
    { label: '1 - Cons Vlr Min.', value: '1' },
    { label: '2 - Não Cons.', value: '2' },
  ];
  readonly opcoesSN = [
    { label: 'S - Sim', value: 'S' },
    { label: 'N - Não', value: 'N' },
  ];
  readonly opcoesModPagto = [
    { label: '1 - TED', value: '1' },
    { label: '2 - DOC', value: '2' },
    { label: '3 - PIX', value: '3' },
    { label: '4 - Boleto', value: '4' },
  ];
  readonly opcoesDescP100 = [
    { label: '0 - Condicional', value: '0' },
    { label: '1 - Incondicional', value: '1' },
  ];

  readonly abas = [
    { id: 'dados', label: 'Dados Gerais' },
    { id: 'impostos', label: 'Impostos' },
    { id: 'administrativo', label: 'Administrativo' },
    { id: 'banco', label: 'Banco' },
    { id: 'contabil', label: 'Contábil' },
    { id: 'outros', label: 'Outros' },
  ];

  readonly outrasAcoes = [
    'Pesquisar',
    'Excluir',
    'Substituição de Provisórios',
    'Canc. Desdobr.',
    'Vis Rateio',
    'Agendamento',
    'Conhecimento',
    'Legenda',
    'Histórico do Título',
    'Tracker Contábil',
    'Documentos',
    'Rastr. Contrato',
    'Conversão em Lote de Adtos Viagem',
    'Complemento do Título',
    'Facilitador',
    'Consulta de Retenções',
    'Valores Acessórios',
    'Imprimir Browse',
  ];

  readonly columns: PoTableColumn[] = [
    { property: 'situacao', label: '', width: '44px', type: 'columnTemplate' },
    { property: 'filial', label: 'Filial', width: '80px' },
    { property: 'prefixo', label: 'Prefixo', width: '80px' },
    { property: 'numero', label: 'Nº Título', width: '120px' },
    { property: 'parcela', label: 'Parcela', width: '80px' },
    { property: 'tipo', label: 'Tipo', width: '70px' },
    { property: 'natureza', label: 'Natureza', width: '110px' },
    { property: 'fornecedor', label: 'Fornecedor', width: '110px' },
    { property: 'loja', label: 'Loja', width: '70px' },
    { property: 'nomeFornecedor', label: 'Nome' },
    { property: 'emissao', label: 'Emissão', width: '110px' },
    { property: 'vencimento', label: 'Vencimento', width: '110px' },
    { property: 'valorLabel', label: 'Valor', width: '110px' },
    { property: 'saldoLabel', label: 'Saldo', width: '110px' },
  ];

  constructor() {
    effect(() => {
      const r = this.rascunho();
      this.ficha.set(r ? { ...r } : tituloPagarVazio());
      this.aba.set('dados');
      this.saldoEditado.set(false);
    });
    effect(() => {
      this.busca();
      this.titulos();
      this.pagina.set(1);
    });
  }

  money(n: number): string {
    return formatBrl(n);
  }

  taxa(n: number): string {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n);
  }

  patch(campo: keyof TituloPagar, valor: string): void {
    this.ficha.update((atual) => ({ ...atual, [campo]: valor }));
  }

  patchValor(raw: string): void {
    const valor = parseBrl(raw);
    this.ficha.update((atual) => ({
      ...atual,
      valor,
      saldo: this.saldoEditado() ? atual.saldo : valor,
      valorRs: atual.moeda.trim() === '1' ? valor : atual.valorRs,
    }));
  }

  patchSaldo(raw: string): void {
    this.saldoEditado.set(true);
    this.ficha.update((atual) => ({ ...atual, saldo: parseBrl(raw) }));
  }

  patchMoeda(valor: string): void {
    this.ficha.update((atual) => ({
      ...atual,
      moeda: valor,
      valorRs: valor.trim() === '1' ? atual.valor : atual.valorRs,
    }));
  }

  onSelect(row: TituloPagar): void {
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

  onIncluir(): void {
    this.incluir.emit();
  }

  onAlterar(): void {
    this.alterar.emit(this.selecionado() ?? undefined);
  }

  onVisualizar(): void {
    this.visualizar.emit(this.selecionado() ?? undefined);
  }

  onAcaoBarra(acao: string): void {
    this.notify?.information(`Mock: ${acao}`);
  }

  onOutraAcao(item: string): void {
    this.menuAberto.set(false);
    if (item === 'Pesquisar') {
      const inputEl = document.querySelector('.pagar__tools input') as HTMLInputElement | null;
      inputEl?.focus();
      return;
    }
    if ((item === 'Excluir' || item === 'Histórico do Título') && !this.selecionado()) {
      this.notify?.warning('Selecione um título.');
      return;
    }
    this.notify?.information(`Mock: ${item}`);
  }

  onOutrasAcoesFicha(): void {
    this.notify?.information('Mock: Outras Ações');
  }

  onPesquisa(campo: string): void {
    this.notify?.information(`Mock: Pesquisa ${campo}`);
  }

  onGravar(): void {
    this.gravar.emit(this.ficha());
  }
}
