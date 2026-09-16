import { describe, expect, it } from 'vitest';

import { BOLETOS_MOCK } from './boletos.mock';
import { filtrarTitulosReceber, situacaoTituloReceber } from './titulos-receber.logic';

describe('filtrarTitulosReceber', () => {
  it('returns all titles when search is empty', () => {
    expect(filtrarTitulosReceber(BOLETOS_MOCK.titulos, '')).toEqual(BOLETOS_MOCK.titulos);
  });

  it('filters by number, prefix or customer name', () => {
    expect(filtrarTitulosReceber(BOLETOS_MOCK.titulos, '19022025').map((t) => t.numero)).toEqual(['19022025']);
    expect(filtrarTitulosReceber(BOLETOS_MOCK.titulos, 'guilherme').length).toBe(13);
    expect(filtrarTitulosReceber(BOLETOS_MOCK.titulos, 'TST')[0].prefixo).toBe('TST');
  });
});

describe('situacaoTituloReceber', () => {
  it('maps settled, overdue and open titles', () => {
    const [baixado, aberto, atrasado] = [BOLETOS_MOCK.titulos[0], BOLETOS_MOCK.titulos[1], BOLETOS_MOCK.titulos[12]];
    expect(situacaoTituloReceber(baixado)).toBe('baixado');
    expect(situacaoTituloReceber(aberto)).toBe('aberto');
    expect(situacaoTituloReceber(atrasado)).toBe('atrasado');
  });
});
