import { Injectable, NgZone, computed, signal, Signal } from '@angular/core';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { Lote, LoteSituacao, LotesPage } from '../models/lote.model';
import { LoteFilter, loteFilterDefault } from '../models/lote-filter.model';
import { HttpStateService } from './http-state.service';
import { LoteRepository, LoteSortField } from '../services/lote.repository';

interface SearchRequest {
  filter: LoteFilter;
  page: number;
  limit: number;
  sortField: LoteSortField | null;
  sortDirection: 'asc' | 'desc' | null;
}

@Injectable({ providedIn: 'root' })
export class LoteStore {
  readonly lotes = signal<Lote[]>([]);
  readonly filtroAtual = signal<LoteFilter>({ ...loteFilterDefault });
  readonly paginaAtual = signal(1);
  readonly pageSize = signal(10);
  readonly totalElementos = signal(0);
  readonly sortField = signal<LoteSortField | null>(null);
  readonly sortDirection = signal<'asc' | 'desc' | null>(null);
  readonly selectedLotIds = signal<number[]>([]);
  readonly isLoading: Signal<boolean>;
  readonly hasError: Signal<boolean>;

  readonly selectedCount = computed(() => this.selectedLotIds().length);
  readonly hasSingleSelection = computed(() => this.selectedCount() === 1);
  readonly canAlterarOuExcluir = computed(() => this.hasSingleSelection());

  private readonly searchRequests = new Subject<SearchRequest>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly repository: LoteRepository,
    private readonly httpState: HttpStateService,
    private readonly ngZone: NgZone
  ) {
    this.isLoading = computed(() => this.httpState.isLoading());
    this.hasError = computed(() => this.httpState.hasError());

    this.searchRequests
      .pipe(
        tap(() => this.httpState.clearError()),
        switchMap(({ filter, page, limit, sortField, sortDirection }) =>
          this.repository.searchLotes(filter, page, limit, sortField ?? undefined, sortDirection ?? undefined).pipe(
            tap((pageData) => this.applyPage(pageData)),
            catchError(() => EMPTY)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  loadLotes(page = this.paginaAtual(), limit = this.pageSize()): void {
    this.paginaAtual.set(page);
    this.pageSize.set(limit);
    this.searchRequests.next({
      filter: this.filtroAtual(),
      page,
      limit,
      sortField: this.sortField(),
      sortDirection: this.sortDirection(),
    });
  }

  updateFiltro(partial: Partial<LoteFilter>): void {
    this.filtroAtual.update((current) => ({ ...current, ...partial }));
  }

  clearFiltro(): void {
    this.filtroAtual.set({ ...loteFilterDefault });
  }

  setSort(field: LoteSortField, direction: 'asc' | 'desc'): void {
    this.sortField.set(field);
    this.sortDirection.set(direction);
    this.loadLotes(1, this.pageSize());
  }

  toggleSelection(id: number): void {
    const selected = this.selectedLotIds();
    if (selected.includes(id)) {
      this.selectedLotIds.set(selected.filter((selectedId) => selectedId !== id));
      return;
    }
    this.selectedLotIds.set([...selected, id]);
  }

  selectAll(): void {
    const allIds = this.lotes().map((lote) => lote.id);
    this.selectedLotIds.set(allIds);
  }

  clearSelection(): void {
    this.selectedLotIds.set([]);
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.clearSelection();
      return;
    }
    this.selectAll();
  }

  isSelected(id: number): boolean {
    return this.selectedLotIds().includes(id);
  }

  isAllSelected(): boolean {
    const selected = this.selectedLotIds();
    return selected.length > 0 && selected.length === this.lotes().length;
  }

  hasSomeSelection(): boolean {
    const selected = this.selectedLotIds().length;
    return selected > 0 && selected < this.lotes().length;
  }

  getSituacaoBadgeColor(situacao: LoteSituacao): string {
    switch (situacao) {
      case 'ABERTO':
        return 'accent';
      case 'ENVIADO':
        return 'primary';
      case 'CONFIRMADO':
        return 'warn';
      default:
        return 'primary';
    }
  }

  private applyPage(pageData: LotesPage): void {
    this.ngZone.run(() => {
      this.lotes.set(pageData.data);
      this.totalElementos.set(pageData.total);
      this.paginaAtual.set(pageData.page);
      this.clearSelection();
    });
  }
}
