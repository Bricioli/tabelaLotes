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
export declare const parseListLotesQuery: (query: Record<string, string | undefined>) => {
    dto?: ListLotesQueryDto;
    errors: string[];
};
//# sourceMappingURL=list-lotes-query.dto.d.ts.map