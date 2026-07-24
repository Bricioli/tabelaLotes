import { SituacaoLote } from '../types/lote.types';

export interface UpdateLoteDto {
  valor?: number;
  situacao?: SituacaoLote;
  quantidadeItens?: number;
}

const allowedSituacoes: SituacaoLote[] = ['ABERTO', 'ENVIADO', 'CONFIRMADO'];

const isNumberValue = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export const parseUpdateLoteBody = (
  body: unknown
): { dto?: UpdateLoteDto; errors: string[] } => {
  const errors: string[] = [];

  if (body === null || typeof body !== 'object') {
    errors.push('Body deve ser um objeto JSON válido');
    return { errors };
  }

  const record = body as Record<string, unknown>;
  const keys = Object.keys(record);
  const allowedKeys = ['valor', 'situacao', 'quantidadeItens'];
  const invalidKeys = keys.filter((key: string): boolean => !allowedKeys.includes(key));

  if (invalidKeys.length > 0) {
    errors.push(`Propriedades inválidas no body: ${invalidKeys.join(', ')}`);
  }

  const dto: UpdateLoteDto = {};

  if ('valor' in record) {
    if (isNumberValue(record.valor)) {
      dto.valor = record.valor;
    } else {
      errors.push('valor deve ser um número válido');
    }
  }

  if ('situacao' in record) {
    if (typeof record.situacao === 'string' && allowedSituacoes.includes(record.situacao as SituacaoLote)) {
      dto.situacao = record.situacao as SituacaoLote;
    } else {
      errors.push(`situacao deve ser um dos valores: ${allowedSituacoes.join(', ')}`);
    }
  }

  if ('quantidadeItens' in record) {
    if (isNumberValue(record.quantidadeItens) && Number.isInteger(record.quantidadeItens) && record.quantidadeItens > 0) {
      dto.quantidadeItens = record.quantidadeItens;
    } else {
      errors.push('quantidadeItens deve ser um inteiro positivo');
    }
  }

  if (Object.keys(dto).length === 0) {
    errors.push('É necessário enviar ao menos um campo mutável: valor, situacao ou quantidadeItens');
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    dto,
    errors
  };
};
