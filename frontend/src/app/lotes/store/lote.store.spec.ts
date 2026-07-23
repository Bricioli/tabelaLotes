import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoteStore } from './lote.store';
import { HttpStateService } from './http-state.service';
import { LoteRepository } from '../services/lote.repository';
import { Lote } from '../models/lote.model';

const sampleLote: Lote = {
  id: 1,
  codigoLote: 'LOT-0001',
  valor: 100,
  dataCriacao: '2026-07-20',
  situacao: 'ATIVO',
  quantidadeItens: 5,
};

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
            searchLotes: () =>
              of({ data: [], total: 0, page: 1, totalPages: 1 }),
          },
        },
      ],
    });

    store = TestBed.inject(LoteStore);
  });

  it('should start with no selection and canAlterarOuExcluir false', () => {
    expect(store.itemSelecionado()).toBeNull();
    expect(store.canAlterarOuExcluir()).toBe(false);
  });

  it('should set canAlterarOuExcluir true only when exactly one item is selected', () => {
    store.selectItem(sampleLote);

    expect(store.itemSelecionado()).toEqual(sampleLote);
    expect(store.canAlterarOuExcluir()).toBe(true);

    store.selectItem(sampleLote);

    expect(store.itemSelecionado()).toBeNull();
    expect(store.canAlterarOuExcluir()).toBe(false);
  });
});
