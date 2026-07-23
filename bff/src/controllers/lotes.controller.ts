import { Request, Response } from 'express';
import { lotesService } from '../services/lotes.service';
import { parseListLotesQuery } from '../dto/list-lotes-query.dto';
import { parseUpdateLoteBody } from '../dto/update-lote.dto';
import { parseBulkDeleteBody } from '../dto/bulk-delete.dto';

interface LoteIdParams {
  id: string;
}

const toSingleStringQuery = (
  query: Record<string, string | string[] | undefined>
): Record<string, string | undefined> => {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );
};

type StringQuery = Record<string, string | string[] | undefined>;

export const listLotesHandler = (
  req: Request<Record<string, never>, unknown, unknown, StringQuery>,
  res: Response
): Response => {
  const query = toSingleStringQuery(req.query);
  const { dto, errors } = parseListLotesQuery(query);

  if (errors.length > 0 || dto === undefined) {
    return res.status(400).json({ errors });
  }

  const result = lotesService.list(dto);
  return res.status(200).json(result);
};

export const updateLoteHandler = (req: Request<LoteIdParams>, res: Response): Response => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id) || id < 1) {
    return res.status(400).json({ errors: ['id deve ser um inteiro positivo'] });
  }

  const { dto, errors } = parseUpdateLoteBody(req.body);
  if (errors.length > 0 || dto === undefined) {
    return res.status(400).json({ errors });
  }

  const lote = lotesService.update(id, dto);

  if (!lote) {
    return res.status(404).json({ message: 'Lote não encontrado' });
  }

  return res.status(200).json(lote);
};

export const bulkDeleteLotesHandler = (req: Request, res: Response): Response => {
  const { dto, errors } = parseBulkDeleteBody(req.body);

  if (errors.length > 0 || dto === undefined) {
    return res.status(400).json({ errors });
  }

  const result = lotesService.bulkDelete(dto.ids);
  return res.status(200).json(result);
};
