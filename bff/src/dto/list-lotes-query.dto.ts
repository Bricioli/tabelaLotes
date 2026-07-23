import { SituacaoLote } from '../types/lote.types';

export interface ListLotesQueryDto {
  page: number;
  limit: number;
  situacao?: SituacaoLote;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  codigoLote?: string;
}

const allowedSituacoes: SituacaoLote[] = ['ATIVO', 'PROCESSANDO', 'CANCELADO', 'CONCLUIDO'];

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const parseInteger = (value: string, name: string, errors: string[]): number | undefined => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    errors.push(`${name} deve ser um inteiro válido`);
    return undefined;
  }
  return parsed;
};

const parseFloatValue = (value: string, name: string, errors: string[]): number | undefined => {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    errors.push(`${name} deve ser um número válido`);
    return undefined;
  }
  return parsed;
};

const isIsoDateString = (value: string): boolean => !Number.isNaN(Date.parse(value));

export const parseListLotesQuery = (
  query: Record<string, string | undefined>
): { dto?: ListLotesQueryDto; errors: string[] } => {
  const errors: string[] = [];

  const page = query.page ? parseInteger(query.page, 'page', errors) : 1;
  const limit = query.limit ? parseInteger(query.limit, 'limit', errors) : 20;

  if (page !== undefined && page < 1) {
    errors.push('page deve ser maior ou igual a 1');
  }

  if (limit !== undefined && limit < 1) {
    errors.push('limit deve ser maior ou igual a 1');
  }

  let situacao: SituacaoLote | undefined;

  if (query.situacao) {
    if (allowedSituacoes.includes(query.situacao as SituacaoLote)) {
      situacao = query.situacao as SituacaoLote;
    } else {
      errors.push(`situacao deve ser um dos valores: ${allowedSituacoes.join(', ')}`);
    }
  }

  const dataInicio = query.dataInicio;
  if (dataInicio && !isIsoDateString(dataInicio)) {
    errors.push('dataInicio deve ser uma data ISO válida');
  }

  const dataFim = query.dataFim;
  if (dataFim && !isIsoDateString(dataFim)) {
    errors.push('dataFim deve ser uma data ISO válida');
  }

  const valorMinimo = query.valorMinimo ? parseFloatValue(query.valorMinimo, 'valorMinimo', errors) : undefined;
  const valorMaximo = query.valorMaximo ? parseFloatValue(query.valorMaximo, 'valorMaximo', errors) : undefined;

  if (valorMinimo !== undefined && valorMaximo !== undefined && valorMinimo > valorMaximo) {
    errors.push('valorMinimo não pode ser maior que valorMaximo');
  }

  const codigoLote = query.codigoLote?.trim();

  if (errors.length > 0 || page === undefined || limit === undefined) {
    return { errors };
  }

  const dto: ListLotesQueryDto = {
    page,
    limit
  };

  if (situacao) {
    dto.situacao = situacao;
  }

  if (dataInicio && dataInicio.trim().length > 0) {
    dto.dataInicio = dataInicio.trim();
  }

  if (dataFim && dataFim.trim().length > 0) {
    dto.dataFim = dataFim.trim();
  }

  if (valorMinimo !== undefined) {
    dto.valorMinimo = valorMinimo;
  }

  if (valorMaximo !== undefined) {
    dto.valorMaximo = valorMaximo;
  }

  if (isNonEmptyString(codigoLote)) {
    dto.codigoLote = codigoLote;
  }

  return {
    dto,
    errors
  };
};
