import { describe, expect, it } from 'vitest';

import { MOEDAS_MOCK } from './boletos.mock';
import { filtrarMoedas, formatTaxaMoeda } from './moedas.logic';

describe('filtrarMoedas', () => {
  it('returns all rates when search is empty', () => {
    expect(filtrarMoedas(MOEDAS_MOCK, '')).toEqual(MOEDAS_MOCK);
  });

  it('filters by date', () => {
    expect(filtrarMoedas(MOEDAS_MOCK, '30/04/1988').map((m) => m.data)).toEqual(['30/04/1988']);
    expect(filtrarMoedas(MOEDAS_MOCK, '1899')[0].data).toContain('1899');
  });
});

describe('formatTaxaMoeda', () => {
  it('formats four decimal places', () => {
    expect(formatTaxaMoeda(1.1081)).toBe('1.1081');
    expect(formatTaxaMoeda(0)).toBe('0.0000');
    expect(formatTaxaMoeda(1)).toBe('1.0000');
  });
});
