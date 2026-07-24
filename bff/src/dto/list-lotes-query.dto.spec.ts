import { describe, it, expect } from 'vitest';
import { parseListLotesQuery } from './list-lotes-query.dto';

describe('ListLotesQueryDto validation (parseListLotesQuery)', () => {
  it('should parse valid query with default page and limit', () => {
    const { dto, errors } = parseListLotesQuery({});

    expect(errors).toHaveLength(0);
    expect(dto).toEqual({
      page: 1,
      limit: 20,
    });
  });

  it('should parse valid custom pagination and filters', () => {
    const { dto, errors } = parseListLotesQuery({
      page: '2',
      limit: '50',
      situacao: 'ENVIADO',
      idLoteMin: '10',
      idLoteMax: '100',
      valorMinimo: '150.50',
      valorMaximo: '1000.00',
      dataEntradaInicio: '2026-01-01',
      dataEntradaFim: '2026-06-30',
      codigoLote: ' LOT-123 ',
      instituicao: ' Banco Central ',
      instituicaoResponsavel: ' Tesouro ',
      sortBy: 'valor',
      sortDirection: 'desc',
    });

    expect(errors).toHaveLength(0);
    expect(dto).toEqual({
      page: 2,
      limit: 50,
      situacao: 'ENVIADO',
      idLoteMin: 10,
      idLoteMax: 100,
      valorMinimo: 150.5,
      valorMaximo: 1000.0,
      dataEntradaInicio: '2026-01-01',
      dataEntradaFim: '2026-06-30',
      codigoLote: 'LOT-123',
      instituicao: 'Banco Central',
      instituicaoResponsavel: 'Tesouro',
      sortBy: 'valor',
      sortDirection: 'desc',
    });
  });

  it('should return errors for invalid page and limit values', () => {
    const { dto, errors } = parseListLotesQuery({
      page: '0',
      limit: 'abc',
    });

    expect(dto).toBeUndefined();
    expect(errors).toContain('limit deve ser um inteiro válido');
    expect(errors).toContain('page deve ser maior ou igual a 1');
  });

  it('should return error for invalid situacao enum value', () => {
    const { dto, errors } = parseListLotesQuery({
      situacao: 'INVALID_STATUS',
    });

    expect(dto).toBeUndefined();
    expect(errors.some((err) => err.includes('situacao deve ser um dos valores'))).toBe(true);
  });

  it('should return error when idLoteMin is greater than idLoteMax', () => {
    const { dto, errors } = parseListLotesQuery({
      idLoteMin: '500',
      idLoteMax: '100',
    });

    expect(dto).toBeUndefined();
    expect(errors).toContain('idLoteMin não pode ser maior que idLoteMax');
  });

  it('should return error when valorMinimo is greater than valorMaximo', () => {
    const { dto, errors } = parseListLotesQuery({
      valorMinimo: '999.99',
      valorMaximo: '100.00',
    });

    expect(dto).toBeUndefined();
    expect(errors).toContain('valorMinimo não pode ser maior que valorMaximo');
  });

  it('should return error for invalid date formats', () => {
    const { dto, errors } = parseListLotesQuery({
      dataEntradaInicio: 'not-a-date',
      dataEntradaFim: '2026-13-45',
    });

    expect(dto).toBeUndefined();
    expect(errors).toContain('dataEntradaInicio deve ser uma data ISO válida');
    expect(errors).toContain('dataEntradaFim deve ser uma data ISO válida');
  });

  it('should ignore invalid sort field and preserve valid query dto', () => {
    const { dto, errors } = parseListLotesQuery({
      sortBy: 'unsupportedField',
      sortDirection: 'asc',
    });

    expect(errors).toHaveLength(0);
    expect(dto?.sortBy).toBeUndefined();
    expect(dto?.sortDirection).toBe('asc');
  });
});
