Atue como desenvolvedor Backend Sênior. Crie a API do BFF para a listagem e controle de Lotes dentro da pasta '/bff'.

Requisitos das Especificações do Teste:

1. Massa de Dados:
   - Gere em memória uma lista determinística de exatamente 5.000 lotes.
   - Campos de cada Lote: id (number), codigoLote (string 'LOT-XXXX'), valor (number), dataCriacao (ISO string), situacao ('ATIVO' | 'PROCESSANDO' | 'CANCELADO' | 'CONCLUIDO'), quantidadeItens (number).

2. Middleware de Hostilidade do BFF (Requisito Crítico):
   - Crie o middleware 'hostility.middleware.ts' que lê as variáveis LATENCY_MS (3000) e FAILURE_RATE (0.2).
   - Deve injetar um atraso (delay) artificial configurável antes de responder.
   - Deve lançar erro HTTP 500 ou 503 aleatoriamente em FAILURE_RATE % das requisições para simular instabilidade de infraestrutura.

3. Endpoints Restful:
   - GET /api/v1/lotes: Aceita query params para paginação (page, limit) e filtros opcionais: 'situacao', 'dataInicio', 'dataFim', 'valorMinimo', 'valorMaximo', 'codigoLote'. Retorna payload paginado contendo { data: Lote[], total: number, page: number, totalPages: number }.
   - POST /api/v1/lotes/bulk-delete: Recebe array de IDs e simula exclusão.
   - PUT /api/v1/lotes/:id: Altera um lote.

4. Arquitetura em TypeScript:
   - Separe em rotas, controllers, services e middlewares. Tipagem estrita de DTOs de entrada e saída. Zero uso de 'any'.
