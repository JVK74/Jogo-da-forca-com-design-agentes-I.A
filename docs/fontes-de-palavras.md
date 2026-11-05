# Fonte do banco de palavras

## Origem e licença

O banco foi derivado do arquivo UTF-8 `br-utf8.txt`, publicado na página
[Lista de todas as palavras do português brasileiro](https://www.ime.usp.br/~pf/dicios/).
A página identifica o trabalho original de Ricardo Ueda Karpischek para o
Dicionário br.ispell e é publicada por Paulo Feofiloff, do IME-USP.

O material está sob a licença
[Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.pt-br).
Esta atribuição e o registro das modificações acompanham a cópia derivada.

## Transformações aplicadas

- Fonte UTF-8: <https://www.ime.usp.br/~pf/dicios/br-utf8.txt>
- SHA-256 do arquivo consultado: `36ae3cead899c9746d116d2332422bc5ba23476132449d9f06911ef396bf3558`
- Normalização das entradas para Unicode NFC.
- Inclusão apenas de entradas com 5 a 12 pontos de código, compostas por letras
  que, sem diacríticos, correspondem a A-Z.
- Exclusão de entradas com maiúsculas, como filtro conservador para remover
  nomes próprios e outras entradas capitalizadas da fonte.
- Deduplicação pela chave sem acentos; quando há colisão, prevalece a primeira
  entrada na ordem da lista original.
- Seleção determinística de 12.000 entradas pela menor ordem crescente do
  SHA-256 da grafia NFC, para evitar viés de uma seleção apenas alfabética. O
  resultado é armazenado em ordem crescente de sequência Unicode.

O filtro de maiúsculas não é um classificador linguístico: a lista da fonte pode
conter erros ou estar incompleta e não marca classes gramaticais. Portanto, uma
eventual palavra comum que também possa ser nome próprio, ou uma entrada
indevidamente grafada em minúsculas na fonte, pode exigir revisão editorial.
O validador automatiza formato, tamanho e duplicidade; não substitui essa
revisão semântica.
