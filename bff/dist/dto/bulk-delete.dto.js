"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBulkDeleteBody = void 0;
const isNumberValue = (value) => typeof value === 'number' && Number.isFinite(value);
const parseBulkDeleteBody = (body) => {
    const errors = [];
    if (body === null || typeof body !== 'object') {
        errors.push('Body deve ser um objeto JSON válido');
        return { errors };
    }
    const record = body;
    if (!('ids' in record)) {
        errors.push('Campo ids é obrigatório');
        return { errors };
    }
    if (!Array.isArray(record.ids) || record.ids.length === 0) {
        errors.push('ids deve ser um array não vazio de números');
        return { errors };
    }
    const ids = [];
    for (const item of record.ids) {
        if (isNumberValue(item) && Number.isInteger(item) && item > 0) {
            ids.push(item);
        }
        else {
            errors.push('Cada id deve ser um inteiro positivo');
            break;
        }
    }
    if (errors.length > 0) {
        return { errors };
    }
    return { dto: { ids }, errors };
};
exports.parseBulkDeleteBody = parseBulkDeleteBody;
//# sourceMappingURL=bulk-delete.dto.js.map