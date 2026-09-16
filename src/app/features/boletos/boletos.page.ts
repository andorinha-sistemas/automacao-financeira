import { Component, computed, inject, signal } from '@angular/core';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';

import {
  aplicarFiltroRapido,
  calcularTotais,
  filtrarTitulos,
  temFiltroAplicado,
} from './boletos.logic';
import { bancoVazio, validarGravacaoBanco } from './bancos.logic';
import {
  alterarTituloPagar,
  incluirTituloPagar,
  tituloPagarVazio,
  validarGravacaoTituloPagar,
} from './titulos-pagar.logic';
import { BANCOS_MOCK, BOLETOS_MOCK, CLIENTES_MOCK, MOEDAS_MOCK, TITULOS_PAGAR_MOCK } from './boletos.mock';
import {
  AcaoSidebar,
  BancoCadastro,
  ClienteCadastro,
  FILTROS_INICIAIS,
  FiltrosRapidos,
  ModoFicha,
  ModoFichaBanco,
  TelaAtiva,
  TituloPagar,
  TituloReceber,
  TaxaMoeda,
} from './boletos.model';
import { BanksApi } from './banks.api';
import { mensagemApi } from './plug.mapper';
import { ReceivablesApi } from './receivables.api';
import { ActionSidebar } from './components/action-sidebar/action-sidebar';
import { AppHeader } from './components/app-header/app-header';
import { BancosPage } from './components/bancos-page/bancos-page';
import { ClientesPage } from './components/clientes-page/clientes-page';
import { MoedasPage } from './components/moedas-page/moedas-page';
import { QuickFilters, FILTROS_BANCOS_OPTIONS } from './components/quick-filters/quick-filters';
import { TitlesTable } from './components/titles-table/titles-table';
import { TitulosPagarPage } from './components/titulos-pagar-page/titulos-pagar-page';
import { TitulosReceberPage } from './components/titulos-receber-page/titulos-receber-page';
import { TotalsBar } from './components/totals-bar/totals-bar';

@Component({
  selector: 'app-boletos-page',
  imports: [AppHeader, ActionSidebar, BancosPage, ClientesPage, MoedasPage, TitulosPagarPage, TitulosReceberPage, QuickFilters, TitlesTable, TotalsBar],
  templateUrl: './boletos.page.html',
  styleUrl: './boletos.page.css',
})
export class BoletosPage {
  private readonly notify = inject(PoNotificationService);
  private readonly poDialog = inject(PoDialogService);
  private readonly banksApi = inject(BanksApi);
  private readonly receivablesApi = inject(ReceivablesApi);

  readonly mock = BOLETOS_MOCK;
  readonly titulos = BOLETOS_MOCK.titulos;
  readonly acoes = BOLETOS_MOCK.actions;
  readonly filtrosBancos = FILTROS_BANCOS_OPTIONS;
  readonly filtros = signal<FiltrosRapidos>({ ...FILTROS_INICIAIS });
  readonly busca = signal('');
  readonly selecionados = signal<Set<string>>(new Set(['t13']));
  readonly telaAtiva = signal<TelaAtiva>('boletos');
  readonly titulosPagar = signal<TituloPagar[]>([...TITULOS_PAGAR_MOCK]);
  readonly titulosReceber = signal<TituloReceber[]>([...BOLETOS_MOCK.titulos]);
  readonly clientes = signal<ClienteCadastro[]>([...CLIENTES_MOCK]);
  readonly moedas = signal<TaxaMoeda[]>([...MOEDAS_MOCK]);
  readonly bancos = signal<BancoCadastro[]>([...BANCOS_MOCK]);
  readonly modoFicha = signal<ModoFichaBanco>('incluir');
  readonly rascunho = signal<BancoCadastro | null>(null);
  readonly modoFichaPagar = signal<ModoFicha>('incluir');
  readonly rascunhoPagar = signal<TituloPagar | null>(null);

