import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { normalizeLetter } from "../../src/worker/game/engine.js";

const words = JSON.parse(
  await readFile(
    fileURLToPath(new URL("../../src/worker/data/palavras.json", import.meta.url)),
    "utf8",
  ),
);

function comparisonKey(word) {
  return Array.from(word, normalizeLetter).join("");
}

test("banco contém ao menos 1.200 palavras em Unicode NFC", () => {
  assert.ok(words.length >= 1_200);
  assert.ok(words.every((word) => word === word.normalize("NFC")));
});

test("palavras têm 5 a 12 letras portuguesas, sem espaços, números ou pontuação", () => {
  for (const word of words) {
    assert.ok(Array.from(word).length >= 5 && Array.from(word).length <= 12, word);
    assert.match(word, /^\p{L}+$/u, word);
    assert.ok(Array.from(word).every((letter) => normalizeLetter(letter) !== null), word);
    assert.equal(word, word.toLocaleLowerCase("pt-BR"), word);
  }
});

test("banco não contém duplicatas exatas ou após remoção de acentos", () => {
  const exactWords = words.map((word) => word.toLocaleLowerCase("pt-BR"));
  const accentInsensitiveWords = words.map(comparisonKey);

  assert.equal(new Set(exactWords).size, words.length);
  assert.equal(new Set(accentInsensitiveWords).size, words.length);
});
