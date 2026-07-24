export type SituacaoLote = 'ABERTO' | 'ENVIADO' | 'CONFIRMADO';
export interface Lote {
    id: number;
    codigoLote: string;
    valor: number;
    dataCriacao: string;
    quantidadeLancamentos: number;
    usuarioRegistro: string;
    usuarioAprovacao: string;
    situacao: SituacaoLote;
    dataHoraSituacaoLote: string;
    instituicao: string;
    instituicaoResponsavel: string;
    quantidadeItens: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}
//# sourceMappingURL=lote.types.d.ts.map