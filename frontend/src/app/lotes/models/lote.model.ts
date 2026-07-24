export type LoteSituacao = 'ABERTO' | 'ENVIADO' | 'CONFIRMADO' | 'TODAS';

export interface Lote {
  id: number;
  codigoLote: string;
  valor: number;
  dataCriacao: string;
  quantidadeLancamentos: number;
  usuarioRegistro: string;
  usuarioAprovacao: string;
  situacao: Exclude<LoteSituacao, 'TODAS'>;
  dataHoraSituacaoLote: string;
  instituicao?: string;
  instituicaoResponsavel?: string;
}

export interface LotesPage {
  data: Lote[];
  total: number;
  page: number;
  totalPages: number;
}

export const situacoesDisponiveis: LoteSituacao[] = ['TODAS', 'ABERTO', 'ENVIADO', 'CONFIRMADO'];
