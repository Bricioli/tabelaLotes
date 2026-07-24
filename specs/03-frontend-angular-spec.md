Atue como Tech Lead Front-End Angular Especialista. Crie a aplicação de gestão de Lotes dentro da pasta '/frontend' usando Angular 20/21, Angular Material e Signals.

Requisitos de Arquitetura e Negócio:

1. Camada de Dados & Resiliência (LoteRepository & Service):
   - Crie o LoteRepository usando HttpClient.
   - Implemente política de resiliência HTTP com RxJS no interceptor ou repository:
     - Utilize o operador 'retry' com Backoff Exponencial e Jitter (delay multiplicativo + ruído de milissegundos) com limite de até 2 tentativas para erros 5xx do BFF.
     - Não tente novamente para erros de cliente (4xx).
   - Trate o cancelamento de requisições obsoletas ao pesquisar/paginar usando o operador 'switchMap' para eliminar Race Conditions.

2. Gerenciamento de Estado Reativo (LoteStore / SignalStore):
   - Crie um serviço central de estado usando Angular Signals (ou SignalStore).
   - Armazene: lotes, filtroAtual, paginaAtual, totalElementos, isLoading (boolean), hasError (boolean), itemSelecionado (Lote | null).
   - Computed Signals:
     - 'canAlterarOuExcluir': retorna true APENAS quando exatamente 1 item estiver selecionado na tabela.
     - 'isFiltroValido': validação da faixa de datas e valores (De <= Até).

3. Interface de Usuário (Angular Material):
   - Layout corporativo e responsivo.
   - Topo: MatExpansionPanel recolhível contendo o formulário de filtro reativo (Código, Situação, Faixa de Valor Min/Max e Faixa de Datas com MatDatepicker). Inclua validador customizado de faixa (De <= Até).
   - Barra de Ações: Botões MatButton "Pesquisar", "Limpar", "Alterar", "Excluir" e "Visualizar". Vincule o estado [disabled] dos botões de ação à Signal Computed 'canAlterarOuExcluir'.
   - Tabela: MatTable com MatPaginator. Exiba os dados formatados (Moeda BRL, Data pt-BR, Badge de Situação com cores do Material).
   - Feedbacks Visuais: Exiba Spinner durante 'isLoading'. Caso ocorra erro 5xx após as tentativas do Backoff Exponencial, exiba um banner de erro reativo informando a instabilidade com botão de "Tentar Novamente".

4. Testes Unitários Relevantes (Risk-Based Testing):
   - Crie os testes .spec.ts focando exclusivamente no Core de negócio:
     1. Validador customizado de faixa (De > Até deve retornar erro).
     2. LoteStore/Signal: validar que 'canAlterarOuExcluir' só é true com 1 item selecionado.
     3. Resiliência do RxJS: verificar se o retry é acionado em erros 5xx.
