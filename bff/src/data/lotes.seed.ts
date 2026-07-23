import { Lote, SituacaoLote } from '../types/lote.types';

const situacoes: SituacaoLote[] = ['ATIVO', 'PROCESSANDO', 'CANCELADO', 'CONCLUIDO'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const createLote = (index: number): Lote => {
  const id = index + 1;
  const situacaoIndex = (id - 1) % situacoes.length;
  const situacao = situacoes[situacaoIndex] as SituacaoLote;
  const dataCriacao = new Date(Date.UTC(2024, 0, 1) + (id - 1) * MS_PER_DAY).toISOString();

  return {
    id,
    codigoLote: `LOT-${String(id).padStart(4, '0')}`,
    valor: 100 + ((id * 17) % 9900),
    dataCriacao,
    situacao,
    quantidadeItens: ((id * 3) % 500) + 1
  };
};

export const createSeedLotes = (): Lote[] => {
  return Array.from({ length: 5000 }, (_, index) => createLote(index));
};
