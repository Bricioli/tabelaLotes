import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

import { LoteFilter, loteFilterDefault } from '../models/lote-filter.model';
import { LoteSituacao, LotesPage } from '../models/lote.model';

export type LoteSortField =
  | 'id'
  | 'dataCriacao'
  | 'valor'
  | 'quantidadeLancamentos'
  | 'usuarioRegistro'
  | 'usuarioAprovacao'
  | 'situacao'
  | 'dataHoraSituacaoLote';

const MAX_RETRY_ATTEMPTS = 2;
const BACKOFF_BASE_MS = 300;

@Injectable({ providedIn: 'root' })
export class LoteRepository {
  private readonly baseUrl = '/api/v1/lotes';

  constructor(private readonly http: HttpClient) {}

  searchLotes(
    filter: LoteFilter = loteFilterDefault,
    page = 1,
    limit = 10,
    sortField?: LoteSortField,
    sortDirection?: 'asc' | 'desc'
  ): Observable<LotesPage> {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));

    if (filter.instituicaoResponsavel) {
      params = params.set('instituicaoResponsavel', filter.instituicaoResponsavel);
    }

    if (filter.instituicao) {
      params = params.set('instituicao', filter.instituicao);
    }

    if (filter.situacaoLote && filter.situacaoLote !== 'TODAS') {
      params = params.set('situacao', filter.situacaoLote);
    }

    if (filter.idLoteMin != null) {
      params = params.set('idLoteMin', String(filter.idLoteMin));
    }

    if (filter.idLoteMax != null) {
      params = params.set('idLoteMax', String(filter.idLoteMax));
    }

    if (filter.valorMinimo != null) {
      params = params.set('valorMinimo', String(filter.valorMinimo));
    }

    if (filter.valorMaximo != null) {
      params = params.set('valorMaximo', String(filter.valorMaximo));
    }

    if (filter.dataEntradaInicio) {
      params = params.set('dataEntradaInicio', filter.dataEntradaInicio);
    }

    if (filter.dataEntradaFim) {
      params = params.set('dataEntradaFim', filter.dataEntradaFim);
    }

    if (sortField) {
      params = params.set('sortBy', sortField);
    }

    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
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
