import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { plugAuthInterceptor } from './plug.auth';

describe('plugAuthInterceptor', () => {
  it('fetches an OAuth token once and attaches Bearer to API calls', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([plugAuthInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const http = TestBed.inject(HttpClient);
    const mock = TestBed.inject(HttpTestingController);

    let body: unknown;
    http.get('/rest/andorinha/v1/banks/').subscribe((res) => {
      body = res;
    });

    const tokenReq = mock.expectOne((req) => req.url.includes('/api/oauth2/v1/token'));
    expect(tokenReq.request.method).toBe('POST');
    expect(tokenReq.request.body).not.toBeNull();
    expect(String(tokenReq.request.headers.get('Content-Type') ?? '')).not.toContain('application/json');
    expect(tokenReq.request.urlWithParams).toContain('grant_type=password');
    expect(tokenReq.request.urlWithParams).toContain('username=admin');
    expect(tokenReq.request.urlWithParams).toContain('password=1234');
    expect(tokenReq.request.headers.has('Authorization')).toBe(false);
    tokenReq.flush({ access_token: 'tok-1', token_type: 'Bearer', expires_in: 3600 });

    const apiReq = mock.expectOne('/rest/andorinha/v1/banks/');
    expect(apiReq.request.headers.get('Authorization')).toBe('Bearer tok-1');
    apiReq.flush({ items: [] });
    expect(body).toEqual({ items: [] });

    http.get('/rest/andorinha/v1/receivables').subscribe();
    const second = mock.expectOne('/rest/andorinha/v1/receivables');
    expect(second.request.headers.get('Authorization')).toBe('Bearer tok-1');
    second.flush({ items: [] });
    mock.expectNone((req) => req.url.includes('/api/oauth2/v1/token'));
  });
});
