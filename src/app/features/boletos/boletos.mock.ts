import { AcaoSidebar, BancoCadastro, BoletosMock, ClienteCadastro, TaxaMoeda, TituloPagar, TituloReceber } from './boletos.model';
import { bancoVazio } from './bancos.logic';
import { tituloPagarVazio } from './titulos-pagar.logic';

const COMUM = {
  filial: '0101',
  prefixo: 'TST',
  tipo: 'BOL',
  cliente: '000097',
  loja: '01',
  nomeCliente: 'GUILHERME',
  irrf: 0,
  bordero: false,
  adiantamento: false,
  alerta: false,
} as const;

function titulo(
  partial: Omit<TituloReceber, keyof typeof COMUM | 'atrasado'> &
    Partial<typeof COMUM> & { atrasado?: boolean },
): TituloReceber {
  return { ...COMUM, atrasado: false, ...partial };
}

const ACTIONS: AcaoSidebar[] = [
  {
    id: 'titulos',
    label: 'Títulos',
    children: [
      { id: 'baixar-titulo', label: 'Baixar Título' },
      { id: 'cancela-baixa', label: 'Cancela Baixa' },
      { id: 'titulos-a-receber', label: 'Títulos a Receber' },
      { id: 'titulos-a-pagar', label: 'Títulos a Pagar' },
      { id: 'compensar-ncc-ra', label: 'Compensar NCC/RA' },
    ],
  },
  {
    id: 'boletos',
    label: 'Boletos',
    children: [
      { id: 'gerar-boleto', label: 'Gerar Boleto' },
      { id: 'enviar-boleto', label: 'Enviar Boleto' },
      { id: 'cancelar-boleto', label: 'Cancelar Boleto' },
      { id: 'baixar-boleto', label: 'Baixar Boleto' },
    ],
  },
  {
    id: 'conciliacao',
    label: 'Conciliação',
    children: [
      { id: 'conciliar', label: 'Conciliar' },
      { id: 'estorno-concil', label: 'Estorno conciliação' },
    ],
  },
  {
    id: 'bancos',
    label: 'Bancos',
    children: [{ id: 'cadastra-banco', label: 'Cadastrar banco' }],
  },
  {
    id: 'cliente-grupo',
    label: 'Cliente',
    children: [
      { id: 'cliente', label: 'Cliente' },
      { id: 'posicao-cliente', label: 'Posição Cliente' },
    ],
  },
  { id: 'retorno-api', label: 'Retorno API' },
  { id: 'pedidos-em-aberto', label: 'Pedidos Em Aberto' },
  { id: 'faturamento', label: 'Faturamento' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'moedas', label: 'Moedas' },
];

export const BANCOS_MOCK: BancoCadastro[] = [
  {
    ...bancoVazio(),
    codigo: '341',
    nome: 'Itaú Unibanco S.A.',
    nomeReduzido: 'Itaú',
    agencia: '0934',
    dvAgencia: '5',
    conta: '12345',
    dvConta: '6',
  },
  {
    ...bancoVazio(),
    codigo: '033',
    nome: 'Banco Santander (Brasil) S.A.',
    nomeReduzido: 'Santander',
    agencia: '2271',
    dvAgencia: '0',
    conta: '01020304',
    dvConta: '5',
  },
  {
    ...bancoVazio(),
    codigo: '001',
    nome: 'Banco do Brasil S.A.',
    nomeReduzido: 'Banco Brasil',
    agencia: '1607',
    dvAgencia: '1',
    conta: '99887',
    dvConta: '3',
  },
  {
    ...bancoVazio(),
    codigo: '422',
    nome: 'Banco Safra S.A.',
    nomeReduzido: 'Safra',
    agencia: '0012',
    dvAgencia: '8',
    conta: '556677',
    dvConta: '1',
  },
  {
    ...bancoVazio(),
    codigo: '237',
    nome: 'Banco Bradesco S.A.',
    nomeReduzido: 'Bradesco',
    agencia: '3390',
    dvAgencia: '2',
    conta: '112233',
    dvConta: '4',
  },
  {
    ...bancoVazio(),
    codigo: '104',
    nome: 'Caixa Econômica Federal',
    nomeReduzido: 'Caixa',
    agencia: '0123',
    dvAgencia: '0',
    conta: '00044889',
    dvConta: '7',
  },
];

function tituloPagar(
  partial: Partial<TituloPagar> &
    Pick<
      TituloPagar,
      | 'id'
      | 'filial'
      | 'prefixo'
      | 'numero'
      | 'parcela'
      | 'tipo'
      | 'natureza'
      | 'fornecedor'
      | 'loja'
      | 'nomeFornecedor'
      | 'emissao'
      | 'vencimento'
      | 'valor'
      | 'saldo'
    >,
): TituloPagar {
  return {
    ...tituloPagarVazio(),
    ...partial,
    vencimentoReal: partial.vencimentoReal ?? partial.vencimento,
    valorRs: partial.valorRs ?? partial.valor,
  };
}

