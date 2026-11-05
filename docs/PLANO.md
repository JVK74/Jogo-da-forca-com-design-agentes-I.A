# Plano tecnico: jogo da forca cooperativo multiplayer

## Objetivo e requisitos aprovados

Construir um jogo da forca cooperativo para navegador, em portugues brasileiro, acessivel e responsivo, com salas privadas por codigo e estado sincronizado em tempo real. O jogo deve permitir convidados sem conta e login opcional com Google OAuth/OIDC. A infraestrutura de aplicacao e backend sera Cloudflare Workers.

Decisoes fixadas:

- De 2 a 6 jogadores por sala; qualquer jogador conectado pode enviar palpites.
- Salas vazias expiram apos 10 minutos.
- Palpites ignoram acentos, mas a palavra e exibida com sua grafia original.
- Cada partida comeca com 6 tentativas. Uma configuracao explicita pode definir de 1 a 26 tentativas.
- O alfabeto de palpites e A-Z, incluindo apenas as variantes acentuadas brasileiras: A/Á/À/Â/Ã, E/É/Ê, I/Í, O/Ó/Ô/Õ, U/Ú e C/Ç. Comparacoes ignoram acentos; letras Unicode decompostas sao normalizadas em NFC antes da validacao.
- O estado privado da partida pode ser serializado em JSON e restaurado reproduzindo o historico cronologico de palpites. Contadores, listas e fase persistidos sao comparados ao resultado reconstruido; palpites posteriores ao encerramento e snapshots inconsistentes sao recusados. Respostas de rejeicao contem apenas dados publicos de controle, nunca o estado privado ou a palavra secreta.
- Meta de pelo menos 1.200 palavras unicas, em portugues brasileiro, com 5 a 12 letras.
- Frontend Vite com o plugin oficial Cloudflare para Workers; Workers atendem frontend e backend.
- Durable Objects gerenciam salas, WebSockets e estado persistente da partida; usar WebSocket Hibernation quando apropriado.
- D1 guarda perfis, sessoes e estatisticas persistentes de contas autenticadas.
- Wrangler apoia desenvolvimento, configuracao, migrations e publicacao.

O escopo nao inclui neste momento implementar funcionalidades, instalar dependencias, provisionar recursos de conta, autenticar ou publicar.

## Arquitetura tecnica

### Frontend

HTML semantico, CSS responsivo e JavaScript em modulos. Vite fornece servidor local e build; o plugin oficial Cloudflare para Workers integra o frontend ao runtime Worker. A interface envia acoes e apresenta o estado publico recebido do servidor, mas nao decide o resultado da partida.

### Worker

O Worker e a entrada da aplicacao publicada: entrega assets estaticos e processa rotas HTTP, OAuth callback e upgrade de conexoes WebSocket. Valida entradas, cookies/sessoes, limites e direciona conexoes para o Durable Object da sala. Segredos OAuth ficam em secrets do ambiente, nunca no bundle.

### Durable Objects e WebSockets

Cada sala corresponde a um Durable Object, selecionado por um identificador aleatorio de sala. O DO e a autoridade do estado da partida e usa armazenamento persistente para restaurar sala e partida apos reinicializacao. As mensagens dos clientes sao validas apenas como pedidos; o DO valida, aplica as regras e transmite atualizacoes. WebSocket Hibernation pode reduzir custo de conexoes ociosas, desde que o tratamento de reconexao e o armazenamento de contexto preservem o comportamento correto.

### D1 e autenticacao

D1 persiste perfis vinculados ao identificador estavel do Google, sessoes e estatisticas de contas autenticadas. O jogo convidado nao depende de D1 nem de login para criar/entrar em sala. O fluxo OAuth/OIDC usa state, nonce, redirect URI validada e verificacao de resposta; ao completar, o Worker emite sessao propria em cookie seguro. As mensagens WebSocket tambem precisam ser associadas a identidade/sessao validada. Tokens e secrets nunca vao para o navegador ou logs.

### Banco de palavras

O corpus e mantido no lado servidor e nao deve ser servido como asset publico. A meta e no minimo 1.200 palavras validas, unicas, em portugues brasileiro, com 5 a 12 letras. Registrar origem, licenca e atribuicao. Um script repetivel normaliza Unicode, valida comprimento por caracteres/letras conforme regra definida, elimina duplicatas exatas e duplicatas apos remocao de acentos, e informa rejeicoes. Palpites aceitam A-Z e as variantes Á, À, Â, Ã, É, Ê, Í, Ó, Ô, Õ, Ú e Ç; sequencias decompostas sao normalizadas em NFC antes da validacao. A comparacao ignora acentos e Ç equivale a C, enquanto a grafia NFC original e preservada para exibicao. A validacao automatica de formato nao substitui revisao linguistica e de licenca.