  readonly telaBancos = computed(() => (this.telaAtiva() === 'bancos-form' ? 'bancos-form' : 'bancos-browse'));
  readonly telaPagar = computed(() =>
    this.telaAtiva() === 'titulos-pagar-form' ? 'titulos-pagar-form' : 'titulos-pagar',
  );

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
    if (action.id === 'cadastra-banco') {
      this.telaAtiva.set('bancos-browse');
      this.carregarBancos();
      return;
    }
    if (action.id === 'titulos-a-pagar') {
      this.telaAtiva.set('titulos-pagar');
      return;
    }
    if (action.id === 'titulos-a-receber') {
      this.telaAtiva.set('titulos-receber');
      this.carregarReceber();
      return;
    }
    if (action.id === 'cliente') {
      this.telaAtiva.set('clientes');
      return;
    }
    if (action.id === 'moedas') {
      this.telaAtiva.set('moedas');
      return;
    }
    if (
      action.children?.length ||
      action.id === 'titulos' ||
      action.id === 'boletos' ||
      action.id === 'conciliacao' ||
      action.id === 'bancos' ||
      action.id === 'cliente-grupo'
    ) {
      return;
    }
    this.telaAtiva.set('boletos');
    this.notify.information(`Mock: ${action.label}`);
  }

  onVoltarClientes(): void {
    this.telaAtiva.set('boletos');
  }

  onVoltarMoedas(): void {
    this.telaAtiva.set('boletos');
  }

  onVoltarTitulosReceber(): void {
    this.telaAtiva.set('boletos');
  }

  onVoltarTitulosPagar(): void {
    this.telaAtiva.set('boletos');
  }

  onIncluirTituloPagar(): void {
    this.modoFichaPagar.set('incluir');
    this.rascunhoPagar.set(tituloPagarVazio());
    this.telaAtiva.set('titulos-pagar-form');
  }

  onAlterarTituloPagar(titulo?: TituloPagar): void {
    if (!titulo) {
      this.notify.warning('Selecione um título.');
      return;
    }
    this.modoFichaPagar.set('alterar');
    this.rascunhoPagar.set({ ...titulo });
    this.telaAtiva.set('titulos-pagar-form');
  }

  onVisualizarTituloPagar(titulo?: TituloPagar): void {
    if (!titulo) {
      this.notify.warning('Selecione um título.');
      return;
    }
    this.modoFichaPagar.set('visualizar');
    this.rascunhoPagar.set({ ...titulo });
    this.telaAtiva.set('titulos-pagar-form');
  }

  onGravarTituloPagar(titulo: TituloPagar): void {
    const check = validarGravacaoTituloPagar(titulo, this.titulosPagar(), this.modoFichaPagar());
    if (!check.ok) {
      this.notify.warning(check.erro);
      return;
    }
    if (this.modoFichaPagar() === 'incluir') {
      this.titulosPagar.set(incluirTituloPagar(this.titulosPagar(), titulo));
    } else if (this.modoFichaPagar() === 'alterar') {
      this.titulosPagar.set(alterarTituloPagar(this.titulosPagar(), titulo));
    }
    this.telaAtiva.set('titulos-pagar');
  }

  onCancelarFichaPagar(): void {
    this.telaAtiva.set('titulos-pagar');
  }

  onVoltarBancos(): void {
    this.telaAtiva.set('boletos');
  }

  onIncluirBanco(): void {
    this.modoFicha.set('incluir');
    this.rascunho.set(bancoVazio());
    this.telaAtiva.set('bancos-form');
  }

  onAlterarBanco(banco?: BancoCadastro): void {
    if (!banco) {
      this.notify.warning('Selecione um banco.');
      return;
    }
    this.modoFicha.set('alterar');
    this.rascunho.set({ ...banco });
    this.telaAtiva.set('bancos-form');
  }

  onVisualizarBanco(banco?: BancoCadastro): void {
    if (!banco) {
      this.notify.warning('Selecione um banco.');
      return;
    }
    this.modoFicha.set('visualizar');
    this.rascunho.set({ ...banco });
    this.telaAtiva.set('bancos-form');
  }

  onGravarFicha(banco: BancoCadastro): void {
    const check = validarGravacaoBanco(banco, this.bancos(), this.modoFicha());
    if (!check.ok) {
      this.notify.warning(check.erro);
      return;
    }
    if (this.modoFicha() === 'visualizar') {
      this.telaAtiva.set('bancos-browse');
      return;
    }
    const req$ =
      this.modoFicha() === 'incluir' ? this.banksApi.create(banco) : this.banksApi.update(banco);
    req$.subscribe({
      next: () => {
        this.telaAtiva.set('bancos-browse');
        this.carregarBancos();
      },
      error: (err) => this.notify.warning(mensagemApi(err)),
    });
  }

  onCancelarFicha(): void {
    this.telaAtiva.set('bancos-browse');
  }

  onExcluirBanco(banco?: BancoCadastro): void {
    if (!banco) {
      this.notify.warning('Selecione um banco.');
      return;
    }
    this.poDialog.confirm({
      title: 'Excluir',
      message: `Confirma a exclusão do banco ${banco.codigo}?`,
      confirm: () =>
        this.banksApi.remove(banco.codigo).subscribe({
          next: () => this.carregarBancos(),
          error: (err) => this.notify.warning(mensagemApi(err)),
        }),
    });
  }

  onSair(): void {
    return;
  }

  private carregarBancos(): void {
    this.banksApi.list().subscribe({
      next: (items) => this.bancos.set(items),
      error: (err) => this.notify.warning(mensagemApi(err)),
    });
  }

  private carregarReceber(): void {
    this.receivablesApi.list().subscribe({
      next: (items) => this.titulosReceber.set(items),
      error: (err) => this.notify.warning(mensagemApi(err)),
    });
  }
}
