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
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, bancosTodos: false, itau: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.portador === '341')).toBe(true);
    expect(visiveis.length).toBe(titulos.filter((t) => t.portador === '341').length);
  });

  it('filters Bradesco to portador 237 only', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, bancosTodos: false, bradesco: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.portador === '237' && t.banco === 'bradesco')).toBe(true);
    expect(visiveis.map((t) => t.id)).toEqual(['t02']);
  });

  it('filters Caixa Econômica to portador 104 only', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, bancosTodos: false, caixa: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.portador === '104' && t.banco === 'caixa')).toBe(true);
    expect(visiveis.map((t) => t.id)).toEqual(['t05']);
  });

  it('returns a fresh Todos object when Todos is clicked while already on', () => {
    const next = aplicarFiltroRapido(FILTROS_INICIAIS, 'todos');
    expect(next).toEqual(FILTROS_INICIAIS);
    expect(next).not.toBe(FILTROS_INICIAIS);
    expect(next.todos).toBe(true);
  });

  it('turns on Itaú without clearing Filtros Rápidos Todos', () => {
    const next = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    expect(next.todos).toBe(true);
    expect(next.bancosTodos).toBe(false);
    expect(next.itau).toBe(true);
  });

  it('keeps bank filter when Filtros Rápidos Todos is clicked', () => {
    const withItau = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    const next = aplicarFiltroRapido(withItau, 'todos');
    expect(next.todos).toBe(true);
    expect(next.itau).toBe(true);
    expect(next.bancosTodos).toBe(false);
  });

  it('keeps status filter when Bancos Todos is clicked', () => {
    const withAberto = aplicarFiltroRapido(FILTROS_INICIAIS, 'aberto');
    const withItau = aplicarFiltroRapido(withAberto, 'itau');
    const next = aplicarFiltroRapido(withItau, 'bancosTodos');
    expect(next.aberto).toBe(true);
    expect(next.todos).toBe(false);
    expect(next.itau).toBe(false);
    expect(next.bancosTodos).toBe(true);
  });

  it('restores Bancos Todos when the last bank filter is cleared', () => {
    const withItau = aplicarFiltroRapido(FILTROS_INICIAIS, 'itau');
    const next = aplicarFiltroRapido(withItau, 'itau');
    expect(next.bancosTodos).toBe(true);
    expect(next.itau).toBe(false);
    expect(next.todos).toBe(true);
  });

  it('ANDs status and bank groups', () => {
    const filtros: FiltrosRapidos = {
      ...FILTROS_INICIAIS,
      todos: false,
      bancosTodos: false,
      aberto: true,
      itau: true,
    };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    expect(visiveis.every((t) => t.status === 'aberto' && t.banco === 'itau')).toBe(true);
  });

  it('filters Vencidos to overdue titles only', () => {
    const next = aplicarFiltroRapido(FILTROS_INICIAIS, 'vencido');
    expect(next.todos).toBe(false);
    expect(next.vencido).toBe(true);
    const visiveis = filtrarTitulos(titulos, next, '');
    expect(visiveis.every((t) => t.atrasado)).toBe(true);
    expect(visiveis.map((t) => t.id)).toEqual(['t13']);
  });

  it('filters search by numero, nome, or prefixo', () => {
    const found = filtrarTitulos(titulos, FILTROS_INICIAIS, '1000');
    expect(found.map((t) => t.id)).toEqual(['t01']);
  });

  it('does not match search across field boundaries', () => {
    expect(filtrarTitulos(titulos, FILTROS_INICIAIS, '0 GUIL')).toEqual([]);
    expect(filtrarTitulos(titulos, FILTROS_INICIAIS, '1000').map((t) => t.id)).toEqual(['t01']);
  });

  it('reports applied filters when Todos is off or search is set', () => {
    expect(temFiltroAplicado(FILTROS_INICIAIS, '')).toBe(false);
    expect(temFiltroAplicado({ ...FILTROS_INICIAIS, bancosTodos: false, itau: true }, '')).toBe(
      true,
    );
    expect(temFiltroAplicado(FILTROS_INICIAIS, 'GUI')).toBe(true);
  });

  it('zeros marcado when selected row is not visible', () => {
    const filtros: FiltrosRapidos = { ...FILTROS_INICIAIS, bancosTodos: false, itau: true };
    const visiveis = filtrarTitulos(titulos, filtros, '');
    const totais = calcularTotais(visiveis, new Set(['t13']));
    expect(totais.marcado).toBe(0);
  });
});
