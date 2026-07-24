import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { LoteRepository } from './lote.repository';

describe('LoteRepository', () => {
  let repository: LoteRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoteRepository],
    });

    repository = TestBed.inject(LoteRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should retry on 5xx error responses', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const promise = firstValueFrom(repository.searchLotes({}, 1, 10));

    const request1 = httpMock.expectOne('/api/v1/lotes?page=1&limit=10');
    request1.flush({}, { status: 500, statusText: 'Server Error' });

    vi.advanceTimersByTime(300);

    const request2 = httpMock.expectOne('/api/v1/lotes?page=1&limit=10');
    request2.flush({ data: [], total: 0, page: 1, totalPages: 1 });

    const response = await promise;

    expect(response.total).toBe(0);
  });

  it('should not retry on 4xx error responses', async () => {
    const promise = firstValueFrom(repository.searchLotes({}, 1, 10));

    const request = httpMock.expectOne('/api/v1/lotes?page=1&limit=10');
    request.flush({}, { status: 400, statusText: 'Bad Request' });

    await expect(promise).rejects.toThrow();
  });

  it('should send all supported filter params to the BFF endpoint', async () => {
    const promise = firstValueFrom(
      repository.searchLotes(
        {
          instituicaoResponsavel: 'Responsável A',
          instituicao: 'Instituição B',
          situacaoLote: 'ABERTO',
          idLoteMin: 1,
          idLoteMax: 100,
          valorMinimo: 100,
          valorMaximo: 500,
          dataEntradaInicio: '2026-01-01',
          dataEntradaFim: '2026-12-31',
        },
        2,
        20,
      ),
    );

    const request = httpMock.expectOne((req) => {
      if (req.url !== '/api/v1/lotes') return false;
      if (req.params.get('page') !== '2') return false;
      if (req.params.get('limit') !== '20') return false;
      if (req.params.get('instituicaoResponsavel') !== 'Responsável A') return false;
      if (req.params.get('instituicao') !== 'Instituição B') return false;
      if (req.params.get('situacao') !== 'ABERTO') return false;
      if (req.params.get('idLoteMin') !== '1') return false;
      if (req.params.get('idLoteMax') !== '100') return false;
      if (req.params.get('valorMinimo') !== '100') return false;
      if (req.params.get('valorMaximo') !== '500') return false;
      if (req.params.get('dataEntradaInicio') !== '2026-01-01') return false;
      if (req.params.get('dataEntradaFim') !== '2026-12-31') return false;
      return true;
    });
    request.flush({ data: [], total: 0, page: 2, totalPages: 1 });

    const response = await promise;

    expect(response.page).toBe(2);
    expect(response.totalPages).toBe(1);
  });

  it('should omit TODAS situacao from query params', async () => {
    const promise = firstValueFrom(
      repository.searchLotes(
        {
          situacaoLote: 'TODAS',
        },
        1,
        10,
      ),
    );

    const request = httpMock.expectOne((req) => {
      if (req.url !== '/api/v1/lotes') return false;
      return !req.params.has('situacao');
    });
    request.flush({ data: [], total: 0, page: 1, totalPages: 1 });

    const response = await promise;

    expect(response.total).toBe(0);
  });
});
