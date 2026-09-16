export type BancoCodigo = 'itau' | 'santander' | 'bb' | 'safra' | 'bradesco' | 'caixa' | '';
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
  vencido: boolean;
  conciliado: boolean;
  naoConciliado: boolean;
  bancosTodos: boolean;
  itau: boolean;
  santander: boolean;
  bb: boolean;
  safra: boolean;
  bradesco: boolean;
  caixa: boolean;
}

export const FILTROS_INICIAIS: FiltrosRapidos = {
  todos: true,
  aberto: false,
  parcBaixado: false,
  baixado: false,
  comBordero: false,
  semBordero: false,
  adiantamento: false,
  vencido: false,
  conciliado: false,
  naoConciliado: false,
  bancosTodos: true,
  itau: false,
  santander: false,
  bb: false,
  safra: false,
  bradesco: false,
  caixa: false,
};

export interface AcaoSidebar {
  id: string;
  label: string;
  children?: AcaoSidebar[];
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

export type TelaAtiva =
  | 'boletos'
  | 'bancos-browse'
  | 'bancos-form'
  | 'titulos-pagar'
  | 'titulos-pagar-form'
  | 'titulos-receber'
  | 'clientes'
  | 'moedas';

export interface TaxaMoeda {
  id: string;
  data: string;
  taxa2: number;
  taxa3: number;
  taxa4: number;
  taxa5: number;
  taxa6: number;
  taxa7: number;
}

export interface ClienteCadastro {
  id: string;
  filial: string;
  codigo: string;
  loja: string;
  nome: string;
  nFantasia: string;
  tipo: string;
  ddi: string;
  regiao: string;
  codAbics: string;
  boletoEmail: string;
}
export type ModoFicha = 'incluir' | 'alterar' | 'visualizar';
export type ModoFichaBanco = ModoFicha;

export interface TituloPagar {
  id: string;
  filial: string;
  prefixo: string;
  numero: string;
  parcela: string;
  tipo: string;
  natureza: string;
  fornecedor: string;
  loja: string;
  nomeFornecedor: string;
  emissao: string;
  vencimento: string;
  vencimentoReal: string;
  valor: number;
  saldo: number;
  historico: string;
  moeda: string;
  valorRs: number;
  taxaMoeda: number;
  codAprovacao: string;
  iss: string;
  irrf: string;
  inss: string;
  comDet: string;
  cdRetencao: string;
  sestSenat: string;
  cofins: string;
  pisPasep: string;
  csll: string;
  basePcc: string;
  vencIss: string;
  vlrAcServ: string;
  variacDctf: string;
  periodDctf: string;
  formRetIss: string;
  aplicVlMin: string;
  codAliqIss: string;
  baseIss: string;
  baseIrpf: string;
  cide: string;
  baseInss: string;
  codRetInss: string;
  percCide: string;
  idDarf: string;
  provInss: string;
  provIss: string;
  percFabov: string;
  vlFabov: string;
  percFacs: string;
  vlFacs: string;
  vlFamad: string;
  vlFumipeq: string;
  percFamad: string;
  percFumipeq: string;
  issRetido: string;
  codServIss: string;
  percIma: string;
  valorIma: string;
  taxaPerman: string;
  porcJuros: string;
  acrescimo: string;
  fluxoCaixa: string;
  desdobramento: string;
  aprovador: string;
  decrescimo: string;
  multNatur: string;
  txCorMoeda: string;
  dtSuspensao: string;
  possuiDesc: string;
  noSolicitacao: string;
  portador: string;
  modPagto: string;
  codBarras: string;
  dataAgend: string;
  linhaDig: string;
  bancoFor: string;
  agenciaFor: string;
  dvAgenciaFor: string;
  contaFor: string;
  dvContaFor: string;
  formaPgto: string;
  rateio: string;
  ctaContabil: string;
  seqDiario: string;
  codDiario: string;
  cCusto: string;
  rateioProj: string;
  codOrcam: string;
  numContrato: string;
  revisaoCont: string;
  numPlanilha: string;
  numCronogr: string;
  numParcelaCtr: string;
  codRda: string;
  bonificCtr: string;
  retencaoCtr: string;
  multaCtr: string;
  descontoCtr: string;
  procJudic: string;
  tpProcesso: string;
  codOperad: string;
  nomeOperad: string;
  itemContab: string;
  retInss: string;
  cnpjRet: string;
  descP100: string;
  classeValor: string;
  dtApuracao: string;
  entDeb05: string;
  entCred05: string;
  entDeb06: string;
  entCred06: string;
  entDeb07: string;
  entCred07: string;
  entDeb08: string;
  entCred08: string;
  entDeb09: string;
  entCred09: string;
  referencia: string;
  numMedicao: string;
  vlrRetIss: string;
}

export interface BancoCadastro {
  id: string;
  filial: string;
  codigo: string;
  agencia: string;
  dvAgencia: string;
  conta: string;
  dvConta: string;
  nome: string;
  nomeReduzido: string;
  bairro: string;
  municipio: string;
  cep: string;
  endereco: string;
  fax: string;
  telex: string;
  estado: string;
  telefone: string;
  caixaPostal: string;
  limCredito: string;
  moeda: string;
  contato: string;
  diasRetencao: string;
  paisBanco: string;
  correntista: string;
  fornecedor: string;
  cliente: string;
  lojaCliente: string;
  bloqueado: string;
  dtBloqueio: string;
  titularidade: string;
  lojaFornec: string;
  cpfCnpj: string;
  bcoOficial: string;
  paisConta: string;
  codIspb: string;
  codCedente: string;
  multaPix: string;
  diasExpPix: string;
  retDesconto: string;
  saldoAtual: string;
  txCobSimpl: string;
  taxaDesconto: string;
  contaContabil: string;
  entidadeFin: string;
  nroBanco: string;
  identExport: string;
  dadosIntern: string;
  entDeb05: string;
  entCred05: string;
  entDeb06: string;
  entCred06: string;
  entDeb07: string;
  entCred07: string;
  entDeb08: string;
  entCred08: string;
  entDeb09: string;
  entCred09: string;
  integra: string;
  cntTechFin: string;
  idTechFin: string;
}
