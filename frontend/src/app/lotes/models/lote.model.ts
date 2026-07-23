export type LoteSituacao = 'ATIVO' | 'PROCESSANDO' | 'CANCELADO' | 'CONCLUIDO' | 'TODAS';

export interface Lote {
  id: number;
  codigoLote: string;
  valor: number;
  dataCriacao: string;
  situacao: Exclude<LoteSituacao, 'TODAS'>;
  quantidadeItens: number;
}

export interface LotesPage {
  data: Lote[];
  total: number;
  page: number;
  totalPages: number;
}

export const situacoesDisponiveis: LoteSituacao[] = ['TODAS', 'ATIVO', 'PROCESSANDO', 'CANCELADO', 'CONCLUIDO'];
