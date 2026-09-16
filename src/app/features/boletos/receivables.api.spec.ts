import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ReceivablesApi } from './receivables.api';

describe('ReceivablesApi', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ReceivablesApi],
    }).compileComponents();
    return {
      api: TestBed.inject(ReceivablesApi),
      http: TestBed.inject(HttpTestingController),
    };
  }

  it('maps GET list items and treats 404 as empty', async () => {
    const { api, http } = await setup();
    let titulos: { numero: string; portador: string; banco: string }[] | undefined;
    api.list().subscribe((lista) => {
      titulos = lista.map((t) => ({ numero: t.numero, portador: t.portador, banco: t.banco }));
    });
    http.expectOne((req) => req.method === 'GET' && req.url === '/rest/andorinha/v1/receivables/').flush({
      items: [
        {
          filial: 'D MG',
          prefixo: 'API',
          num: '000000999',
          parcela: '01',
          tipo: 'NF',
          natureza: '001',
          cliente: '000001',
          loja: '01',
          nomcli: 'CLIENTE TESTE',
          emissao: '20260908',
          vencto: '20261008',
          vencrea: '20261008',
          valor: 1500,
          saldo: 1500,
          historico: 'API',
          portador: '341',
        },
      ],
    });
    expect(titulos).toEqual([{ numero: '000000999', portador: '341', banco: 'itau' }]);

    api.list().subscribe((lista) => {
      titulos = lista.map((t) => ({ numero: t.numero, portador: t.portador, banco: t.banco }));
    });
    http
      .expectOne((req) => req.method === 'GET' && req.url === '/rest/andorinha/v1/receivables/')
      .flush({ items: [], message: 'Dados nao encontrados' }, { status: 404, statusText: 'Not Found' });
    expect(titulos).toEqual([]);
  });
});
