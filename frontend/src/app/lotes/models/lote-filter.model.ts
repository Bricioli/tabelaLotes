import { LoteSituacao } from './lote.model';

export interface LoteFilter {
  instituicaoResponsavel?: string;
  instituicao?: string;
  situacaoLote?: LoteSituacao;
  idLoteMin?: number;
  idLoteMax?: number;
  valorMinimo?: number;
  valorMaximo?: number;
  dataEntradaInicio?: string;
  dataEntradaFim?: string;
}

export const loteFilterDefault: LoteFilter = {
  situacaoLote: 'TODAS',
};
