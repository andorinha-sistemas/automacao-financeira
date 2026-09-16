import { describe, expect, it } from 'vitest';

import { TITULOS_PAGAR_MOCK } from './boletos.mock';
import {
  alterarTituloPagar,
  filtrarTitulosPagar,
  incluirTituloPagar,
  tituloPagarVazio,
  validarGravacaoTituloPagar,
} from './titulos-pagar.logic';

describe('filtrarTitulosPagar', () => {
  it('filters by fornecedor name or number', () => {
    expect(filtrarTitulosPagar(TITULOS_PAGAR_MOCK, 'alpha').map((t) => t.id)).toEqual(['p01', 'p02', 'p07']);
    expect(filtrarTitulosPagar(TITULOS_PAGAR_MOCK, '000004100').map((t) => t.id)).toEqual(['p03']);
    expect(filtrarTitulosPagar(TITULOS_PAGAR_MOCK, '').length).toBe(7);
  });
});

describe('tituloPagarVazio', () => {
  it('defaults emission date, currency and zero values', () => {
    expect(tituloPagarVazio()).toMatchObject({
      id: '',
      filial: '0101',
      prefixo: '',
      numero: '',
      emissao: '29/03/2025',
      vencimento: '',
      vencimentoReal: '',
      valor: 0,
      saldo: 0,
      historico: '',
      moeda: '1',
      valorRs: 0,
      taxaMoeda: 0,
      codAprovacao: '',
      rateioProj: '2',
      descP100: '0',
      vlrRetIss: '0,00',
    });
  });
});

describe('validarGravacaoTituloPagar', () => {
  const valido = {
    ...tituloPagarVazio(),
    numero: '000009999',
    tipo: 'NF',
    natureza: '2001001',
    fornecedor: '000123',
    loja: '01',
    emissao: '29/03/2025',
    vencimento: '30/04/2025',
    vencimentoReal: '30/04/2025',
    valor: 10,
  };

  it('rejects missing required fields', () => {
    const check = validarGravacaoTituloPagar(tituloPagarVazio(), TITULOS_PAGAR_MOCK, 'incluir');
    expect(check.ok).toBe(false);
    if (!check.ok) {
      expect(check.erro).toContain('obrigatório');
    }
  });

  it('rejects duplicate prefixo+numero+parcela+tipo on include', () => {
    const duplicado = {
      ...valido,
      prefixo: TITULOS_PAGAR_MOCK[0].prefixo,
      numero: TITULOS_PAGAR_MOCK[0].numero,
      parcela: TITULOS_PAGAR_MOCK[0].parcela,
      tipo: TITULOS_PAGAR_MOCK[0].tipo,
    };
    const check = validarGravacaoTituloPagar(duplicado, TITULOS_PAGAR_MOCK, 'incluir');
    expect(check.ok).toBe(false);
    if (!check.ok) {
      expect(check.erro).toContain('Já existe');
    }
  });

  it('accepts a new title', () => {
    expect(validarGravacaoTituloPagar(valido, TITULOS_PAGAR_MOCK, 'incluir')).toEqual({ ok: true });
  });
});

describe('incluirTituloPagar / alterarTituloPagar', () => {
  it('appends a copy with a new id', () => {
    const novo = incluirTituloPagar(TITULOS_PAGAR_MOCK, {
      ...tituloPagarVazio(),
      numero: '000009999',
      tipo: 'NF',
      natureza: '2001001',
      fornecedor: '000123',
      loja: '01',
      nomeFornecedor: 'NOVO FORNECEDOR',
      emissao: '29/03/2025',
      vencimento: '30/04/2025',
      vencimentoReal: '30/04/2025',
      valor: 10,
      valorRs: 10,
      saldo: 10,
    });
    expect(novo).toHaveLength(8);
    expect(novo[7].numero).toBe('000009999');
    expect(novo[7].id).toMatch(/^p\d+$/);
    expect(novo[7].id).not.toBe('p01');
    expect(TITULOS_PAGAR_MOCK).toHaveLength(7);
  });

  it('updates by id', () => {
    const atualizado = alterarTituloPagar(TITULOS_PAGAR_MOCK, {
      ...TITULOS_PAGAR_MOCK[0],
      historico: 'Ajuste mock',
      valor: 2000,
    });
    expect(atualizado[0].historico).toBe('Ajuste mock');
    expect(atualizado[0].valor).toBe(2000);
    expect(TITULOS_PAGAR_MOCK[0].historico).toBe('');
  });
});
