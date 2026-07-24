import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response } from 'express';
import { listLotesHandler, updateLoteHandler, bulkDeleteLotesHandler } from './lotes.controller';

interface MockResponse extends Response {
  status: Mock;
  json: Mock;
}

const createMockResponse = (): MockResponse => {
  const res = {} as MockResponse;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('LotesController Contract & HTTP Responses', () => {
  let res: MockResponse;

  beforeEach(() => {
    res = createMockResponse();
  });

  describe('listLotesHandler', () => {
    it('should return 200 and paginated response on valid query', () => {
      const req = {
        query: { page: '1', limit: '5' },
      } as unknown as Request;

      listLotesHandler(req, res);

      const statusSpy = res.status;
      const jsonSpy = res.json;

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Array) as unknown,
          total: expect.any(Number) as unknown,
          page: 1,
          totalPages: expect.any(Number) as unknown,
        }),
      );
    });

    it('should return 400 and error array when query parameters are invalid', () => {
      const req = {
        query: { page: '-1' },
      } as unknown as Request;

      listLotesHandler(req, res);

      const statusSpy = res.status;
      const jsonSpy = res.json;

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.any(String) as unknown]) as unknown,
        }),
      );
    });
  });

  describe('updateLoteHandler', () => {
    it('should return 400 when ID parameter is invalid', () => {
      const req = {
        params: { id: 'invalid' },
        body: { valor: 500 },
      } as unknown as Request;

      updateLoteHandler(req, res);

      const statusSpy = res.status;
      const jsonSpy = res.json;

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ errors: ['id deve ser um inteiro positivo'] });
    });

    it('should return 404 when lote does not exist', () => {
      const req = {
        params: { id: '999999' },
        body: { valor: 500 },
      } as unknown as Request;

      updateLoteHandler(req, res);

      const statusSpy = res.status;
      const jsonSpy = res.json;

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({ message: 'Lote não encontrado' });
    });
  });

  describe('bulkDeleteLotesHandler', () => {
    it('should return 400 when body does not contain valid array of IDs', () => {
      const req = {
        body: { ids: [] },
      } as unknown as Request;

      bulkDeleteLotesHandler(req, res);

      const statusSpy = res.status;
      const jsonSpy = res.json;

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.any(Array) as unknown,
        }),
      );
    });
  });
});
