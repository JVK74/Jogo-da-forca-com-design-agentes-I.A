# Instrucoes do projeto

## Contexto e arquitetura

Este repositorio sera usado para desenvolver um jogo da forca cooperativo multiplayer em portugues brasileiro, com login opcional, responsividade, acessibilidade e hospedagem na Cloudflare. Antes de implementar, consulte `docs/PLANO.md` e trabalhe somente no escopo solicitado.

- Use HTML semantico, CSS e JavaScript no frontend; Node.js/npm para desenvolvimento e scripts.
- Use Vite com o plugin oficial da Cloudflare para Workers. Cloudflare Workers serve a interface e implementa as rotas do backend.
- Use Durable Objects (DO) como autoridade do estado de cada sala e para conexoes WebSocket. Use armazenamento persistente do DO para o estado da partida e WebSocket Hibernation quando apropriado.
- Use D1 para perfis, sessoes e estatisticas persistentes de contas autenticadas. Nao use D1 como estado em tempo real da sala.
- Use Wrangler para desenvolvimento, bindings, migrations, validacao e publicacao autorizada.
- O jogo e cooperativo: salas comportam de 2 a 6 jogadores; convidados podem cria-las e entrar; qualquer jogador conectado pode enviar palpites. Salas sem jogadores conectados expiram apos 10 minutos.
- O banco de palavras deve ter meta minima de 1.200 palavras unicas, em portugues brasileiro, com 5 a 12 letras. Palpites ignoram acentos; a grafia original e preservada na exibicao.

## Organizacao e responsabilidades

- Separe frontend, Worker/backend, regras puras da partida, protocolo compartilhado, Durable Objects, autenticacao, dados e testes em modulos pequenos.
- Mantenha estado autoritativo e validacao de acoes no servidor. O cliente apresenta o estado recebido e nunca e autoridade sobre resultado, tentativas, identidade ou palavra secreta.
- Mantenha palavras e segredos do jogo exclusivamente no lado servidor; nao os inclua em assets publicos, respostas iniciais, logs ou mensagens WebSocket antes do fim da partida.
- Mantenha credenciais OAuth e outros segredos somente em secrets do ambiente Cloudflare. Nunca os inclua em codigo, frontend, testes, documentacao ou historico Git.
- Convidados devem poder jogar sem conta. Autenticacao Google OAuth/OIDC e opcional; estatisticas persistentes sao vinculadas a conta autenticada.
- Use nomes consistentes e mensagens ao jogador em portugues brasileiro. Explique desvios relevantes da arquitetura aprovada.

## Comunicacao multiplayer e seguranca

- Valide no Worker/DO toda entrada HTTP e mensagem WebSocket: formato, tamanho, fase da partida, limite da sala, identidade/sessao, repeticoes e permissao.
- Trate mensagens do cliente como dados nao confiaveis. Limite tamanho e frequencia, valide codigos de sala e nao aceite estado de jogo enviado pelo cliente.
- O DO serializa as alteracoes da sala. Palpites simultaneos iguais devem ser contabilizados uma unica vez; o estado resultante e transmitido aos clientes conectados.
- Envie somente o estado publico necessario: letras reveladas, palpites ja feitos, tentativas restantes, jogadores e fase. Nunca envie a palavra alvo nem informacoes que permitam deduzi-la antes do fim.
- Defina tratamento de desconexao, reconexao, mensagens duplicadas, erros e expiracao. Salas ficam vazias quando nao ha jogadores conectados e devem expirar apos 10 minutos.
- Para OAuth/OIDC, valide state, nonce, redirect URI e tokens conforme o fluxo adotado; proteja sessoes com cookies HttpOnly, Secure e SameSite adequado, e considere CSRF e revogacao. Nunca confie em identificadores declarados pelo navegador.
- Armazene apenas dados necessarios. Nao exponha tokens de sessao em logs; quando persistidos, proteja-os e use estrategia de expiracao/revogacao.

## Qualidade, acessibilidade e testes

- Adicione ou atualize testes para regras, endpoints, mensagens, persistencia e falhas. Cubra vitoria, derrota, palpites invalidos/repetidos, acentos, concorrencia, duas a seis pessoas, reconexao, expiracao de sala e autorizacao.
- Valide automaticamente o corpus: minimo de 1.200 palavras unicas, portugues brasileiro, 5-12 letras conforme regra Unicode documentada, sem itens proibidos e com fonte/licenca registradas.
- Teste com multiplos clientes e o ambiente local do Wrangler/Workers; diferencie testes locais de uma publicacao real.
- Confira navegacao por teclado, foco visivel, contraste, leitores de tela, movimento reduzido e diferentes larguras.
- Trate texto de jogadores e conteudo externo como dados; evite APIs que interpretem HTML.
- Execute verificacoes relevantes e informe apenas comandos e resultados realmente obtidos. Nao silencie erros.
- Ao concluir, explique decisoes, arquivos alterados, verificacoes, limitacoes e proximos passos.

## Seguranca e autorizacao

- Nao inclua credenciais, tokens ou dados pessoais no repositorio.
- Nao instale dependencias, crie recursos em contas Cloudflare/Google, autentique-se ou publique sem autorizacao explicita para a acao correspondente.
- Nao faca commit ou push sem pedido explicito. Preserve alteracoes existentes e nunca remova arquivos do stage.
