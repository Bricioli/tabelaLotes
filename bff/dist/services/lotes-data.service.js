"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lotesDataService = exports.LotesDataService = void 0;
const lotes_seed_1 = require("../data/lotes.seed");
class LotesDataService {
    lotes;
    constructor() {
        this.lotes = (0, lotes_seed_1.createSeedLotes)();
    }
    getAll() {
        return this.lotes;
    }
    getById(id) {
        return this.lotes.find((lote) => lote.id === id);
    }
    update(id, update) {
        const lote = this.getById(id);
        if (!lote) {
            return undefined;
        }
        if (update.valor !== undefined) {
            lote.valor = update.valor;
        }
        if (update.situacao !== undefined) {
            lote.situacao = update.situacao;
        }
        if (update.quantidadeItens !== undefined) {
            lote.quantidadeItens = update.quantidadeItens;
        }
        return lote;
    }
    deleteByIds(ids) {
        const deletionSet = new Set(ids);
        const originalLength = this.lotes.length;
        this.lotes = this.lotes.filter((lote) => !deletionSet.has(lote.id));
        return originalLength - this.lotes.length;
    }
}
exports.LotesDataService = LotesDataService;
exports.lotesDataService = new LotesDataService();
//# sourceMappingURL=lotes-data.service.js.map