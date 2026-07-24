# 📄 ADR 003: Contrato de Comunicação com o BFF, Tipagem Estrita, Tratamento de Erros e Resiliência (Retry)

- **Status:** Aceito
- **Data:** 2026-07-24

## Contexto e Problema

A comunicação entre o Frontend (Angular 21) e o BFF (Node.js/Express) precisa ser previsível e resiliente a falhas temporárias. Como o BFF simula um ambiente com instabilidades (através de um middleware de hostilidade que injeta taxas de erro HTTP 5xx e latência artificial), o sistema deve lidar com falhas transitórias sem travar a experiência do usuário, sem permitir perda de dados e mantendo o código limpo.

## Opções Consideradas

1. **Abordagem Permissiva / Tipagem Fraca (`any`) com Retry Infinito:**
   - _Prós:_ Menor tempo inicial de implementação.
   - _Contras:_ O uso de `any` gera perda de autocompletar, dificulta o refactoring por times grandes (5 devs), encobre bugs de contrato e um retry descontrolado sobrecarrega a rede e prende o usuário em loops infinitos.

2. **Tratamento de Erro Descentralizado diretamente nos Componentes de Tela:**
   - _Prós:_ Facilidade imediata para customizar mensagens por componente.
   - _Contras:_ Duplicação de código, vazamento de lógica de infraestrutura para a camada visual e falta de padronização nas mensagens exibidas.

3. **Contrato Estrito, Interceptação Global no Front, Banner Abstrato e Retry no Repositório — _Escolha Adotada_:**
   - _Prós:_ Padronização completa do contrato de dados via TypeScript (zero `any`), resiliência transparente no transporte de dados e experiência do usuário suave com feedbacks visuais amigáveis.
   - _Contras:_ Requer configuração rigorosa dos limites de tentativa no operador RxJS para não estender demais a espera na interface.

## Decisão

Decidiu-se adotar uma estratégia baseada nos seguintes pilares:

### 1. Governança e Tipagem Estrita de Ponta a Ponta

- **Proibição Estrita de `any`:** Todos os DTOs de entrada/saída no BFF e os modelos no Frontend utilizam interfaces do TypeScript fortemente tipadas (`Lote`, `ListLotesQueryDto`, etc.).
- **Prevenção no Linter/Git:** Regras de governança e _pre-commit hooks_ garantem a conformidade e evitam a introdução de tipos fracos no repositório.

### 2. Política de Retry e Resiliência no Repositório (`LoteRepository`)

- A política de retry é implementada no serviço HTTP do Angular via **RxJS** (`retry` com teto de tentativas).
- **Escopo e Teto Limitados:** O retry atua sobre falhas transitórias (erros HTTP 5xx/rede), limitado a **no máximo 2 tentativas extras**. Essa escolha impede que o usuário fique aguardando indeterminadamente em um estado de carregamento (_loading_).

### 3. Tratamento de Erros no Frontend e Exibição de Feedback

- **Captura via Interceptor:** O `HTTP Interceptor` captura os erros não sanados pelas tentativas de retry e direciona o estado de falha de forma limpa.
- **Banner Visual:** Quando a falha persiste, um banner de aviso de instabilidade (_"Instabilidade detectada, verifique a conexão e/ou tente novamente"_) é exibido na interface de forma não destrutiva, provendo um botão para acionamento manual.
- _Nota de Implementação do BFF:_ No cenário atual, os erros do BFF utilizam mensagens genéricas capturadas pelo Front, permanecendo a criação de um utilitário global/centralizado de tratamento de exceções no BFF como um ponto de evolução técnica mapeado.

## Consequências

### Positivas

- **Manutenibilidade e Segurança:** Tipagem total elimina erros em tempo de execução causados por alteração de propriedades no contrato da API.
- **Resiliência Transparente:** Oscilações rápidas de rede são resolvidas em milissegundos pela política de retry sem intervenção do usuário.
- **Arquitetura Visual Limpa:** Componentes de tela apenas reagem ao estado de erro emitido pela Store, sem gerenciar requisições de rede ou contadores de tentativa.

### Negativas

- Exige atenção para manter os modelos do BFF e do Frontend sincronizados sempre que o contrato de um endpoint mudar.

## Gatilho de Revisão

Esta decisão e seus parâmetros serão revisitados nos seguintes cenários:

- **Evolução do Tratamento de Erros no BFF:** Conforme a aplicação crescer, o BFF será estendido para adotar uma classe de utilitário/handler de exceções centralizado, padronizando os códigos de erro do banco/regra de negócio em mensagens amigáveis (_User-Friendly_) antes de enviar ao Frontend, que por sua vez utilizará um utilitário no Interceptor para mapeá-las.
- **Ajuste Fino de UX na Política de Retry:** Se métricas de uso ou _telemetria/feedback_ dos usuários indicarem que o tempo de espera do retry atual ou o número de tentativas está trazendo atrito ou atrasando a experiência, os parâmetros do operador RxJS (tempo de backoff e quantidade de retries) serão reavaliados e ajustados com base em dados reais de uso.
