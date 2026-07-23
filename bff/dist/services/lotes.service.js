"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lotesService = exports.LotesService = void 0;
const lotes_data_service_1 = require("./lotes-data.service");
class LotesService {
    dataService = lotes_data_service_1.lotesDataService;
    list(query) {
        const filtered = this.dataService.getAll().filter((lote) => {
            if (query.situacao && lote.situacao !== query.situacao) {
                return false;
            }
            if (query.codigoLote && !lote.codigoLote.toLowerCase().includes(query.codigoLote.toLowerCase())) {
                return false;
            }
            const createdAt = Date.parse(lote.dataCriacao);
            if (query.dataInicio && createdAt < Date.parse(query.dataInicio)) {
                return false;
            }
            if (query.dataFim && createdAt > Date.parse(query.dataFim)) {
                return false;
            }
            if (query.valorMinimo !== undefined && lote.valor < query.valorMinimo) {
                return false;
            }
            if (query.valorMaximo !== undefined && lote.valor > query.valorMaximo) {
                return false;
            }
            return true;
        });
        const total = filtered.length;
        const limit = query.limit;
        const page = query.page;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const startIndex = (page - 1) * limit;
        const data = filtered.slice(startIndex, startIndex + limit);
        return {
            data,
            total,
            page,
            totalPages
        };
    }
    update(id, update) {
        return this.dataService.update(id, update);
    }
    bulkDelete(ids) {
        const deleted = this.dataService.deleteByIds(ids);
        return { deleted };
    }
}
exports.LotesService = LotesService;
exports.lotesService = new LotesService();
//# sourceMappingURL=lotes.service.js.map