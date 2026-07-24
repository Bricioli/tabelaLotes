# 📄 ADR 004: Estratégia de Testes por Camadas de Risco e Quality Gate de Integridade

- **Status:** Aceito
- **Data:** 2026-07-24

## Contexto e Problema

Tanto no Frontend quanto no BFF, a escrita de testes unitários precisa equilibrar a produtividade do time (dentro do prazo de entrega de até 10 horas) com a segurança real da aplicação. Testar elementos puramente estáticos ou fazer "testes de perfumaria" (como seletores de CSS ou bindings visuais simples) apenas para inflar métricas de cobertura não gera valor para o negócio. É necessário estabelecer uma estratégia clara do que testar, do que deliberadamente não testar e quais travas (Quality Gates) são inegociáveis para aprovação de um Merge / Pull Request.

## Opções Consideradas

1. **Testes Superficiais de Alta Cobertura Sintética:**
   - _Prós:_ Relatórios visuais com alta porcentagem de cobertura em linhas.
   - _Contras:_ Testes frágeis que quebram com qualquer ajuste visual pequeno, sem garantir que as regras de negócio ou as validações de segurança foram realmente aplicadas.

2. **Estratégia Pragmática Orientada a Risco e Cenários Relevantes — _Escolha Adotada_:**
   - _Prós:_ Foco cirúrgico em cenários positivos, negativos, regras de domínio, limites temporais e validações de rotas/contratos. Garante alta cobertura em funções e _branches_ (_branch coverage_) onde o risco real reside.
   - _Contras:_ Elementos meramente estáticos de layout e arquivos de estilo não possuem cobertura unitária direta.

## Decisão

Decidiu-se estruturar a estratégia de testes e critérios de _merge_ com base nas seguintes definições:

### 1. O que é Obrigatoriamente Testado (Foco em Regras de Negócio e Segurança)

- **Frontend (`LoteFilterFormComponent`, `LoteStore`, `Validators`):** Cenários positivos e negativos de formulário, validações de faixas e datas, regras de manipulação de _signals_ e garantia de que o payload transmitido ao BFF é seguro e coerente.
- **BFF (`LotesService`, `LotesController`):** Processamento de ordenações, paginação, regras de mutação, tratamento dos intervalos de datas, rotas da API e garantia de que os códigos HTTP de resposta (ex: 200, 400, 500) e os DTOs estão corretos.
- **Métrica Alvo:** Cobertura de **70% a 80% em código relevante** (foco em _Functions_ e _Branches_ de lógica crítica, não apenas em linhas passivas).

### 2. O que Deliberadamente NÃO é Testado

- Templates HTML estáticos, seletores e estilos SCSS/CSS, _Getters/Setters_ passivos e arquivos de configuração do ambiente.

### 3. Quality Gate Mínimo para Aprovação de Merge (Pull Request)

Nenhum código é integrado à branch principal sem atender rigorosamente a estes quatro pilares:

1. **Suíte 100% Verdes (_Green_):** Todos os testes unitários passando sem nenhuma falha.
2. **Governança de Código:** Passagem completa pelos _pre-commit hooks_, regras de Linter e formatação.
3. **Build sem Erros:** Compilação zerada de erros do TypeScript (`tsc`) tanto no Frontend quanto no BFF.
4. **Code Review com Foco em Segurança:** Análise crítica obrigatória para identificar possíveis vulnerabilidades de segurança, falhas de lógica que escaparam aos testes ou trechos de código fora do escopo da tarefa.

## Consequências

### Positivas

- **Proteção Efetiva contra Regressões:** Testes de cenários negativos salvam o time de falhas silenciosas que passariam despercebidas.
- **Confiança na Entrega:** O alinhamento de automação (CI/CD) com o olhar crítico humano no Code Review garante um código limpo, seguro e aderente ao escopo.
- **Suíte Rápida e Sustentável:** Foco no que é relevante evita testes quebradiços e caros de manter.

### Negativas

- Exige maturidade e tempo do time para realizar Code Reviews detalhados na esteira de desenvolvimento.

## Gatilho de Revisão

Esta decisão será reavaliada no momento em que a aplicação atingir maturidade para ser integrada a uma **esteira automatizada de CI/CD**. Nessa etapa:

- Serão introduzidas ferramentas automáticas de análise estática de código (ex: SonarQube) no pipeline para monitorar débitos técnicos, vulnerabilidades e falhas de segurança.
- A exigência de cobertura mínima de testes unitários **relevantes** (focada em cenários de negócio críticos) passará a ser um _Quality Gate_ automatizado e travado diretamente na esteira para liberação do merge.
