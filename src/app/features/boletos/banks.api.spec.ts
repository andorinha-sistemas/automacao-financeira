import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { bancoVazio } from './bancos.logic';
import { BanksApi } from './banks.api';

describe('BanksApi', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), BanksApi],
    }).compileComponents();
    return {
      api: TestBed.inject(BanksApi),
      http: TestBed.inject(HttpTestingController),
    };
  }

  it('maps GET list items and treats 404 as empty', async () => {
    const { api, http } = await setup();
    let items: { codigo: string }[] | undefined;
    api.list().subscribe((lista) => {
      items = lista;
    });
    http.expectOne((req) => req.method === 'GET' && req.url === '/rest/andorinha/v1/banks/').flush({
      items: [{ codigo: '033', agencia: '00001', conta: '1', nome: 'SANTANDER', reduzido: 'SAN', cnpj: '' }],
    });
    expect(items?.map((b) => b.codigo)).toEqual(['033']);

    api.list().subscribe((lista) => {
      items = lista;
    });
    http
      .expectOne((req) => req.method === 'GET' && req.url === '/rest/andorinha/v1/banks/')
      .flush({ items: [], message: 'Dados nao encontrados' }, { status: 404, statusText: 'Not Found' });
    expect(items).toEqual([]);
  });

  it('posts and puts SA6 body then deletes by codigo', async () => {
    const { api, http } = await setup();
    const banco = {
      ...bancoVazio(),
      codigo: 'Z99',
      agencia: '00001',
      conta: '0000012345',
      nome: 'BANCO TESTE',
      nomeReduzido: 'BCO TESTE',
    };

    api.create(banco).subscribe();
    const post = http.expectOne((req) => req.method === 'POST' && req.url === '/rest/andorinha/v1/banks/');
    expect(post.request.body).toMatchObject({
      a6_cod: 'Z99',
      a6_agencia: '00001',
      a6_numcon: '0000012345',
      a6_nome: 'BANCO TESTE',
      a6_nreduz: 'BCO TESTE',
    });
    post.flush({ success: true, codigo: 'Z99' }, { status: 201, statusText: 'Created' });

    api.update(banco).subscribe();
    const put = http.expectOne((req) => req.method === 'PUT' && req.url === '/rest/andorinha/v1/banks/Z99');
    expect(put.request.body.a6_nome).toBe('BANCO TESTE');
    put.flush({ success: true, codigo: 'Z99' });

    api.remove('Z99').subscribe();
    http.expectOne((req) => req.method === 'DELETE' && req.url === '/rest/andorinha/v1/banks/Z99').flush({
      success: true,
    });
  });
});
