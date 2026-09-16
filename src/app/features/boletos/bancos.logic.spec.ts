import { describe, expect, it } from 'vitest';

import { alterarBanco, bancoVazio, excluirBanco, filtrarBancos, incluirBanco, validarGravacaoBanco } from './bancos.logic';
import { BANCOS_MOCK } from './boletos.mock';

describe('bancos.logic', () => {
  it('filters by codigo nome reduzido agencia or conta', () => {
    expect(filtrarBancos(BANCOS_MOCK, '237').map((b) => b.codigo)).toEqual(['237']);
    expect(filtrarBancos(BANCOS_MOCK, 'safra').map((b) => b.codigo)).toEqual(['422']);
    expect(filtrarBancos(BANCOS_MOCK, '').length).toBe(6);
  });

  it('rejects include without codigo or nome and duplicate codigo', () => {
    const semCodigo = validarGravacaoBanco({ ...bancoVazio(), nome: 'X', agencia: '1', conta: '1' }, BANCOS_MOCK, 'incluir');
    const duplicado = validarGravacaoBanco(
      { ...bancoVazio(), codigo: '341', nome: 'X', agencia: '0934', conta: '12345' },
      BANCOS_MOCK,
      'incluir',
    );
    const mesmoCodigoOutraConta = validarGravacaoBanco(
      { ...bancoVazio(), codigo: '341', nome: 'X', agencia: '0912', conta: '08368' },
      BANCOS_MOCK,
      'incluir',
    );
    expect(semCodigo.ok).toBe(false);
    expect(duplicado.ok).toBe(false);
    expect(mesmoCodigoOutraConta.ok).toBe(true);
    if (!semCodigo.ok) {
      expect(semCodigo.erro).toBe('Informe o código, o nome, a agência e a conta do banco.');
    }
    if (!duplicado.ok) {
      expect(duplicado.erro).toBe('Já existe um banco com este código, agência e conta.');
    }
  });

  it('includes alters and deletes in memory', () => {
    const novo = { ...bancoVazio(), codigo: '999', nome: 'Teste Banco', agencia: '1', conta: '2' };
    const afterIncluir = incluirBanco(BANCOS_MOCK, novo);
    expect(afterIncluir).toHaveLength(7);
    const afterAlterar = alterarBanco(afterIncluir, { ...novo, nome: 'Teste Banco SA' });
    expect(afterAlterar.find((b) => b.codigo === '999')?.nome).toBe('Teste Banco SA');
    expect(excluirBanco(afterAlterar, '999')).toHaveLength(6);
  });
});
