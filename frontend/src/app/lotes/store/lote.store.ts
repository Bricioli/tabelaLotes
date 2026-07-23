import { Injectable, computed, signal, Signal } from '@angular/core';
import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { Lote, LoteSituacao, LotesPage } from '../models/lote.model';
import { LoteFilter, loteFilterDefault } from '../models/lote-filter.model';
import { HttpStateService } from './http-state.service';
import { LoteRepository } from '../services/lote.repository';

@Injectable({ providedIn: 'root' })
export class LoteStore {
  readonly lotes = signal<Lote[]>([]);
  readonly filtroAtual = signal<LoteFilter>({ ...loteFilterDefault });
  readonly paginaAtual = signal(1);
  readonly totalElementos = signal(0);
  readonly itemSelecionado = signal<Lote | null>(null);
  readonly isLoading: Signal<boolean>;
  readonly hasError: Signal<boolean>;

  readonly canAlterarOuExcluir = computed(() => !!this.itemSelecionado());
  readonly isFiltroValido = computed(() => {
    const filtro = this.filtroAtual();
    const valorMinimo = filtro.valorMinimo ?? 0;
    const valorMaximo = filtro.valorMaximo ?? Infinity;
    const dataInicio = filtro.dataInicio ? new Date(filtro.dataInicio) : null;
    const dataFim = filtro.dataFim ? new Date(filtro.dataFim) : null;

    const valorValido = valorMinimo <= valorMaximo;
    const dataValida = !dataInicio || !dataFim || dataInicio <= dataFim;

    return valorValido && dataValida;
  });

  private readonly searchRequests = new Subject<{ filter: LoteFilter; page: number; limit: number }>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly repository: LoteRepository,
    private readonly httpState: HttpStateService
  ) {
    this.isLoading = computed(() => this.httpState.isLoading());
    this.hasError = computed(() => this.httpState.hasError());

    this.searchRequests
      .pipe(
        tap(() => this.httpState.clearError()),
        switchMap(({ filter, page, limit }) =>
          this.repository.searchLotes(filter, page, limit).pipe(
            tap((pageData) => this.applyPage(pageData)),
            catchError(() => EMPTY)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  loadLotes(page = this.paginaAtual(), limit = 10): void {
    this.paginaAtual.set(page);
    this.searchRequests.next({ filter: this.filtroAtual(), page, limit });
  }

  updateFiltro(partial: Partial<LoteFilter>): void {
    this.filtroAtual.update((current) => ({ ...current, ...partial }));
  }

  clearFiltro(): void {
    this.filtroAtual.set({ ...loteFilterDefault });
  }

  selectItem(lote: Lote | null): void {
    const current = this.itemSelecionado();
    if (current?.id === lote?.id) {
      this.itemSelecionado.set(null);
      return;
    }
    this.itemSelecionado.set(lote);
  }

  resetSelection(): void {
    this.itemSelecionado.set(null);
  }

  getSituacaoBadgeColor(situacao: LoteSituacao): string {
    switch (situacao) {
      case 'ATIVO':
        return 'accent';
      case 'PROCESSANDO':
        return 'primary';
      case 'CANCELADO':
        return 'warn';
      case 'CONCLUIDO':
        return 'accent';
      default:
        return 'primary';
    }
  }

  private applyPage(pageData: LotesPage): void {
    this.lotes.set(pageData.data);
    this.totalElementos.set(pageData.total);
    this.paginaAtual.set(pageData.page);
    this.resetSelection();
  }
}
