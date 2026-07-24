# 📄 ADR 005: Containerização Unificada e Padronização de Ambiente com Docker Compose

- **Status:** Aceito
- **Data:** 2026-07-24

## Contexto e Problema

A aplicação é composta por múltiplos ecossistemas (Frontend em Angular 21 e BFF em Node.js/Express) que precisam rodar de forma perfeitamente integrada. Para a etapa de avaliação e execução em diferentes ambientes (máquinas de desenvolvedores, servidores de CI/CD ou ambiente da banca avaliadora), dependências de versões globais do Node.js, gerenciadores de pacotes (`npm`/`yarn`) ou configurações de sistema operacional podem gerar a clássica inconsistência de _"funciona na minha máquina"_. É necessário garantir um ambiente de execução totalmente isolado, reprodutível, de comando único e pronto para produção.

## Opções Consideradas

1. **Instruções de Execução Manual Local:**
   - _Prós:_ Não exige Docker instalado na máquina de quem vai executar.
   - _Contras:_ Alta probabilidade de erros por divergência de versão do Node.js, necessidade de rodar `npm install` e subir dois terminais separados manualmente, prejudicando a experiência de avaliação.

2. **Containerização Individual via Dockerfile sem Orchestrator:**
   - _Prós:_ Isolamento das aplicações individualmente.
   - _Contras:_ Exige comandos manuais de criação de rede do Docker (_bridge networks_) e acoplamento de portas de forma imperativa pelo usuário.

3. **Containerização Unificada com Multi-Stage Builds e Docker Compose — _Escolha Adotada_:**
   - _Prós:_ Comando único para subida de toda a pilha (`docker compose up --build`), compilação isolada via _Multi-stage Build_ (gerando artefatos enxutos), padronização exata da versão do Node.js (v22) e rede interna isolada.
   - _Contras:_ Requer a presença do Docker Desktop / Docker Engine no ambiente do avaliador.

## Decisão

Decidiu-se adotar a **containerização completa e orquestrada** da solução utilizando **Docker Compose** e **Dockerfiles com Multi-Stage Build**:

### 1. Frontend (Angular 21)

- **Stage 1 (Build):** Compilação dos ativos estáticos e TypeScript no Node.js 22.
- **Stage 2 (Runtime):** Servido via imagem ultra-leve do **Nginx**, garantindo máxima performance de entrega de arquivos estáticos, baixo consumo de memória e roteamento adequado.

### 2. BFF (Node.js + Express)

- Compilação do TypeScript no Node.js 22 e execução do servidor em imagem otimizada (`Node Alpine`), garantindo que todas as rotas e o middleware de latência/falhas rodem sob o mesmo tempo de execução do ambiente de testes.

### 3. Orquestração e Isolamento

- A comunicação entre o Frontend e o BFF é realizada através de uma **bridge network** declarativa no `docker-compose.yml`, mapeando as portas padrão de atendimento sem necessidade de intervenção manual no arquivo de propriedades.

## Consequências

### Positivas

- **Reprodutibilidade Total:** A aplicação roda exatamente da mesma forma em qualquer máquina, independente do SO ou Node.js instalado localmente.
- **Experiência de Avaliação sem Atrito:** Subida de todo o ecossistema com um único comando no terminal.
- **Imagens Enxutas:** O uso de _Multi-Stage Build_ descarta dependências de desenvolvimento (`devDependencies`) nas imagens finais de runtime, reduzindo o tamanho dos containers e o uso de CPU/RAM.

### Negativas

- O tempo inicial do primeiro build do container pode levar alguns minutos a mais para baixar as imagens base e construir a aplicação.

## Gatilho de Revisão

Esta decisão será reavaliada caso a infraestrutura evolua para um ambiente de orquestração em nuvem distribuída (ex: Kubernetes / ECS), onde a configuração do `docker-compose` local será adaptada para manifestos de _K8s_ ou arquivos de _Helm Charts_.
