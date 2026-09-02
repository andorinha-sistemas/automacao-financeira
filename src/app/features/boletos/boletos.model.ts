export type BancoCodigo = 'itau' | 'santander' | 'bb' | 'safra' | '';
export type TituloStatus = 'aberto' | 'parcBaixado' | 'baixado';

export interface TituloReceber {
  id: string;
  filial: string;
  prefixo: string;
  numero: string;
  parcela: string;
  tipo: string;
  natureza: string;
  portador: string;
  banco: BancoCodigo;
  cliente: string;
  loja: string;
  nomeCliente: string;
  emissao: string;
  vencimento: string;
  vencimentoReal: string;
  valor: number;
  irrf: number;
  status: TituloStatus;
  bordero: boolean;
  adiantamento: boolean;
  conciliado: boolean;
  alerta: boolean;
  atrasado: boolean;
}

export interface FiltrosRapidos {
  todos: boolean;
  aberto: boolean;
  parcBaixado: boolean;
  baixado: boolean;
  comBordero: boolean;
  semBordero: boolean;
  adiantamento: boolean;
  conciliado: boolean;
  naoConciliado: boolean;
  itau: boolean;
  santander: boolean;
  bb: boolean;
  safra: boolean;
}

export const FILTROS_INICIAIS: FiltrosRapidos = {
  todos: true,
  aberto: false,
  parcBaixado: false,
  baixado: false,
  comBordero: false,
  semBordero: false,
  adiantamento: false,
  conciliado: false,
  naoConciliado: false,
  itau: false,
  santander: false,
  bb: false,
  safra: false,
};

export interface AcaoSidebar {
  id: string;
  label: string;
}

export interface BoletosContexto {
  servidor: string;
  usuario: string;
  data: string;
  empresa: string;
}

export interface TotaisBoletos {
  contagem: number;
  total: number;
  aberto: number;
  baixado: number;
  conciliado: number;
  naoConciliado: number;
  marcado: number;
}

export interface BoletosMock {
  context: BoletosContexto;
  actions: AcaoSidebar[];
  titulos: TituloReceber[];
}
