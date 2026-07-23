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
export declare const parseListLotesQuery: (query: Record<string, string | undefined>) => {
    dto?: ListLotesQueryDto;
    errors: string[];
};
//# sourceMappingURL=list-lotes-query.dto.d.ts.map