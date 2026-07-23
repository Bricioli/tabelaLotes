import { Lote, PaginatedResponse } from '../types/lote.types';
import { ListLotesQueryDto } from '../dto/list-lotes-query.dto';
export declare class LotesService {
    private readonly dataService;
    list(query: ListLotesQueryDto): PaginatedResponse<Lote>;
    update(id: number, update: Partial<Pick<Lote, 'valor' | 'situacao' | 'quantidadeItens'>>): Lote | undefined;
    bulkDelete(ids: number[]): {
        deleted: number;
    };
}
export declare const lotesService: LotesService;
//# sourceMappingURL=lotes.service.d.ts.map