import { SituacaoLote } from '../types/lote.types';
export interface UpdateLoteDto {
    valor?: number;
    situacao?: SituacaoLote;
    quantidadeItens?: number;
}
export declare const parseUpdateLoteBody: (body: unknown) => {
    dto?: UpdateLoteDto;
    errors: string[];
};
//# sourceMappingURL=update-lote.dto.d.ts.map