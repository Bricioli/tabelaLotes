Módulo de Consulta de Lotes
===========================

Aplicação web desenvolvida para a consulta, filtragem e gestão de lotes de lançamentos, composta por um **Frontend em Angular** e um **BFF (Backend For Frontend) em Node.js/TypeScript**.

🛠️ Versões e Tecnologias Utilizadas
------------------------------------

### Frontend

- **Angular:** v21
- **Angular Material:** v21

### BFF (Backend For Frontend)

- **Node.js:** v22
- **Express:** v5
- **TypeScript:** v5

🚀 Instruções de Execução (Docker)
----------------------------------

O projeto foi totalmente dockerizado para simplificar a inicialização sem a necessidade de instalar dependências locais.

### Pré-requisitos

- **Docker** e **Docker Compose** instalados na máquina.

### Executando a Aplicação

Na raiz do projeto, execute o comando abaixo para construir as imagens e subir os containers:

```bash
docker compose up --build
```

> - **Frontend (Angular):** Acessível em http://localhost:4200
>
> - **BFF (Node.js):** Acessível em http://localhost:3000

Modo Hostil do BFF
------------------

O BFF possui uma simulação de instabilidades de rede e falhas de infraestrutura, utilizada para testar a resiliência do Frontend (mecanismos de retry, tratamento de erros e _skeleton screens_).

- **Arquivo de Configuração:** A lógica e as taxas de erro do Modo Hostil ficam concentradas na pasta do BFF no middleware do projeto (tabelaLotes/bff/src/middlewares/hostility.middleware.ts).

- **Sugestão de Ajuste de Cadência:** O parâmetro de falhas vem configurado por padrão em uma taxa baixa (FAILURE\_RATE = 0.2). Para testes mais severos de estresse na interface, recomenda-se elevar a probabilidade de falha para 0.8.

🏗️ Decisões Técnicas Relevantes
--------------------------------

1.  **Adoção do Luxon para Gestão de Datas no Front:**

    - Utilização do @angular/material-luxon-adapter fixado na **v21** para garantir conformidade total com o Angular 21.

    - Padronização das entradas do usuário no formato local dd/MM/yyyy com parsing ISO resiliente (YYYY-MM-DD).

2.  **Arquitetura Reativa no Frontend:**

    - Desacoplamento do formulário de filtros e da renderização da tabela via Store, reduzindo re-renderizações desnecessárias durante a paginação.

✂️ Cortes e Próximos Passos (Seção Obrigatória)
-----------------------------------------------

### O que foi cortado e por quê?

Visando respeitar rigorosamente o **Timebox de 10 horas** estipulado para a entrega do desafio, a prioridade foi direcionada para a **qualidade do código, validação das regras de negócio, testes e correção da comunicação/timezones entre Frontend e BFF**.

Os seguintes itens foram cortados de forma proposital:

- **Utilitário Centralizado de Tratamento de Erros no BFF:** A criação de um middleware/utilitário global de mapeamento e padronização refinada de erros de negócio no BFF foi postergada. Atualmente, os erros lançados utilizam mensagens HTTP genéricas que são tratadas de forma resiliente pelo Interceptor e Banner no Frontend.

- **Fidelidade Visual Pixel Perfect:** O foco esteve na entregabilidade funcional e usabilidade da tela. O ajuste fino de CSS/layout para atingir o design idêntico ao protótipo foi preterido em função do tempo.

- **Ações da Action Bar e Modais:** Ações secundárias como os modais de _Inclusão_, _Alteração_, _Visualização_ e _Exclusão_ tiveram suas interfaces completas postergadas, mantendo o foco total na consulta, filtros, paginação e resiliência da listagem principal.

- **Perfumarias de UI e Refinamento de Form:** Estilizações avançadas nos inputs do formulário de filtro e microinterações.

### O que faria nas próximas 20 horas?

Em um ciclo incremental contínuo de mais 20 horas de desenvolvimento, o planejamento de evolução do sistema seguiria a seguinte ordem de prioridades:

1.  **Refatoração da Camada de Erros no BFF:**

    - Implementação de um utilitário centralizado de tratamento e tradução de exceções (ErrorHandler Middleware) no BFF, retornando payloads de erro padronizados (code, message, details) e amigáveis ao usuário (_user-friendly_).

2.  **Implementação do Design System & Pixel Perfect:**

    - Ajuste fino de UI para garantir 100% de fidelidade visual com a identidade da marca e os padrões do cliente.

3.  **Desenvolvimento das Funcionalidades da Action Bar:**

    - Construção das funcionalidades e dos modais de _Inclusão_, _Visualização de Justificativas_, _Exclusão em Lote_ e _Alteração_.

4.  **Responsividade Completa:**

    - Refinamento dos breakpoints e grid para garantir uma experiência de uso fluida em diferentes resoluções de tela e dispositivos móveis.

5.  **Trabalho de UX e Coleta de Feedbacks:**

    - Refinamento dos campos de filtro e disponibilização do ambiente para testes de usabilidade com usuários reais, visando coletar _feedback_ contínuo para otimizar o fluxo de trabalho do dia a dia.