export const CLIENTES_MOCK: ClienteCadastro[] = [
  {
    id: 'c01',
    filial: 'D MG - MINAS GERAIS',
    codigo: '000001',
    loja: '01',
    nome: 'CLIENTE PADRAO',
    nFantasia: 'CLIENTE PADRAO',
    tipo: 'Cons Final',
    ddi: '',
    regiao: '',
    codAbics: '',
    boletoEmail: '',
  },
  {
    id: 'c02',
    filial: '0101',
    codigo: '000097',
    loja: '01',
    nome: 'GUILHERME',
    nFantasia: 'GUILHERME',
    tipo: 'Cons Final',
    ddi: '',
    regiao: '',
    codAbics: '',
    boletoEmail: '',
  },
  {
    id: 'c03',
    filial: '0101',
    codigo: '000123',
    loja: '01',
    nome: 'FORNECEDOR ALPHA LTDA',
    nFantasia: 'ALPHA',
    tipo: 'Solidario',
    ddi: '',
    regiao: 'SUL',
    codAbics: '',
    boletoEmail: '',
  },
  {
    id: 'c04',
    filial: '0101',
    codigo: '000456',
    loja: '01',
    nome: 'BETA SERVICOS S.A.',
    nFantasia: 'BETA',
    tipo: 'Cons Final',
    ddi: '55',
    regiao: '',
    codAbics: '',
    boletoEmail: 'S',
  },
  {
    id: 'c05',
    filial: 'D SP 01',
    codigo: '000789',
    loja: '02',
    nome: 'GAMA DISTRIBUIDORA',
    nFantasia: 'GAMA',
    tipo: 'Cons Final',
    ddi: '',
    regiao: 'SUDESTE',
    codAbics: '',
    boletoEmail: '',
  },
];

export const TITULOS_PAGAR_MOCK: TituloPagar[] = [
  tituloPagar({
    id: 'p01', filial: '0101', prefixo: 'NF', numero: '000001234', parcela: '01', tipo: 'NF',
    natureza: '2001001', fornecedor: '000123', loja: '01', nomeFornecedor: 'FORNECEDOR ALPHA LTDA',
    emissao: '10/02/2025', vencimento: '10/03/2025', valor: 1500.5, saldo: 1500.5,
  }),
  tituloPagar({
    id: 'p02', filial: '0101', prefixo: 'NF', numero: '000001235', parcela: '01', tipo: 'NF',
    natureza: '2001001', fornecedor: '000123', loja: '01', nomeFornecedor: 'FORNECEDOR ALPHA LTDA',
    emissao: '10/02/2025', vencimento: '10/04/2025', valor: 1500.5, saldo: 800,
  }),
  tituloPagar({
    id: 'p03', filial: '0101', prefixo: 'BOL', numero: '000004100', parcela: '01', tipo: 'BOL',
    natureza: '2002002', fornecedor: '000456', loja: '01', nomeFornecedor: 'BETA SERVICOS S.A.',
    emissao: '01/03/2025', vencimento: '15/03/2025', valor: 320.9, saldo: 320.9,
  }),
  tituloPagar({
    id: 'p04', filial: '0101', prefixo: 'FT', numero: '000009900', parcela: 'A', tipo: 'FT',
    natureza: '2003003', fornecedor: '000789', loja: '02', nomeFornecedor: 'GAMA DISTRIBUIDORA',
    emissao: '20/03/2025', vencimento: '20/04/2025', valor: 9800, saldo: 9800,
  }),
  tituloPagar({
    id: 'p05', filial: '0101', prefixo: 'NF', numero: '000002010', parcela: '01', tipo: 'NF',
    natureza: '2001001', fornecedor: '000321', loja: '01', nomeFornecedor: 'DELTA ENERGIA LTDA',
    emissao: '05/03/2025', vencimento: '05/04/2025', valor: 245.33, saldo: 0,
  }),
  tituloPagar({
    id: 'p06', filial: '0101', prefixo: 'DP', numero: '000000088', parcela: '01', tipo: 'DP',
    natureza: '2004004', fornecedor: '000654', loja: '01', nomeFornecedor: 'EPSILON TRANSPORTES',
    emissao: '12/03/2025', vencimento: '12/04/2025', valor: 670, saldo: 670,
  }),
  tituloPagar({
    id: 'p07', filial: '0101', prefixo: 'NF', numero: '000003333', parcela: '02', tipo: 'NF',
    natureza: '2001001', fornecedor: '000123', loja: '01', nomeFornecedor: 'FORNECEDOR ALPHA LTDA',
    emissao: '28/03/2025', vencimento: '28/04/2025', valor: 99.99, saldo: 99.99,
  }),
];

