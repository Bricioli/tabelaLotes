"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseListLotesQuery = void 0;
const allowedSituacoes = ['ATIVO', 'PROCESSANDO', 'CANCELADO', 'CONCLUIDO'];
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const parseInteger = (value, name, errors) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        errors.push(`${name} deve ser um inteiro válido`);
        return undefined;
    }
    return parsed;
};
const parseFloatValue = (value, name, errors) => {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
        errors.push(`${name} deve ser um número válido`);
        return undefined;
    }
    return parsed;
};
const isIsoDateString = (value) => !Number.isNaN(Date.parse(value));
const parseListLotesQuery = (query) => {
    const errors = [];
    const page = query.page ? parseInteger(query.page, 'page', errors) : 1;
    const limit = query.limit ? parseInteger(query.limit, 'limit', errors) : 20;
    if (page !== undefined && page < 1) {
        errors.push('page deve ser maior ou igual a 1');
    }
    if (limit !== undefined && limit < 1) {
        errors.push('limit deve ser maior ou igual a 1');
    }
    let situacao;
    if (query.situacao) {
        if (allowedSituacoes.includes(query.situacao)) {
            situacao = query.situacao;
        }
        else {
            errors.push(`situacao deve ser um dos valores: ${allowedSituacoes.join(', ')}`);
        }
    }
    const dataInicio = query.dataInicio;
    if (dataInicio && !isIsoDateString(dataInicio)) {
        errors.push('dataInicio deve ser uma data ISO válida');
    }
    const dataFim = query.dataFim;
    if (dataFim && !isIsoDateString(dataFim)) {
        errors.push('dataFim deve ser uma data ISO válida');
    }
    const valorMinimo = query.valorMinimo ? parseFloatValue(query.valorMinimo, 'valorMinimo', errors) : undefined;
    const valorMaximo = query.valorMaximo ? parseFloatValue(query.valorMaximo, 'valorMaximo', errors) : undefined;
    if (valorMinimo !== undefined && valorMaximo !== undefined && valorMinimo > valorMaximo) {
        errors.push('valorMinimo não pode ser maior que valorMaximo');
    }
    const codigoLote = query.codigoLote?.trim();
    if (errors.length > 0 || page === undefined || limit === undefined) {
        return { errors };
    }
    const dto = {
        page,
        limit
    };
    if (situacao) {
        dto.situacao = situacao;
    }
    if (dataInicio && dataInicio.trim().length > 0) {
        dto.dataInicio = dataInicio.trim();
    }
    if (dataFim && dataFim.trim().length > 0) {
        dto.dataFim = dataFim.trim();
    }
    if (valorMinimo !== undefined) {
        dto.valorMinimo = valorMinimo;
    }
    if (valorMaximo !== undefined) {
        dto.valorMaximo = valorMaximo;
    }
    if (isNonEmptyString(codigoLote)) {
        dto.codigoLote = codigoLote;
    }
    return {
        dto,
        errors
    };
};
exports.parseListLotesQuery = parseListLotesQuery;
//# sourceMappingURL=list-lotes-query.dto.js.map