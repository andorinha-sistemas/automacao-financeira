import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { TituloReceber } from './boletos.model';
import { plugUrl } from './plug.config';
import { ReceivableApiItem, tituloReceberFromApi } from './plug.mapper';

interface ReceivablesListResponse {
  items?: ReceivableApiItem[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ReceivablesApi {
  private readonly http = inject(HttpClient);
  private readonly base = plugUrl('/andorinha/v1/receivables/');

  list(): Observable<TituloReceber[]> {
    return this.http.get<ReceivablesListResponse>(this.base).pipe(
      map((res) => (res.items ?? []).map(tituloReceberFromApi)),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return of(((err.error?.items as ReceivableApiItem[] | undefined) ?? []).map(tituloReceberFromApi));
        }
        return throwError(() => err);
      }),
    );
  }
}
