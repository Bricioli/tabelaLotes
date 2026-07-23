Atue como Tech Lead Sênior e arquiteto de software. Crie os arquivos de governança, containerização e padronização para a raiz do projeto 'tabelaLotes'.

Requisitos do Projeto:

- Timebox estrito de 10 horas com foco na redução de risco por hora investida.
- Monorepo simples com pastas '/frontend' (Angular Material) e '/bff' (Node.js/Express).

Gere os seguintes arquivos completos na raiz:

1. docker-compose.yml:
   - Serviço 'bff': build na pasta ./bff, expõe a porta 3000. Variáveis de ambiente: LATENCY_MS=3000, FAILURE_RATE=0.2 e PORT=3000.
   - Serviço 'frontend': build na pasta ./frontend (multi-stage com Nginx), expõe a porta 4200.
   - Network interna conectando ambos.

2. frontend/Dockerfile:
   - Multi-stage build: Stage 1 (Node 22) faz o 'npm run build'. Stage 2 (Nginx) copia os estáticos para /usr/share/nginx/html e escuta na porta 80.
   - Inclua um arquivo nginx.conf customizado para redirecionar rotas SPA para o index.html.

3. bff/Dockerfile:
   - Multi-stage build leve em Node 22 Alpine rodando em produção.

4. Configurações de Governança e Linter (na raiz ou ajustado para cada pasta):
   - .eslintrc.json com regras estritas em TypeScript: proibir uso de 'any', exigir retorno tipado em funções e proibir chamadas do HttpClient do Angular diretamente fora da camada de Repository/Service.
   - .prettierrc com tabWidth: 2, singleQuote: true e printWidth: 100.
   - .husky e lint-staged configurados no package.json da raiz para rodar 'eslint --fix' e 'prettier --write' no pre-commit.
