import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoteStore } from './lote.store';
import { HttpStateService } from './http-state.service';
import { LoteRepository } from '../services/lote.repository';

describe('LoteStore', () => {
  let store: LoteStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoteStore,
        HttpStateService,
        {
          provide: LoteRepository,
          useValue: {
            searchLotes: () => of({ data: [], total: 0, page: 1, totalPages: 1 }),
          },
        },
      ],
    });

    store = TestBed.inject(LoteStore);
  });

  it('should start with no selection and canAlterarOuExcluir false', () => {
    expect(store.selectedCount()).toBe(0);
    expect(store.canAlterarOuExcluir()).toBe(false);
  });

  it('should enable actions only when exactly one lote is selected', () => {
    store.toggleSelection(1);

    expect(store.selectedCount()).toBe(1);
    expect(store.canAlterarOuExcluir()).toBe(true);

    store.toggleSelection(2);
    expect(store.selectedCount()).toBe(2);
    expect(store.canAlterarOuExcluir()).toBe(false);

    store.toggleSelection(1);
    expect(store.selectedCount()).toBe(1);
    expect(store.canAlterarOuExcluir()).toBe(true);
  });

  it('should toggle select all and clear selection', () => {
    store['lotes'].set([
      { id: 1, codigoLote: 'LOT-1', valor: 100, dataCriacao: '2026-01-01', quantidadeLancamentos: 2, usuarioRegistro: 'u1', usuarioAprovacao: 'u2', situacao: 'ABERTO', dataHoraSituacaoLote: '2026-01-02T10:00:00Z' },
      { id: 2, codigoLote: 'LOT-2', valor: 200, dataCriacao: '2026-01-02', quantidadeLancamentos: 3, usuarioRegistro: 'u1', usuarioAprovacao: 'u2', situacao: 'ENVIADO', dataHoraSituacaoLote: '2026-01-03T12:00:00Z' },
    ]);

    store.toggleSelectAll();

    expect(store.selectedCount()).toBe(2);
    expect(store.isAllSelected()).toBe(true);

    store.toggleSelectAll();

    expect(store.selectedCount()).toBe(0);
    expect(store.isAllSelected()).toBe(false);
  });
});
