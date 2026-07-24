import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

import { LoteFilter, loteFilterDefault } from '../models/lote-filter.model';
import { LotesPage } from '../models/lote.model';

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
    sortDirection?: 'asc' | 'desc',
  ): Observable<LotesPage> {
    const rawParams: Record<string, string | number | null | undefined> = {
      page,
      limit,
      instituicaoResponsavel: filter.instituicaoResponsavel,
      instituicao: filter.instituicao,
      situacao: filter.situacaoLote !== 'TODAS' ? filter.situacaoLote : null,
      idLoteMin: filter.idLoteMin,
      idLoteMax: filter.idLoteMax,
      valorMinimo: filter.valorMinimo,
      valorMaximo: filter.valorMaximo,
      dataEntradaInicio: filter.dataEntradaInicio,
      dataEntradaFim: filter.dataEntradaFim,
      sortBy: sortField,
      sortDirection: sortDirection,
    };

    const params = Object.entries(rawParams).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        return acc.set(key, String(value));
      }
      return acc;
    }, new HttpParams());

    return this.http.get<LotesPage>(this.baseUrl, { params }).pipe(this.retryWithBackoff());
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
        }),
      ),
    );
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    return error.status >= 500 && error.status < 600;
  }
}
