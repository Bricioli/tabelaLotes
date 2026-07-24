import { describe, it, expect, beforeEach } from 'vitest';
import { LotesService } from './lotes.service';
import { ListLotesQueryDto } from '../dto/list-lotes-query.dto';

describe('LotesService', () => {
  let service: LotesService;

  beforeEach(() => {
    service = new LotesService();
  });

  describe('filtering and pagination', () => {
    it('should list lotes with default pagination', () => {
      const query: ListLotesQueryDto = { page: 1, limit: 10 };
      const result = service.list(query);

      expect(result.page).toBe(1);
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.total).toBeGreaterThan(0);
      expect(result.totalPages).toBe(Math.ceil(result.total / 10));
    });

    it('should filter by ID range (idLoteMin and idLoteMax)', () => {
      const query: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        idLoteMin: 5,
        idLoteMax: 15,
      };
      const result = service.list(query);

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((lote) => {
        expect(lote.id).toBeGreaterThanOrEqual(5);
        expect(lote.id).toBeLessThanOrEqual(15);
      });
    });

    it('should filter by monetary value range (valorMinimo and valorMaximo)', () => {
      const query: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        valorMinimo: 1000,
        valorMaximo: 5000,
      };
      const result = service.list(query);

      result.data.forEach((lote) => {
        expect(lote.valor).toBeGreaterThanOrEqual(1000);
        expect(lote.valor).toBeLessThanOrEqual(5000);
      });
    });

    it('should filter by situacao', () => {
      const query: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        situacao: 'ABERTO',
      };
      const result = service.list(query);

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((lote) => {
        expect(lote.situacao).toBe('ABERTO');
      });
    });

    it('should filter by case-insensitive codigoLote', () => {
      const query: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        codigoLote: 'lot',
      };
      const result = service.list(query);

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((lote) => {
        expect(lote.codigoLote.toLowerCase()).toContain('lot');
      });
    });

    it('should filter by temporal range (dataEntradaInicio and dataEntradaFim)', () => {
      const query: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        dataEntradaInicio: '2026-01-01',
        dataEntradaFim: '2026-06-30',
      };
      const result = service.list(query);

      result.data.forEach((lote) => {
        const timestamp = Date.parse(lote.dataCriacao);
        expect(timestamp).toBeGreaterThanOrEqual(Date.parse('2026-01-01T00:00:00.000Z'));
      });
    });

    it('should sort lotes by numeric and string fields in ascending and descending order', () => {
      const queryAsc: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        sortBy: 'valor',
        sortDirection: 'asc',
      };
      const resultAsc = service.list(queryAsc);

      for (let i = 0; i < resultAsc.data.length - 1; i++) {
        expect(resultAsc.data[i].valor).toBeLessThanOrEqual(resultAsc.data[i + 1].valor);
      }

      const queryDesc: ListLotesQueryDto = {
        page: 1,
        limit: 50,
        sortBy: 'valor',
        sortDirection: 'desc',
      };
      const resultDesc = service.list(queryDesc);

      for (let i = 0; i < resultDesc.data.length - 1; i++) {
        expect(resultDesc.data[i].valor).toBeGreaterThanOrEqual(resultDesc.data[i + 1].valor);
      }
    });
  });

  describe('update and deletion operations', () => {
    it('should update a lote successfully', () => {
      const initial = service.list({ page: 1, limit: 1 }).data[0];
      const updated = service.update(initial.id, { valor: 99999, situacao: 'CONFIRMADO' });

      expect(updated).toBeDefined();
      expect(updated?.id).toBe(initial.id);
      expect(updated?.valor).toBe(99999);
      expect(updated?.situacao).toBe('CONFIRMADO');
    });

    it('should return undefined when updating non-existent lote', () => {
      const result = service.update(999999, { valor: 100 });
      expect(result).toBeUndefined();
    });

    it('should bulk delete lotes by ID array', () => {
      const lotesBefore = service.list({ page: 1, limit: 100 }).data;
      const idsToDelete = [lotesBefore[0].id, lotesBefore[1].id];

      const deleteResult = service.bulkDelete(idsToDelete);
      expect(deleteResult.deleted).toBe(2);

      const lotesAfter = service.list({ page: 1, limit: 100 }).data;
      expect(lotesAfter.some((l) => idsToDelete.includes(l.id))).toBe(false);
    });
  });
});
