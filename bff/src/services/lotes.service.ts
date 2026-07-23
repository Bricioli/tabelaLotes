import { Lote, PaginatedResponse } from '../types/lote.types';
import { ListLotesQueryDto } from '../dto/list-lotes-query.dto';
import { lotesDataService } from './lotes-data.service';

export class LotesService {
  private readonly dataService = lotesDataService;

  public list(query: ListLotesQueryDto): PaginatedResponse<Lote> {
    const filtered = this.dataService.getAll().filter((lote: Lote): boolean => {
      if (query.situacao && lote.situacao !== query.situacao) {
        return false;
      }

      if (query.codigoLote && !lote.codigoLote.toLowerCase().includes(query.codigoLote.toLowerCase())) {
        return false;
      }

      const createdAt = Date.parse(lote.dataCriacao);
      if (query.dataInicio && createdAt < Date.parse(query.dataInicio)) {
        return false;
      }

      if (query.dataFim && createdAt > Date.parse(query.dataFim)) {
        return false;
      }

      if (query.valorMinimo !== undefined && lote.valor < query.valorMinimo) {
        return false;
      }

      if (query.valorMaximo !== undefined && lote.valor > query.valorMaximo) {
        return false;
      }

      return true;
    });

    const total = filtered.length;
    const limit = query.limit;
    const page = query.page;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      total,
      page,
      totalPages
    };
  }

  public update(id: number, update: Partial<Pick<Lote, 'valor' | 'situacao' | 'quantidadeItens'>>): Lote | undefined {
    return this.dataService.update(id, update);
  }

  public bulkDelete(ids: number[]): { deleted: number } {
    const deleted = this.dataService.deleteByIds(ids);
    return { deleted };
  }
}

export const lotesService = new LotesService();
