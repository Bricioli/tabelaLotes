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
            if (query.idLoteMin !== undefined && lote.id < query.idLoteMin) {
                return false;
            }
            if (query.idLoteMax !== undefined && lote.id > query.idLoteMax) {
                return false;
            }
            if (query.instituicao && !lote.instituicao.toLowerCase().includes(query.instituicao.toLowerCase())) {
                return false;
            }
            if (query.instituicaoResponsavel && !lote.instituicaoResponsavel.toLowerCase().includes(query.instituicaoResponsavel.toLowerCase())) {
                return false;
            }
            const createdAt = Date.parse(lote.dataCriacao);
            if (query.dataEntradaInicio && createdAt < Date.parse(query.dataEntradaInicio)) {
                return false;
            }
            if (query.dataEntradaFim && createdAt > Date.parse(query.dataEntradaFim)) {
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
        const sorted = query.sortBy ? this.sortLotes(filtered, query.sortBy, query.sortDirection ?? 'asc') : filtered;
        const total = sorted.length;
        const limit = query.limit;
        const page = query.page;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const startIndex = (page - 1) * limit;
        const data = sorted.slice(startIndex, startIndex + limit);
        return {
            data,
            total,
            page,
            totalPages
        };
    }
    sortLotes(lotes, sortBy, sortDirection) {
        return [...lotes].sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];
            if (valueA === valueB) {
                return 0;
            }
            const direction = sortDirection === 'desc' ? -1 : 1;
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                const dateFields = ['dataCriacao', 'dataHoraSituacaoLote'];
                if (dateFields.includes(sortBy)) {
                    return (Date.parse(valueA) - Date.parse(valueB)) * direction;
                }
                return valueA.localeCompare(valueB) * direction;
            }
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return (valueA - valueB) * direction;
            }
            return 0;
        });
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