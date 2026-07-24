import { Lote, SituacaoLote } from '../types/lote.types';

const situacoes: SituacaoLote[] = ['ABERTO', 'ENVIADO', 'CONFIRMADO'];
const instituicoes = ['Banco Brasil', 'Caixa Econômica', 'Itaú Unibanco', 'Santander Brasil'];
const instituicoesResponsaveis = ['Central Finanças', 'Compliance', 'Gestão de Risco', 'Operações'];
const usuariosRegistro = [
  'ana.silva',
  'bruno.ramos',
  'carla.melo',
  'douglas.sousa',
  'jared.ricioli',
];
const usuariosAprovacao = ['ednaldo.k', 'fernanda.p', 'guilherme.n', 'helena.t', 'jared.ricioli'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const BRAZIL_OFFSET_MINUTES = -3 * 60;

const pad = (value: number, length = 2): string => String(value).padStart(length, '0');

const formatBrazilianDateTime = (epochMs: number, includeMilliseconds = true): string => {
  const brazilEpoch = epochMs + BRAZIL_OFFSET_MINUTES * 60 * 1000;
  const date = new Date(brazilEpoch);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = pad(date.getUTCMilliseconds(), 3);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${includeMilliseconds ? `.${milliseconds}` : ''}-03:00`;
};

const createLote = (index: number): Lote => {
  const id = index + 1;
  const situacao = situacoes[(id - 1) % situacoes.length]!;
  const brazilMidnightUtc = Date.UTC(2024, 0, 1, 3, 0, 0, 0);
  const dataCriacaoEpoch = brazilMidnightUtc + (id - 1) * MS_PER_DAY;
  const dataCriacao = formatBrazilianDateTime(dataCriacaoEpoch);
  const dataHoraSituacaoLote = formatBrazilianDateTime(
    dataCriacaoEpoch + ((id % 24) * 60 + 30) * 60 * 1000,
  );

  return {
    id,
    codigoLote: `LOT-${String(id).padStart(4, '0')}`,
    valor: 100 + ((id * 17) % 9900),
    dataCriacao,
    quantidadeLancamentos: ((id * 4) % 12) + 1,
    usuarioRegistro: usuariosRegistro[(id - 1) % usuariosRegistro.length]!,
    usuarioAprovacao: usuariosAprovacao[(id - 1) % usuariosAprovacao.length]!,
    situacao,
    dataHoraSituacaoLote,
    instituicao: instituicoes[(id - 1) % instituicoes.length]!,
    instituicaoResponsavel: instituicoesResponsaveis[(id - 1) % instituicoesResponsaveis.length]!,
    quantidadeItens: ((id * 3) % 500) + 1,
  };
};

export const createSeedLotes = (): Lote[] => {
  return Array.from({ length: 5000 }, (_, index) => createLote(index));
};
