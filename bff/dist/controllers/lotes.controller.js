"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteLotesHandler = exports.updateLoteHandler = exports.listLotesHandler = void 0;
const lotes_service_1 = require("../services/lotes.service");
const list_lotes_query_dto_1 = require("../dto/list-lotes-query.dto");
const update_lote_dto_1 = require("../dto/update-lote.dto");
const bulk_delete_dto_1 = require("../dto/bulk-delete.dto");
const toSingleStringQuery = (query) => {
    return Object.fromEntries(Object.entries(query).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
};
const listLotesHandler = (req, res) => {
    const query = toSingleStringQuery(req.query);
    const { dto, errors } = (0, list_lotes_query_dto_1.parseListLotesQuery)(query);
    if (errors.length > 0 || dto === undefined) {
        return res.status(400).json({ errors });
    }
    const result = lotes_service_1.lotesService.list(dto);
    return res.status(200).json(result);
};
exports.listLotesHandler = listLotesHandler;
const updateLoteHandler = (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
        return res.status(400).json({ errors: ['id deve ser um inteiro positivo'] });
    }
    const { dto, errors } = (0, update_lote_dto_1.parseUpdateLoteBody)(req.body);
    if (errors.length > 0 || dto === undefined) {
        return res.status(400).json({ errors });
    }
    const lote = lotes_service_1.lotesService.update(id, dto);
    if (!lote) {
        return res.status(404).json({ message: 'Lote não encontrado' });
    }
    return res.status(200).json(lote);
};
exports.updateLoteHandler = updateLoteHandler;
const bulkDeleteLotesHandler = (req, res) => {
    const { dto, errors } = (0, bulk_delete_dto_1.parseBulkDeleteBody)(req.body);
    if (errors.length > 0 || dto === undefined) {
        return res.status(400).json({ errors });
    }
    const result = lotes_service_1.lotesService.bulkDelete(dto.ids);
    return res.status(200).json(result);
};
exports.bulkDeleteLotesHandler = bulkDeleteLotesHandler;
//# sourceMappingURL=lotes.controller.js.map