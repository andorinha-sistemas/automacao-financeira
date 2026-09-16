import { HttpBackend, HttpClient, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { PLUG_OAUTH_PASS, PLUG_OAUTH_USER, plugUrl } from './plug.config';

interface OAuthTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

@Injectable({ providedIn: 'root' })
export class PlugAuth {
  private readonly http = new HttpClient(inject(HttpBackend));
  private token = '';
  private pending$?: Observable<string>;

  token$(): Observable<string> {
    if (this.token) {
      return of(this.token);
    }
    if (this.pending$) {
      return this.pending$;
    }
    this.pending$ = this.http
      .post<OAuthTokenResponse>(plugUrl('/api/oauth2/v1/token'), new HttpParams(), {
        params: {
          grant_type: 'password',
          password: PLUG_OAUTH_PASS,
          username: PLUG_OAUTH_USER,
        },
      })
      .pipe(
        map((res) => res.access_token),
        tap((token) => {
          this.token = token;
        }),
        catchError((err) => {
          this.pending$ = undefined;
          return throwError(() => err);
        }),
        finalize(() => {
          if (this.token) {
            this.pending$ = undefined;
          }
        }),
        shareReplay(1),
      );
    return this.pending$;
  }
}

export const plugAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/andorinha/') || req.url.includes('/api/oauth2/')) {
    return next(req);
  }
  return inject(PlugAuth)
    .token$()
    .pipe(switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))));
};
