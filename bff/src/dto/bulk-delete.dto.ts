export interface BulkDeleteDto {
  ids: number[];
}

const isNumberValue = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export const parseBulkDeleteBody = (
  body: unknown
): { dto?: BulkDeleteDto; errors: string[] } => {
  const errors: string[] = [];

  if (body === null || typeof body !== 'object') {
    errors.push('Body deve ser um objeto JSON válido');
    return { errors };
  }

  const record = body as Record<string, unknown>;

  if (!('ids' in record)) {
    errors.push('Campo ids é obrigatório');
    return { errors };
  }

  if (!Array.isArray(record.ids) || record.ids.length === 0) {
    errors.push('ids deve ser um array não vazio de números');
    return { errors };
  }

  const ids: number[] = [];

  for (const item of record.ids) {
    if (isNumberValue(item) && Number.isInteger(item) && item > 0) {
      ids.push(item);
    } else {
      errors.push('Cada id deve ser um inteiro positivo');
      break;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { dto: { ids }, errors };
};
