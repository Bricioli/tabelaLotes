"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeedLotes = void 0;
const situacoes = ['ABERTO', 'ENVIADO', 'CONFIRMADO'];
const instituicoes = ['Banco Brasil', 'Caixa Econômica', 'Itaú Unibanco', 'Santander Brasil'];
const instituicoesResponsaveis = ['Central Finanças', 'Compliance', 'Gestão de Risco', 'Operações'];
const usuariosRegistro = ['ana.silva', 'bruno.ramos', 'carla.melo', 'douglas.sousa'];
const usuariosAprovacao = ['ednaldo.k', 'fernanda.p', 'guilherme.n', 'helena.t'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const createLote = (index) => {
    const id = index + 1;
    const situacao = situacoes[(id - 1) % situacoes.length];
    const dataCriacao = new Date(Date.UTC(2024, 0, 1) + (id - 1) * MS_PER_DAY).toISOString();
    const createdAtDate = new Date(dataCriacao);
    const dataHoraSituacaoLote = new Date(createdAtDate.getTime() + ((id % 24) * 60 + 30) * 60 * 1000).toISOString();
    return {
        id,
        codigoLote: `LOT-${String(id).padStart(4, '0')}`,
        valor: 100 + ((id * 17) % 9900),
        dataCriacao,
        quantidadeLancamentos: ((id * 4) % 12) + 1,
        usuarioRegistro: usuariosRegistro[(id - 1) % usuariosRegistro.length],
        usuarioAprovacao: usuariosAprovacao[(id - 1) % usuariosAprovacao.length],
        situacao,
        dataHoraSituacaoLote,
        instituicao: instituicoes[(id - 1) % instituicoes.length],
        instituicaoResponsavel: instituicoesResponsaveis[(id - 1) % instituicoesResponsaveis.length],
        quantidadeItens: ((id * 3) % 500) + 1,
    };
};
const createSeedLotes = () => {
    return Array.from({ length: 5000 }, (_, index) => createLote(index));
};
exports.createSeedLotes = createSeedLotes;
//# sourceMappingURL=lotes.seed.js.map