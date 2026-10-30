# Instrucoes do projeto

## Contexto

Este repositorio sera usado para desenvolver um jogo da forca em portugues brasileiro, com foco em aprendizado, design de agentes de IA, responsividade e acessibilidade. Antes de implementar funcionalidades, consulte `docs/PLANO.md`.

## Organizacao e arquitetura

- Mantenha a aplicacao como um site estatico, separado em HTML semantico, CSS e JavaScript.
- Prefira modulos pequenos com responsabilidades claras. Mantenha regras da partida separadas da manipulacao do DOM e da apresentacao visual.
- Use nomes claros em portugues ou em ingles de forma consistente. Textos apresentados a quem joga devem estar em portugues brasileiro.
- Evite dependencias e abstracoes desnecessarias. Explique qualquer desvio relevante da arquitetura planejada.
- Nao crie, instale ou configure ferramentas sem necessidade para a tarefa; nao faca login, deploy ou publicacao sem autorizacao explicita.

## Qualidade e alteracoes

- Faca alteracoes pequenas, coerentes e diretamente relacionadas ao pedido.
- Preserve comportamentos existentes, verifique entradas e estados invalidos e trate erros de forma explicita.
- Nao afirme que algo foi executado, testado ou validado sem realmente executar a verificacao correspondente.
- Ao concluir uma alteracao, explique o que mudou, quais arquivos foram afetados, as verificacoes executadas e quaisquer limitacoes ou proximos passos.
- Mantenha a documentacao relacionada atualizada quando uma decisao ou comportamento do projeto mudar.

## Acessibilidade e experiencia

- Use HTML semantico, estrutura de titulos coerente, rotulos para controles e texto alternativo quando imagens informativas forem adicionadas.
- Garanta que as funcoes possam ser usadas por teclado, que o foco seja visivel e que cores nao sejam o unico meio de transmitir informacao.
- Forneca mensagens compreensiveis para leitores de tela quando o estado da partida mudar, sem anunciar conteudo excessivo.
- Respeite preferencias de movimento reduzido e mantenha contraste e legibilidade adequados em telas pequenas e grandes.

## Testes

- Adicione ou atualize testes para regras da partida e comportamentos importantes sempre que houver codigo executavel.
- Verifique os casos de vitoria, derrota, letras repetidas, entradas invalidas e reinicio, conforme aplicavel.
- Confira a interface em diferentes larguras e valide o uso por teclado e tecnologias assistivas.
- Execute os comandos de verificacao disponiveis no projeto e relate os resultados reais; nao substitua testes por suposicoes.

## Seguranca

- Nao inclua credenciais, tokens ou dados pessoais no codigo, nos testes, na documentacao ou no historico do Git.
- Trate entradas como dados; evite inserir conteudo nao confiavel com APIs que interpretem HTML.
- Prefira dependencias conhecidas, necessarias e mantidas; avalie o impacto antes de adicionar uma dependencia.
- Nao exponha segredos em configuracoes publicas do site. Solicite autorizacao antes de autenticar, publicar no GitHub ou fazer deploy no Cloudflare.