## Funcionamento das salas

1. Um convidado ou usuario autenticado solicita criar sala. O Worker gera um codigo aleatorio dificil de adivinhar e inicializa o Durable Object correspondente.
2. Jogadores entram pelo codigo; o Worker valida o pedido e associa o socket ao DO. O limite e de 2 a 6 participantes.
3. Ao haver pelo menos 2 participantes, a partida pode iniciar segundo a regra de inicio definida na implementacao; o DO escolhe a palavra de forma segura e guarda a original em estado persistente.
4. Qualquer jogador conectado envia uma letra. O DO valida fase, formato e repeticao; palpites simultaneos iguais sao serializados e contam somente uma vez.
5. O DO transmite apenas estado publico: letras reveladas, palpites, tentativas restantes, participantes e fase. A palavra completa nunca e enviada antes do termino.
6. A partida inicia com 6 tentativas. A configuracao pode escolher de 1 a 26 tentativas. A partida termina por vitoria/derrota conforme as regras; somente apos o termino a palavra pode ser revelada ao publico.
7. Uma desconexao temporaria permite reconexao sem duplicar participante ou estado. Quando nao houver jogadores conectados, a sala permanece recuperavel por ate 10 minutos; apos esse prazo o DO remove/expira o estado conforme mecanismo de alarme e politica implementada.

Definir antes de programar: inicio automatico ou por acao, saida do jogador que criou a sala, tratamento de abandono no meio da partida e mensagem/UX quando a sala expira.

## Estrutura de pastas sugerida

Estrutura inicial recomendada; validar detalhes com o plugin oficial e a configuracao atual de Vite/Workers:

```text
.
├── .github/
│   ├── agents/
│   ├── skills/
│   └── copilot-instructions.md
├── docs/
│   ├── PLANO.md
│   └── fontes-de-palavras.md
├── migrations/
│   └── 0001_init.sql
├── scripts/
│   └── validate-words.mjs
├── src/
│   ├── client/
│   │   ├── main.js
│   │   ├── views/
│   │   └── styles/
│   │       └── main.css
│   ├── shared/
│   │   ├── game-rules.js
│   │   └── protocol.js
│   └── worker/
│       ├── index.js
│       ├── routes/
│       │   ├── auth.js
│       │   └── rooms.js
│       ├── durable-objects/
│       │   └── room.js
│       └── data/
│           └── palavras.json
├── tests/
│   ├── unit/
│   ├── workers/
│   └── e2e/
├── index.html
├── package.json
├── vite.config.js
└── wrangler.jsonc
```

O corpus pode ser carregado no Worker em build e nao deve ir para diretorio de assets publicos. A estrutura final de arquivos e a localizacao suportada do corpus dependem da integracao adotada para o Vite plugin.

## Responsabilidades dos agentes

- **Planner** (`project-planning`): analisar requisitos multiplayer, dependencias, riscos, arquitetura Cloudflare e criterios de conclusao. E somente leitura; nao implementa nem edita documentos.
- **Developer** (`game-development`): implementar frontend, Worker/backend, regras, protocolo, Durable Objects, integracao OAuth/D1 e testes automatizados. Nao publica.
- **Tester** (`testing-debugging`): executar auditoria e testes sem editar arquivos. Testa regras, multiplos clientes, concorrencia, reconexao, expiracao, OAuth/sessoes, corpus e exposicao da palavra. Como nao possui ferramenta de edicao, o Developer cria/atualiza testes a partir dos achados.
- **DevOps** (`cloudflare-deployment`): preparar integracao Vite/Workers, bindings, Durable Objects, D1, migrations, Wrangler e configuracoes de secrets; verificar build e guiar publicacao. Login, alteracoes em conta e deploy exigem autorizacao explicita.

## Fases de desenvolvimento

1. **Fundacao e regras detalhadas**: criar aplicacao Vite/Workers local e scripts; definir erros maximos, inicio de partida, abandono e reconexao. Sem provisionar ou publicar recursos.
2. **Regras e corpus**: implementar regras puras, normalizacao de acentos e validador de palavras; selecionar fonte/licenca e obter 1.200+ itens validos. Testar antes da integracao com sockets.
3. **Salas multiplayer**: Durable Object por sala, armazenamento persistente, WebSocket, limite de 2-6, palpites sincronizados, seguranca da palavra e expiracao de salas vazias aos 10 minutos. Validar com multiplos clientes locais.
4. **Interface e acessibilidade**: fluxos criar/entrar/aguardar/jogar/reconectar/fim; teclado, leitores de tela, foco, contraste, responsividade e mensagens em pt-BR.
5. **Autenticacao opcional e D1**: Google OAuth/OIDC, sessoes seguras e persistencia minima de perfis/sessoes/estatisticas. Convidados permanecem funcionais; validar callback e cenarios de erro em ambiente local.
6. **Hardening e validacao integrada**: testes unitarios, Worker/DO, concorrencia e ponta a ponta; revisar limites, privacidade, abuso de salas, mensagens e corpus.
7. **Preparacao de entrega publica**: confirmar configuracao e build com DevOps, definir URL e callback OAuth de producao. Publicar apenas apos autorizacao explicita; fazer smoke test na URL publica com dois ou mais clientes.

