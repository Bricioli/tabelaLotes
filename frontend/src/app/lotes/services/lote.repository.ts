import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

import { LoteFilter, loteFilterDefault } from '../models/lote-filter.model';
import { LoteSituacao, LotesPage } from '../models/lote.model';

const MAX_RETRY_ATTEMPTS = 2;
const BACKOFF_BASE_MS = 300;

@Injectable({ providedIn: 'root' })
export class LoteRepository {
  private readonly baseUrl = '/api/v1/lotes';

  constructor(private readonly http: HttpClient) {}

  searchLotes(filter: LoteFilter = loteFilterDefault, page = 1, limit = 10): Observable<LotesPage> {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));

    if (filter.codigoLote) {
      params = params.set('codigoLote', filter.codigoLote);
    }

    if (filter.situacao && filter.situacao !== 'TODAS') {
      params = params.set('situacao', filter.situacao);
    }

    if (filter.valorMinimo != null) {
      params = params.set('valorMinimo', String(filter.valorMinimo));
    }

    if (filter.valorMaximo != null) {
      params = params.set('valorMaximo', String(filter.valorMaximo));
    }

    if (filter.dataInicio) {
      params = params.set('dataInicio', filter.dataInicio);
    }

    if (filter.dataFim) {
      params = params.set('dataFim', filter.dataFim);
    }

    return this.http
      .get<LotesPage>(this.baseUrl, { params })
      .pipe(this.retryWithBackoff());
  }

  private retryWithBackoff<T>(): OperatorFunction<T, T> {
    return retryWhen((errors) =>
      errors.pipe(
        mergeMap((error: HttpErrorResponse, attempt) => {
          const shouldRetry = this.shouldRetry(error);
          const nextAttempt = attempt + 1;

          if (!shouldRetry || nextAttempt > MAX_RETRY_ATTEMPTS) {
            return throwError(() => error);
          }

          const backoffTime = BACKOFF_BASE_MS * Math.pow(2, attempt);
          const jitter = Math.floor(Math.random() * 150);
          return timer(backoffTime + jitter);
        })
      )
    );
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    return error.status >= 500 && error.status < 600;
  }
}
