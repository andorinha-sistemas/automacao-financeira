import { describe, expect, it } from 'vitest';

import { bancoVazio } from './bancos.logic';
import {
  aaaammddToBr,
  bancoFromApi,
  bancoToApiBody,
  brToIso,
  mensagemApi,
  tituloReceberFromApi,
} from './plug.mapper';

describe('plug.mapper', () => {
  it('converts Protheus dates to BR and ISO', () => {
    expect(aaaammddToBr('20261008')).toBe('08/10/2026');
    expect(aaaammddToBr('2026-10-08')).toBe('08/10/2026');
    expect(brToIso('08/10/2026')).toBe('2026-10-08');
  });

  it('maps bank GET item onto BancoCadastro', () => {
    expect(
      bancoFromApi({
        filial: 'D MG',
        codigo: '033',
        agencia: '00001',
        conta: '0000000001',
        nome: 'BANCO SANTANDER S.A.',
        reduzido: 'SANTANDER',
        cnpj: '90400888000142',
      }),
    ).toMatchObject({
      id: 'D MG|033|00001|0000000001',
      filial: 'D MG',
      codigo: '033',
      agencia: '00001',
      conta: '0000000001',
      nome: 'BANCO SANTANDER S.A.',
      nomeReduzido: 'SANTANDER',
      cpfCnpj: '90400888000142',
    });
  });

  it('keeps banks with the same codigo distinct by agency and account', () => {
    expect(bancoFromApi({ filial: 'D MG', codigo: '341', agencia: '0912', conta: '08368', nome: 'ITAU A' }).id).not.toBe(
      bancoFromApi({ filial: 'D MG', codigo: '341', agencia: '00001', conta: '0000000001', nome: 'ITAU B' }).id,
    );
  });

  it('maps bank form onto SA6 POST body', () => {
    expect(
      bancoToApiBody({
        ...bancoVazio(),
        codigo: 'Z99',
        agencia: '00001',
        conta: '0000012345',
        nome: 'BANCO TESTE',
        nomeReduzido: 'BCO TESTE',
        estado: 'SP',
      }),
    ).toEqual({
      a6_cod: 'Z99',
      a6_agencia: '00001',
      a6_numcon: '0000012345',
      a6_nome: 'BANCO TESTE',
      a6_nreduz: 'BCO TESTE',
      a6_est: 'SP',
    });
  });

  it('maps receivable GET item onto TituloReceber', () => {
    const titulo = tituloReceberFromApi({
      filial: 'D MG',
      prefixo: 'API',
      num: '000000999',
      parcela: '01',
      tipo: 'NF',
      natureza: '10101001',
      cliente: '000001',
      loja: '01',
      nomcli: 'CLIENTE TESTE',
      emissao: '20260908',
      vencto: '20261008',
      vencrea: '20261008',
      valor: 1500,
      saldo: 1500,
      historico: 'Titulo via API',
      portador: '341',
    });
    expect(titulo).toMatchObject({
      id: 'API|000000999|01|NF',
      filial: 'D MG',
      prefixo: 'API',
      numero: '000000999',
      parcela: '01',
      tipo: 'NF',
      cliente: '000001',
      loja: '01',
      nomeCliente: 'CLIENTE TESTE',
      emissao: '08/09/2026',
      vencimento: '08/10/2026',
      vencimentoReal: '08/10/2026',
      valor: 1500,
      status: 'aberto',
      portador: '341',
      banco: 'itau',
    });
  });

  it('maps receivable portador onto banco icon code', () => {
    const base = {
      filial: 'D MG',
      prefixo: 'API',
      num: '1',
      parcela: '01',
      tipo: 'NF',
      natureza: '1',
      cliente: '000001',
      loja: '01',
      nomcli: 'X',
      emissao: '20260908',
      vencto: '20261008',
      vencrea: '20261008',
      valor: 10,
      saldo: 10,
      historico: '',
    };
    expect(tituloReceberFromApi({ ...base, portador: '237' }).banco).toBe('bradesco');
    expect(tituloReceberFromApi({ ...base, portador: '104' }).banco).toBe('caixa');
    expect(tituloReceberFromApi({ ...base, portador: '033' }).banco).toBe('santander');
    expect(tituloReceberFromApi({ ...base, portador: '001' }).banco).toBe('bb');
    expect(tituloReceberFromApi({ ...base, portador: '422' }).banco).toBe('safra');
    expect(tituloReceberFromApi({ ...base, portador: '999' })).toMatchObject({ portador: '999', banco: '' });
    expect(tituloReceberFromApi(base)).toMatchObject({ portador: '', banco: '' });
  });

  it('marks receivable as settled when saldo is zero', () => {
    expect(
      tituloReceberFromApi({
        filial: 'D MG',
        prefixo: 'API',
        num: '1',
        parcela: '01',
        tipo: 'NF',
        natureza: '1',
        cliente: '000001',
        loja: '01',
        nomcli: 'X',
        emissao: '20260908',
        vencto: '20261008',
        vencrea: '20261008',
        valor: 10,
        saldo: 0,
        historico: '',
      }).status,
    ).toBe('baixado');
  });

  it('marks receivable as partial when saldo is between zero and valor', () => {
    expect(
      tituloReceberFromApi({
        filial: 'D MG',
        prefixo: 'API',
        num: '1',
        parcela: '01',
        tipo: 'NF',
        natureza: '1',
        cliente: '000001',
        loja: '01',
        nomcli: 'X',
        emissao: '20260908',
        vencto: '20261008',
        vencrea: '20261008',
        valor: 10,
        saldo: 4,
        historico: '',
      }).status,
    ).toBe('parcBaixado');
  });

  it('reads API error message', () => {
    expect(mensagemApi({ error: { message: 'Titulo nao encontrado' } })).toBe('Titulo nao encontrado');
  });
});
