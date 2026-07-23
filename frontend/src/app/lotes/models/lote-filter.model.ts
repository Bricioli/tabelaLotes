import { LoteSituacao } from './lote.model';

export interface LoteFilter {
  codigoLote?: string;
  situacao?: LoteSituacao;
  valorMinimo?: number;
  valorMaximo?: number;
  dataInicio?: string;
  dataFim?: string;
}

export const loteFilterDefault: LoteFilter = {
  situacao: 'TODAS'
};
