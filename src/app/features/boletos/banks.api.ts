import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { BancoCadastro } from './boletos.model';
import { plugUrl } from './plug.config';
import { bancoFromApi, bancoToApiBody, BankApiItem } from './plug.mapper';

interface BanksListResponse {
  items?: BankApiItem[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class BanksApi {
  private readonly http = inject(HttpClient);
  private readonly base = plugUrl('/andorinha/v1/banks/');

  list(): Observable<BancoCadastro[]> {
    return this.http.get<BanksListResponse>(this.base).pipe(
      map((res) => (res.items ?? []).map(bancoFromApi)),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return of(((err.error?.items as BankApiItem[] | undefined) ?? []).map(bancoFromApi));
        }
        return throwError(() => err);
      }),
    );
  }

  create(banco: BancoCadastro): Observable<unknown> {
    return this.http.post(this.base, bancoToApiBody(banco));
  }

  update(banco: BancoCadastro): Observable<unknown> {
    return this.http.put(`${this.base}${encodeURIComponent(banco.codigo.trim())}`, bancoToApiBody(banco));
  }

  remove(codigo: string): Observable<unknown> {
    return this.http.delete(`${this.base}${encodeURIComponent(codigo.trim())}`);
  }
}
