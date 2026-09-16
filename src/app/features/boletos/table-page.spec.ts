import { describe, expect, it } from 'vitest';

import { linhasQueCabem, paginaDe, rotuloPagina, TAMANHO_PAGINA, totalPaginas } from './table-page';

describe('table-page', () => {
  it('falls back to 10 rows when the table area has not been measured', () => {
    expect(TAMANHO_PAGINA).toBe(10);
    expect(linhasQueCabem(0)).toBe(10);
  });

  it('fills the available table height with as many rows as fit', () => {
    expect(linhasQueCabem(44 + 48 * 10, 48, 44)).toBe(10);
    expect(linhasQueCabem(44 + 48 * 18, 48, 44)).toBe(18);
    expect(linhasQueCabem(900, 48, 44)).toBe(17);
  });

  it('returns only the requested page of items', () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);
    expect(paginaDe(items, 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(paginaDe(items, 2)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(paginaDe(items, 3)).toEqual([21, 22, 23, 24, 25]);
    expect(paginaDe(items, 1, 18)).toEqual(items.slice(0, 18));
  });

  it('labels the visible range against the full total', () => {
    expect(rotuloPagina(25, 1)).toBe('1 - 10 de 25');
    expect(rotuloPagina(25, 3)).toBe('21 - 25 de 25');
    expect(rotuloPagina(0, 1)).toBe('0 de 0');
    expect(rotuloPagina(11312, 1, 18)).toBe('1 - 18 de 11312');
  });

  it('computes page count from the full list', () => {
    expect(totalPaginas(0)).toBe(1);
    expect(totalPaginas(10)).toBe(1);
    expect(totalPaginas(11)).toBe(2);
    expect(totalPaginas(11312, 18)).toBe(629);
  });
});
