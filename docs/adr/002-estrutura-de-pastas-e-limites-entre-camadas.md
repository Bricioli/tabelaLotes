# 📄 ADR 002: Estrutura de Pastas, Limites entre Camadas e Módulos por Domínio

- **Status:** Aceito
- **Data:** 2026-07-24

## Contexto e Problema

Com a perspectiva de a aplicação crescer para até 40 telas e contar com 5 desenvolvedores atuando concorrentemente, misturar arquivos de diferentes contextos em pastas globais no nível raiz (ex: uma pasta global `/components` com 200 componentes de telas distintas) torna-se inviável. Esse modelo gera alto acoplamento, dificulta a navegação, provoca conflitos de _merge_ e resulta em refatorações dispendiosas. É necessário estabelecer uma estrutura de pastas modularizada por domínio, com limites claros de responsabilidades e isolamento técnico interno.

## Opções Consideradas

1. **Estrutura por Camadas Globais no Nível Raiz (Layer-First Global):**
   - _Prós:_ Simplicidade inicial em projetos pequenos.
   - _Contras:_ Alto acoplamento horizontal. Alterar um fluxo de "lotes" exige navegar por pastas globais distantes (`/src/components`, `/src/services`). Dificulta a atuação paralela de 5 devs em telas diferentes.

2. **Organização por Módulos de Domínio com Subdivisão Técnica Interna — _Escolha Adotada_:**
   - _Prós:_ Concentra o contexto de negócio dentro de sua própria pasta de domínio (ex: `app/lotes`), enquanto mantém a previsibilidade com subpastas técnicas bem definidas. Garante alta coesão e facilidade de manutenção.
   - _Contras:_ Requer disciplina da equipe para criar o padrão de pastas dentro de cada novo domínio sem pular etapas.

## Decisão

Decidiu-se adotar a organização por **Módulos de Domínio Encapsulados (Vertical Slicing por Feature/Bounded Context)** no Frontend (Angular 21) e uma **Arquitetura em Camadas Desacopladas (Layered Architecture)** no BFF (Node.js + Express).

### 1. Estrutura e Limites no Frontend (`frontend/src/app/lotes`)

Como evidenciado na estrutura do projeto, cada contexto de negócio vive isolado em sua pasta raiz (ex: `app/lotes/`), possuindo subpastas internas organizadas por responsabilidade técnica:

- **`pages/` (`lote-management-page`):** Atuam como containers/orquestradores de layout da tela.
- **`components/` (`lote-table`, `lote-filter-form`, `lote-actions-bar`):** Componentes de interface focados que "vivem em seu próprio mundo", recebendo entradas e emitindo eventos sem acoplamento direto com a estrutura pai.
- **`store/` (`lote.store.ts`, `http-state.service.ts`):** Concentra o gerenciamento de estado reativo do contexto e o controle de estado HTTP.
- **`services/` (`lote.repository.ts`):** Camada de repositório que isola os contratos e as chamadas ao BFF.
- **`interceptors/`, `validators/`, `models/`:** Utilitários e regras transversais exclusivas do módulo.

### 2. Estrutura e Limites no BFF (`bff/src/`)

No BFF, aplica-se a separação estrita entre rotas, controladores, regras de negócio e persistência:

- **`routes/` (`lotes.routes.ts`):** Mapeamento e declaração das rotas express.
- **`controllers/` (`lotes.controller.ts`):** Recebe as requisições HTTP e devolve a resposta formatada.
- **`dto/` (`list-lotes-query.dto.ts`, `bulk-delete.dto.ts`):** Validação e tipagem estrita das entradas da API.
- **`services/` (`lotes.service.ts`, `lotes-data.service.ts`):** Onde residem as regras de domínio, ordenação, manipulação de limites temporais e mutações.
- **`middlewares/` (`hostility.middleware.ts`):** Tratamento transversal de taxas de falhas simuladas, erro e latência.
- **`data/` (`lotes.seed.ts`):** Carga e geração dos dados iniciais.

## Consequências

### Positivas

- **Previsibilidade e Navegação Instantânea:** Qualquer desenvolvedor sabe exatamente onde encontrar as regras de um domínio (tudo sobre lotes está sob `app/lotes/`).
- **Baixo Risco de Regressão e Conflitos:** Atuar em um módulo não afeta as subpastas técnicas de outros domínios.
- **Testabilidade Isolada:** Arquivos `.spec.ts` ficam colados aos seus respectivos componentes, DTOs e serviços, facilitando a execução e manutenção da suíte unitária.
- **Respeito ao Clean Architecture:** O BFF separa rotas, DTOs e Services, impedindo vazamento de lógica de negócio para os Controllers Express.

### Negativas

- Exige atenção do time para promover utilitários ou componentes repetidos para uma pasta compartilhada global (`shared/`) quando o reuso se estender por mais de 3 domínios diferentes.

## Gatilho de Revisão

Esta decisão será reavaliada caso surjam fluxos com altíssima taxa de reutilização entre telas diferentes. Nesses cenários, em vez de duplicar subpastas em múltiplos domínios, a arquitetura será estendida para adotar **Componentes Abstratos/Base Configuráveis** centralizados no diretório `shared/`, onde a página concreta apenas provê a implementação de contrato específica.
