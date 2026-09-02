import { describe, expect, it } from 'vitest';

import { BOLETOS_MOCK } from './boletos.mock';

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
    expect(BOLETOS_MOCK.actions).toHaveLength(20);
    expect(BOLETOS_MOCK.context.usuario).toBe('Administrador');
  });
});