## Criterios de aceitacao

### Regras e palavras

- Uma partida pode iniciar, receber palpites validos e terminar em vitoria ou derrota; regras de tentativas estao documentadas.
- O motor usa 6 tentativas por padrao e valida configuracoes inteiras de 1 a 26; o estado original nao e mutado ao aplicar palpites.
- Letras repetidas, entradas invalidas, caracteres Unicode e acentos sao tratados de forma consistente, sem contar tentativa indevida. Apenas A-Z e as variantes acentuadas definidas sao aceitas; entradas NFC e decompostas sao tratadas corretamente.
- Estado serializado pode ser restaurado com validacao de consistencia; partidas em andamento e terminadas mantem o mesmo resultado, e a palavra permanece privada no estado publico.
- Testes unitarios cobrem variantes acentuadas, dotless i e outros caracteres rejeitados, NFC/decomposto, imutabilidade, limites de tentativas, restauracao JSON, consistencia de resultados e protecao da palavra no estado publico restaurado.
- O corpus tem pelo menos 1.200 palavras unicas aprovadas, cada uma com 5-12 letras; fonte/licenca estao documentadas e script valida o resultado.
- Palpites sem acento encontram letras acentuadas conforme a regra definida, e a palavra revelada mantem a grafia original.

### Salas e seguranca multiplayer

- Dois a seis jogadores entram e veem o mesmo estado atualizado em tempo real; jogador fora do limite e recusado.
- Qualquer participante conectado pode palpitar; dois palpites concorrentes iguais produzem uma unica atualizacao/erro.
- Estado e palavra sao autoritativos no DO; palavra e informacao secreta nao aparecem em mensagens, assets ou logs antes do fim.
- Estado serializado persiste e pode ser restaurado apos reinicializacao do DO; a restauracao valida a consistencia da partida. Conexoes podem usar Hibernation quando compativel sem perder estado ou identidade.
- Reconexao e desconexao seguem comportamento definido; sala sem conexoes expira apos 10 minutos.
- Entradas HTTP/WebSocket, tamanho/frequencia de mensagens e codigos de sala tem validacao e limites adequados.

### Autenticacao e dados

- Convidados podem criar e participar de salas sem OAuth.
- Google OAuth/OIDC opcional autentica, cria/recupera perfil e permite logout; respostas/callbacks invalidos sao rejeitados.
- Cookies e sessoes sao protegidos, expiraveis e nao expostos em logs; estatisticas persistentes so sao associadas a conta autenticada.
- Segredos OAuth nao estao no frontend, repositorio ou historico Git.

### Interface e entrega

- Interface em portugues brasileiro e utilizavel em dispositivos moveis e desktop, por teclado e tecnologias assistivas.
- Build local Worker/Vite e testes relevantes passam, com resultados registrados.
- Com autorizacao, a URL HTTPS publica abre a aplicacao e dois ou mais clientes externos concluem uma partida; WebSocket e OAuth de producao funcionam.

## Riscos e dependencias

- A fonte/licenca e a revisao linguistica do corpus podem impedir atingir 1.200 palavras; manter margem durante a coleta.
- OAuth depende de registrar credenciais, callbacks e secrets para os ambientes local e de producao; isso exige acao/autorizacao do proprietario da conta.
- Concorrencia, reconexao, hibernacao e persistencia DO exigem testes em ambiente local compatível com Wrangler e validacao na infraestrutura Cloudflare.
- Codigos de sala previsiveis podem permitir acesso indevido; gerar codigos aleatorios, limitar tentativas e nao confundir codigo de sala com autenticacao.
- D1 deve guardar somente dados necessarios; definir retencao de sessoes e estatisticas e comunicar tratamento de dados.
- Limites e custos de Workers, DO, D1 e WebSockets devem ser verificados na documentacao/plano vigente antes da publicacao.
- A URL publica e o callback Google dependem de deploy autorizado, disponibilidade de conta e configuracao OAuth; sao pre-requisitos externos da apresentacao final.
- O agente Tester e somente leitura; correcoes e novos testes precisam ser implementados por Developer.
