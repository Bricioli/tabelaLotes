export type SituacaoLote = 'ATIVO' | 'PROCESSANDO' | 'CANCELADO' | 'CONCLUIDO';

export interface Lote {
  id: number;
  codigoLote: string;
  valor: number;
  dataCriacao: string;
  situacao: SituacaoLote;
  quantidadeItens: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
