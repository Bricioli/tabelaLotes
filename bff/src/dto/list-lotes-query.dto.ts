import { SituacaoLote } from '../types/lote.types';

export interface ListLotesQueryDto {
  page: number;
  limit: number;
  situacao?: SituacaoLote;
  idLoteMin?: number;
  idLoteMax?: number;
  valorMinimo?: number;
  valorMaximo?: number;
  dataEntradaInicio?: string;
  dataEntradaFim?: string;
  codigoLote?: string;
  instituicao?: string;
  instituicaoResponsavel?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const allowedSituacoes: SituacaoLote[] = ['ABERTO', 'ENVIADO', 'CONFIRMADO'];
const allowedSortFields = [
  'id',
  'codigoLote',
  'dataCriacao',
  'valor',
  'quantidadeLancamentos',
  'usuarioRegistro',
  'usuarioAprovacao',
  'situacao',
  'dataHoraSituacaoLote',
];

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

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

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/;

const isIsoDateString = (value: string): boolean => {
  const trimmed = value.trim();

  if (DATE_ONLY_PATTERN.test(trimmed)) {
    return true;
  }

  if (!ISO_DATE_TIME_PATTERN.test(trimmed)) {
    return false;
  }

  return !Number.isNaN(Date.parse(trimmed));
};

export const parseListLotesQuery = (
  query: Record<string, string | undefined>,
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

  const dataInicio = query.dataEntradaInicio;
  if (dataInicio && !isIsoDateString(dataInicio)) {
    errors.push('dataEntradaInicio deve ser uma data ISO válida');
  }

  const dataFim = query.dataEntradaFim;
  if (dataFim && !isIsoDateString(dataFim)) {
    errors.push('dataEntradaFim deve ser uma data ISO válida');
  }

  const idLoteMin = query.idLoteMin
    ? parseInteger(query.idLoteMin, 'idLoteMin', errors)
    : undefined;
  const idLoteMax = query.idLoteMax
    ? parseInteger(query.idLoteMax, 'idLoteMax', errors)
    : undefined;
  const valorMinimo = query.valorMinimo
    ? parseFloatValue(query.valorMinimo, 'valorMinimo', errors)
    : undefined;
  const valorMaximo = query.valorMaximo
    ? parseFloatValue(query.valorMaximo, 'valorMaximo', errors)
    : undefined;

  if (idLoteMin !== undefined && idLoteMax !== undefined && idLoteMin > idLoteMax) {
    errors.push('idLoteMin não pode ser maior que idLoteMax');
  }

  if (valorMinimo !== undefined && valorMaximo !== undefined && valorMinimo > valorMaximo) {
    errors.push('valorMinimo não pode ser maior que valorMaximo');
  }

  const codigoLote = query.codigoLote?.trim();

  if (errors.length > 0 || page === undefined || limit === undefined) {
    return { errors };
  }

  const dto: ListLotesQueryDto = {
    page,
    limit,
  };

  if (situacao) {
    dto.situacao = situacao;
  }

  if (idLoteMin !== undefined) {
    dto.idLoteMin = idLoteMin;
  }

  if (idLoteMax !== undefined) {
    dto.idLoteMax = idLoteMax;
  }

  if (valorMinimo !== undefined) {
    dto.valorMinimo = valorMinimo;
  }

  if (valorMaximo !== undefined) {
    dto.valorMaximo = valorMaximo;
  }

  if (dataInicio && dataInicio.trim().length > 0) {
    dto.dataEntradaInicio = dataInicio.trim();
  }

  if (dataFim && dataFim.trim().length > 0) {
    dto.dataEntradaFim = dataFim.trim();
  }

  if (isNonEmptyString(codigoLote)) {
    dto.codigoLote = codigoLote;
  }

  const instituicao = query.instituicao?.trim();
  if (isNonEmptyString(instituicao)) {
    dto.instituicao = instituicao;
  }

  const instituicaoResponsavel = query.instituicaoResponsavel?.trim();
  if (isNonEmptyString(instituicaoResponsavel)) {
    dto.instituicaoResponsavel = instituicaoResponsavel;
  }

  const sortBy = query.sortBy?.trim();
  if (isNonEmptyString(sortBy) && allowedSortFields.includes(sortBy)) {
    dto.sortBy = sortBy;
  }

  const sortDirectionValue = query.sortDirection?.trim().toLowerCase();
  if (sortDirectionValue === 'asc' || sortDirectionValue === 'desc') {
    dto.sortDirection = sortDirectionValue;
  }

  return {
    dto,
    errors,
  };
};
