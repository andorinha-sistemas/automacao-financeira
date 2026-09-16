import { describe, expect, it } from 'vitest';

import { BANCOS_MOCK, BOLETOS_MOCK, CLIENTES_MOCK, MOEDAS_MOCK } from './boletos.mock';

function cents(n: number): number {
  return Math.round(n * 100);
}

describe('BOLETOS_MOCK', () => {
  it('has 13 titles that sum to 272.61 with t01 settled and t13 overdue', () => {
    const titulos = BOLETOS_MOCK.titulos;
    expect(titulos.map((t) => t.id)).toEqual([
      't01', 't02', 't03', 't04', 't05', 't06', 't07',
      't08', 't09', 't10', 't11', 't12', 't13',
    ]);
    expect(titulos.reduce((s, t) => s + cents(t.valor), 0)).toBe(27261);
    expect(titulos[0]).toMatchObject({
      numero: '1000',
      parcela: '01',
      status: 'baixado',
      conciliado: true,
      portador: '341',
      banco: 'itau',
    });
    expect(titulos[1]).toMatchObject({
      id: 't02',
      portador: '237',
      banco: 'bradesco',
    });
    expect(titulos[4]).toMatchObject({
      id: 't05',
      portador: '104',
      banco: 'caixa',
    });
    expect(titulos[12]).toMatchObject({
      id: 't13',
      numero: '29032025',
      parcela: '06',
      valor: 1,
      atrasado: true,
      portador: '',
      banco: '',
    });
    expect(titulos.every((t) => t.nomeCliente === 'GUILHERME')).toBe(true);
    expect(BOLETOS_MOCK.actions.map((a) => a.id)).toEqual([
      'titulos',
      'boletos',
      'conciliacao',
      'bancos',
      'cliente-grupo',
      'retorno-api',
      'pedidos-em-aberto',
      'faturamento',
      'natureza',
      'moedas',
    ]);
    expect(BOLETOS_MOCK.actions.find((a) => a.id === 'titulos')?.children?.map((c) => c.label)).toEqual([
      'Baixar Título',
      'Cancela Baixa',
      'Títulos a Receber',
      'Títulos a Pagar',
      'Compensar NCC/RA',
    ]);
    expect(BOLETOS_MOCK.actions.find((a) => a.id === 'boletos')?.children?.map((c) => c.label)).toEqual([
      'Gerar Boleto',
      'Enviar Boleto',
      'Cancelar Boleto',
      'Baixar Boleto',
    ]);
    expect(BOLETOS_MOCK.actions.find((a) => a.id === 'conciliacao')?.children?.map((c) => c.label)).toEqual([
      'Conciliar',
      'Estorno conciliação',
    ]);
    expect(BOLETOS_MOCK.actions.find((a) => a.id === 'bancos')?.children?.map((c) => c.label)).toEqual([
      'Cadastrar banco',
    ]);
    expect(BOLETOS_MOCK.context.usuario).toBe('Administrador');
    expect(BANCOS_MOCK.map((b) => b.codigo)).toEqual(['341', '033', '001', '422', '237', '104']);
    expect(CLIENTES_MOCK.map((c) => c.codigo)).toEqual(['000001', '000097', '000123', '000456', '000789']);
    expect(MOEDAS_MOCK.map((m) => m.data).slice(0, 3)).toEqual(['/', '31/12/1899', '08/01/1900']);
    expect(MOEDAS_MOCK.find((m) => m.data === '30/04/1988')?.taxa2).toBe(1.1081);
  });
});
