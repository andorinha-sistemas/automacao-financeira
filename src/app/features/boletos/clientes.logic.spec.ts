import { describe, expect, it } from 'vitest';

import { CLIENTES_MOCK } from './boletos.mock';
import { filtrarClientes } from './clientes.logic';

describe('filtrarClientes', () => {
  it('returns all clients when search is empty', () => {
    expect(filtrarClientes(CLIENTES_MOCK, '')).toEqual(CLIENTES_MOCK);
  });

  it('filters by code, name or fantasy name', () => {
    expect(filtrarClientes(CLIENTES_MOCK, '000097').map((c) => c.codigo)).toEqual(['000097']);
    expect(filtrarClientes(CLIENTES_MOCK, 'padrao')[0].nome).toContain('PADRAO');
    expect(filtrarClientes(CLIENTES_MOCK, 'guilherme')[0].nFantasia).toContain('GUILHERME');
  });
});
