import { AcaoSidebar, BoletosMock, TituloReceber } from './boletos.model';

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
  { id: 'filtro-central', label: 'Filtro Central' },
  { id: 'titulo', label: 'Título' },
  { id: 'gerar-boleto', label: 'Gerar Boleto' },
  { id: 'enviar-boleto', label: 'Enviar Boleto' },
  { id: 'cancelar-boleto', label: 'Cancelar Boleto' },
  { id: 'baixar-titulo', label: 'Baixar Título' },
  { id: 'cancela-baixa', label: 'Cancela Baixa' },
  { id: 'conciliar', label: 'Conciliar' },
  { id: 'estorno-concil', label: 'Estorno Concil' },
  { id: 'itau', label: 'Itaú' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'retorno-api', label: 'Retorno API' },
  { id: 'posicao-cliente', label: 'Posição Cliente' },
  { id: 'tit-aberto', label: 'Tít Aberto' },
  { id: 'tit-recebidos', label: 'Tít Recebidos' },
  { id: 'pedidos-em-aberto', label: 'Pedidos Em Aberto' },
  { id: 'faturamento', label: 'Faturamento' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'compensar-ncc-ra', label: 'Compensar NCC/RA' },
  { id: 'moedas', label: 'Moedas' },
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
      portador: '', banco: '', emissao: '19/02/2025',
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
      portador: '', banco: '', emissao: '20/03/2025',
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
