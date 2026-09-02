import { describe, expect, it } from 'vitest';

import {
  aplicarFiltroRapido,
  calcularTotais,
  filtrarTitulos,
  formatBrl,
  temFiltroAplicado,
} from './boletos.logic';
import { BOLETOS_MOCK } from './boletos.mock';
import { FILTROS_INICIAIS, FiltrosRapidos } from './boletos.model';

const titulos = BOLETOS_MOCK.titulos;

describe('boletos.logic', () => {
  it('formats money in pt-BR with 2 decimals', () => {
    expect(formatBrl(272.61)).toBe('272,61');
    expect(formatBrl(0.1)).toBe('0,10');
  });

  it('computes print totals with t13 selected', () => {
    const totais = calcularTotais(titulos, new Set(['t13']));
    expect(totais).toEqual({
      contagem: 13,
      total: 272.61,
      aberto: 272.51,
      baixado: 0.1,
      conciliado: 0.1,
      naoConciliado: 0,
      marcado: 1,
    });
  });

  it('filters Itaú to portador 341 only', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, todos: false, itau: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.portador === '341')).toBe(true);
    expect(visiveis.length).toBe(titulos.filter((t) => t.portador === '341').length);
  });

  it('turns on Itaú and turns off Todos', () => {
    const next = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    expect(next.todos).toBe(false);
    expect(next.itau).toBe(true);
  });

  it('restores Todos when the last specific filter is cleared', () => {
    const withItau = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    const next = aplicarFiltroRapido(withItau, 'itau');
    expect(next.todos).toBe(true);
    expect(next.itau).toBe(false);
  });

  it('ANDs status and bank groups', () => {
    const filtros: FiltrosRapidos = {
      ...FILTROS_INICIAIS,
      todos: false,
      aberto: true,
      itau: true,
    };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.status === 'aberto' && t.banco === 'itau')).toBe(true);
  });

  it('filters search by numero, nome, or prefixo', () => {
    const found = filtrarTitulos(titulos, FILTROS_INICIAIS, '1000');
    expect(found.map((t) => t.id)).toEqual(['t01']);
  });

  it('reports applied filters when Todos is off or search is set', () => {
    expect(temFiltroAplicado(FILTROS_INICIAIS, '')).toBe(false);
    expect(temFiltroAplicado({ ...FILTROS_INICIAIS, todos: false, itau: true }, '')).toBe(true);
    expect(temFiltroAplicado(FILTROS_INICIAIS, 'GUI')).toBe(true);
  });

  it('zeros marcado when selected row is not visible', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, todos: false, itau: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    const totais = calcularTotais(visiveis, new Set(['t13']));
    expect(totais.marcado).toBe(0);
  });
});
