"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdateLoteBody = void 0;
const allowedSituacoes = ['ATIVO', 'PROCESSANDO', 'CANCELADO', 'CONCLUIDO'];
const isNumberValue = (value) => typeof value === 'number' && Number.isFinite(value);
const parseUpdateLoteBody = (body) => {
    const errors = [];
    if (body === null || typeof body !== 'object') {
        errors.push('Body deve ser um objeto JSON válido');
        return { errors };
    }
    const record = body;
    const keys = Object.keys(record);
    const allowedKeys = ['valor', 'situacao', 'quantidadeItens'];
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
        errors.push(`Propriedades inválidas no body: ${invalidKeys.join(', ')}`);
    }
    const dto = {};
    if ('valor' in record) {
        if (isNumberValue(record.valor)) {
            dto.valor = record.valor;
        }
        else {
            errors.push('valor deve ser um número válido');
        }
    }
    if ('situacao' in record) {
        if (typeof record.situacao === 'string' && allowedSituacoes.includes(record.situacao)) {
            dto.situacao = record.situacao;
        }
        else {
            errors.push(`situacao deve ser um dos valores: ${allowedSituacoes.join(', ')}`);
        }
    }
    if ('quantidadeItens' in record) {
        if (isNumberValue(record.quantidadeItens) && Number.isInteger(record.quantidadeItens) && record.quantidadeItens > 0) {
            dto.quantidadeItens = record.quantidadeItens;
        }
        else {
            errors.push('quantidadeItens deve ser um inteiro positivo');
        }
    }
    if (Object.keys(dto).length === 0) {
        errors.push('É necessário enviar ao menos um campo mutável: valor, situacao ou quantidadeItens');
    }
    if (errors.length > 0) {
        return { errors };
    }
    return {
        dto,
        errors
    };
};
exports.parseUpdateLoteBody = parseUpdateLoteBody;
//# sourceMappingURL=update-lote.dto.js.map