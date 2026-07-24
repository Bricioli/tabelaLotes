# 📄 ADR 001: Gerenciamento de Estado Reativo com Custom Signal Store e RxJS

- **Status:** Aceito
- **Data:** 2026-07-24

## Contexto e Problema

A aplicação precisa escalar para suportar até 40 telas mantidas por um time de 5 desenvolvedores. É necessário definir uma arquitetura de gerenciamento de estado consistente, preditiva e de alto desempenho que garanta a integridade dos dados na interface, evite concorrência desordenada, previna _merge conflicts_ frequentes e mantenha a facilidade de manutenção sem adicionar verbosidade desnecessária (_boilerplate_).

## Opções Consideradas

1. **NgRx Store Tradicional (Redux Pattern):**
   - _Prós:_ Arquitetura consolidada e ferramentas de _dev-tools_ maduras.
   - _Contras:_ Altíssima verbosidade (Actions, Reducers, Effects, Selectors para cada tela), curva de aprendizado elevada e gargalo de produtividade no timebox para 40 telas.

2. **RxJS Puro em Serviços (`BehaviorSubject` / `Subject`):**
   - _Prós:_ Nativo do ecossistema Angular clássico, sem bibliotecas adicionais.
   - _Contras:_ Exige gerenciamento manual complexo de inscrições (`unsubscribe`/`async pipe`), suscetível a _memory leaks_ e vazamento de mutações de estado diretas por falta de encapsulamento rígido.

3. **Custom Signal Store (Signals Nativos + RxJS para I/O) — _Escolha Adotada_:**
   - _Prós:_ Reatividade granular e de alta performance nativa do Angular modernizado (v17+), baixíssimo _boilerplate_, sincronização simples de componentes e encapsulamento rígido de mutações.

## Decisão

Decidiu-se adotar o padrão **Custom Signal Store** para o gerenciamento de estado das telas/funcionalidades, combinado com **RxJS** estritamente para o tratamento de fluxos assíncronos e chamadas HTTP via `HttpClient`.

A Store (ex: `LoteStore`) atua como a **Fonte Única da Verdade (_Single Source of Truth_)** de determinado contexto:

- Expõe o estado como `signals` somente leitura (`readonly`) para os componentes.
- Utiliza `computed` para estados derivados (ex: cálculo de paginação, validação de limites).
- Concentra de forma imperativa todas as rotinas de atualização de estado, impedindo mutações diretas por parte das Views.
- Utiliza RxJS para orquestrar as requisições ao BFF (operadores de transformação, cancelamento de requisições obsoletas e políticas de erro).

## Consequências

### Positivas

- **Prevenção de Conflitos e Paralelismo:** Com o estado de cada módulo encapsulado em sua respectiva Store, 5 desenvolvedores conseguem atuar simultaneamente em telas distintas sem gerar acoplamento ou colisões no Git.
- **Desempenho e Granularidade:** O motor de reatividade do Angular atualiza diretamente os nós do DOM afetados pelo `signal`, dispensando a checagem de mudança profunda (_zone.js_).
- **Simplicidade e Padronização:** Redução drástica da quantidade de arquivos necessários por funcionalidade em comparação ao NgRx Redux, facilitando a manutenção futura e o onboarding da equipe.

### Negativas

- Exige que a equipe siga rigorosamente a convenção de não bypassar a Store criando estados locais paralelos e desordenados em componentes complexos.

## Gatilho de Revisão

Esta decisão será revisitada caso o tamanho da aplicação ou a complexidade de uma funcionalidade específica cresça a ponto de centralizar tudo em uma única Store virar um gargalo de manutenção, desenvolvimento ou performance. Nessa situação, o modelo será reavaliado para descentralizar o estado em sub-stores mais granulares ou adaptar a arquitetura, mantendo a premissa de organização e previsibilidade do processamento dos dados.