function taxa(
  id: string,
  data: string,
  taxa2: number,
  taxa3 = taxa2,
  taxa4 = taxa2,
  taxa5 = taxa2,
  taxa6 = taxa2,
  taxa7 = taxa2,
): TaxaMoeda {
  return { id, data, taxa2, taxa3, taxa4, taxa5, taxa6, taxa7 };
}

export const MOEDAS_MOCK: TaxaMoeda[] = [
  taxa('m01', '/', 0, 0, 0, 0, 0.0003, 0),
  taxa('m02', '31/12/1899', 1),
  taxa('m03', '08/01/1900', 1),
  taxa('m04', '09/01/1900', 1),
  taxa('m05', '18/02/1920', 0),
  taxa('m06', '31/08/1987', 0),
  taxa('m07', '30/04/1988', 1.1081, 1, 1, 1, 1, 0),
  taxa('m08', '01/01/1990', 0),
  taxa('m09', '05/09/1995', 0),
  taxa('m10', '31/01/1987', 0),
  taxa('m11', '12/01/1988', 0, 0, 1.0234, 0, 0, 0),
  taxa('m12', '16/01/1988', 0, 0, 1.119, 0, 0, 0),
  taxa('m13', '01/01/2020', 0),
  taxa('m14', '02/03/2020', 0),
  taxa('m15', '22/03/2020', 0),
  taxa('m16', '02/10/2020', 0),
  taxa('m17', '30/06/2021', 0),
  taxa('m18', '14/08/2021', 0),
  taxa('m19', '01/11/2005', 0),
  taxa('m20', '12/11/2005', 0),
  taxa('m21', '21/11/2005', 0),
];

export const BOLETOS_MOCK: BoletosMock = {
  context: {
    servidor: 'TOTVS Serviços MSSQL Apresentacao',
    usuario: 'Administrador',
    data: '29/03/2025',
    empresa: 'FAS SOLUTIONS CONSULTING / FAS SOLUTIONS TECNOLOGIA DA INFORMAÇÃO',
  },
  actions: ACTIONS,
  titulos: [
    titulo({
      id: 't01', numero: '1000', parcela: '01', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '16/02/2025',
      vencimento: '18/02/2025', vencimentoReal: '18/02/2025', valor: 0.1,
      status: 'baixado', conciliado: true,
    }),
    titulo({
      id: 't02', numero: '19022025', parcela: '', natureza: '20200010',
      portador: '237', banco: 'bradesco', emissao: '19/02/2025',
      vencimento: '26/02/2025', vencimentoReal: '26/02/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't03', numero: '2000', parcela: '', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '17/02/2025',
      vencimento: '20/02/2025', vencimentoReal: '20/02/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't04', numero: '20032025', parcela: '1', natureza: '20180011',
      portador: '341', banco: 'itau', emissao: '20/03/2025',
      vencimento: '03/04/2025', vencimentoReal: '03/04/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't05', numero: '20032025', parcela: '2', natureza: '20180012',
      portador: '104', banco: 'caixa', emissao: '20/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't06', numero: '26022025', parcela: '', natureza: '20200010',
      portador: '', banco: '', emissao: '26/02/2025',
      vencimento: '05/03/2025', vencimentoReal: '05/03/2025', valor: 0.1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't07', numero: '26022025', parcela: '01', natureza: '20100012',
      portador: '', banco: '', emissao: '26/02/2025',
      vencimento: '12/03/2025', vencimentoReal: '12/03/2025', valor: 0.01,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't08', numero: '26022025', parcela: '01', natureza: '20100012',
      portador: '341', banco: 'itau', emissao: '26/02/2025',
      vencimento: '12/03/2025', vencimentoReal: '12/03/2025', valor: 10,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't09', numero: '29032025', parcela: '', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 10,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't10', numero: '29032025', parcela: '02', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 100,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't11', numero: '29032025', parcela: '03', natureza: '20200010',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 150,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't12', numero: '29032025', parcela: '05', natureza: '20200011',
      portador: '341', banco: 'itau', emissao: '29/03/2025',
      vencimento: '10/04/2025', vencimentoReal: '10/04/2025', valor: 1,
      status: 'aberto', conciliado: false,
    }),
    titulo({
      id: 't13', numero: '29032025', parcela: '06', natureza: '20200010',
      portador: '', banco: '', emissao: '29/03/2025',
      vencimento: '18/04/2025', vencimentoReal: '18/04/2025', valor: 1,
      status: 'aberto', conciliado: false, atrasado: true,
    }),
  ],
};
