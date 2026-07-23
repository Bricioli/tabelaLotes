import { Lote } from '../types/lote.types';
export declare class LotesDataService {
    private lotes;
    constructor();
    getAll(): readonly Lote[];
    getById(id: number): Lote | undefined;
    update(id: number, update: Partial<Pick<Lote, 'valor' | 'situacao' | 'quantidadeItens'>>): Lote | undefined;
    deleteByIds(ids: number[]): number;
}
export declare const lotesDataService: LotesDataService;
//# sourceMappingURL=lotes-data.service.d.ts.map