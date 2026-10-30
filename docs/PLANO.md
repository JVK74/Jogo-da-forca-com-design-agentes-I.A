# Plano do projeto

## Objetivo

Desenvolver um jogo da forca para navegador, em portugues brasileiro, responsivo e acessivel, como trabalho universitario sobre design de agentes de IA. A primeira versao pode ser um site estatico: as regras da partida executadas no navegador nao exigem servidor proprio.

## Arquitetura inicial sugerida

- **HTML**: estrutura semantica da pagina, informacoes da partida e controles.
- **CSS**: identidade visual, estados da interface e adaptacao a diferentes tamanhos de tela.
- **JavaScript**: estado e regras da partida, validacao das letras, atualizacao da interface e interacoes.
- **Node.js**: ambiente para executar as ferramentas de desenvolvimento e os scripts do projeto; nao precisa ser servidor de producao para esta arquitetura.
- **npm**: instalacao e gerenciamento das dependencias e execucao dos scripts declarados no `package.json`.
- **Vite**: servidor local de desenvolvimento e empacotamento dos arquivos estaticos para producao.
- **Cloudflare Pages**: hospedagem opcional dos arquivos estaticos gerados pelo Vite.
- **Wrangler**: CLI da Cloudflare, opcional para desenvolvimento local integrado e publicacao no Pages quando chegar a etapa de deploy.

Nao ha conflito inerente entre essa combinacao: Vite gera arquivos estaticos que podem ser hospedados no Cloudflare Pages, e Wrangler pode auxiliar no fluxo da plataforma. Para um jogo local sem backend, Node.js e npm servem ao desenvolvimento e a construcao, nao exigem um servidor Node.js em producao. Se o projeto passar a precisar de contas, partidas compartilhadas, persistencia remota ou agentes executados no servidor, sera necessario reavaliar a arquitetura; um backend ou recursos Cloudflare Workers podem ser apropriados. Isso nao faz parte do escopo inicial proposto.

## Estrutura de pastas sugerida

Esta estrutura e uma proposta para etapas futuras; os arquivos da aplicacao ainda nao devem ser criados nesta fase.

```text
.
├── .github/
│   └── copilot-instructions.md
├── docs/
│   └── PLANO.md
├── public/
│   └── (recursos estaticos, se necessarios)
├── src/
│   ├── js/
│   │   ├── game.js       # regras e estado da partida
│   │   └── main.js       # inicializacao e integracao com a interface
│   ├── styles/
│   │   └── main.css
│   └── index.html
├── tests/
│   └── (testes das regras e comportamentos)
├── package.json
└── vite.config.js        # somente se a configuracao padrao nao for suficiente
```

Uma configuracao de hospedagem especifica do Cloudflare so deve ser adicionada quando necessaria e depois de confirmar o fluxo de publicacao desejado. Nao e necessario criar Worker ou backend para a primeira versao estatica.

Para manter o projeto simples e permitir estudar agentes, a logica do agente pode ficar em um modulo JavaScript separado das regras da partida e da interface. O papel do agente (por exemplo, escolher palavras ou propor palpites), suas observacoes, acoes, estrategia e forma de avaliacao devem ser definidos antes da implementacao; este plano nao escolhe uma estrategia nem exige um servico externo de IA.

## Etapas planejadas

1. **Preparacao do repositorio**: registrar instrucoes de trabalho, arquitetura, estrutura proposta e criterios de conclusao.
2. **Fundacao da aplicacao**: escolher e registrar versoes das ferramentas, criar a estrutura minima do Vite e configurar scripts; instalar dependencias somente com autorizacao e quando a implementacao comecar.
3. **Design do agente**: definir o papel do agente, o que ele pode observar e fazer, seus objetivos, estrategia, limites e criterios de avaliacao. Manter a politica do agente separada para que possa ser testada sem a interface.
4. **Regras da partida**: implementar e testar estado, selecao da palavra, palpites, letras repetidas, vitoria, derrota e reinicio.
5. **Interface e conteudo**: criar a pagina semantica em portugues brasileiro e integrar a interface as regras sem misturar responsabilidades.
6. **Acessibilidade e responsividade**: implementar navegacao por teclado, foco visivel, anuncios de estado para leitores de tela, contraste adequado e layouts para telas pequenas e grandes.
7. **Validacao**: executar testes e verificacoes disponiveis, revisar regras, comportamento do agente, acessibilidade e diferentes larguras; corrigir problemas encontrados.
8. **Publicacao opcional**: somente com autorizacao, configurar Cloudflare Pages/Wrangler, autenticar se necessario e publicar. Nao fazer login, deploy ou publicar alteracoes no GitHub sem autorizacao explicita.

## Criterios para considerar o jogo pronto

- A partida pode ser iniciada, receber palpites validos e chegar a vitoria ou derrota de forma consistente.
- Letras repetidas e entradas invalidas sao tratadas sem corromper o estado ou contar tentativas indevidamente.
- E possivel iniciar uma nova partida sem recarregar a pagina.
- O papel do agente, suas observacoes, acoes, estrategia e criterios de avaliacao estao documentados; seu comportamento tem testes apropriados ao design escolhido.
- Textos, instrucoes, mensagens e conteudo do jogo estao em portugues brasileiro.
- A interface funciona em telas pequenas e grandes, sem perda de conteudo ou controles.
- Os controles principais sao utilizaveis por teclado, o foco e visivel e as mudancas relevantes de estado sao comunicadas a tecnologias assistivas.
- Estrutura semantica, contraste, legibilidade e preferencias de movimento reduzido foram considerados.
- Testes cobrem as regras principais e as verificacoes disponiveis foram executadas, com resultados documentados sem alegacoes nao verificadas.
- Nenhum segredo foi incluido. Qualquer publicacao foi feita apenas apos autorizacao explicita.
