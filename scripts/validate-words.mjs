import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { normalizeLetter } from "../src/worker/game/engine.js";

const MINIMUM_WORDS = 1_200;
const MIN_WORD_LENGTH = 5;
const MAX_WORD_LENGTH = 12;
const WORD_BANK_PATH = fileURLToPath(
  new URL("../src/worker/data/palavras.json", import.meta.url),
);
const MAX_DISPLAYED_ERRORS = 50;

function comparisonKey(word) {
  return Array.from(word, normalizeLetter).join("");
}

let words;

try {
  words = JSON.parse(await readFile(WORD_BANK_PATH, "utf8"));
} catch (error) {
  console.error(`Não foi possível ler o banco de palavras: ${error.message}`);
  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  const errors = [];
  const exactWords = new Set();
  const accentInsensitiveWords = new Map();
  let validWords = 0;

  if (!Array.isArray(words)) {
    errors.push("O banco de palavras deve ser um array JSON.");
  } else {
    for (const [index, word] of words.entries()) {
      const location = `Item ${index + 1}`;

      if (typeof word !== "string") {
        errors.push(`${location}: esperado texto.`);
        continue;
      }

      let isValid = true;
      const letters = Array.from(word);

      if (word !== word.normalize("NFC")) {
        errors.push(`${location} (${word}): não está normalizada em Unicode NFC.`);
        isValid = false;
      }

      if (letters.length < MIN_WORD_LENGTH || letters.length > MAX_WORD_LENGTH) {
        errors.push(
          `${location} (${word}): deve ter de ${MIN_WORD_LENGTH} a ${MAX_WORD_LENGTH} letras.`,
        );
        isValid = false;
      }

      if (!/^\p{L}+$/u.test(word) || letters.some((letter) => normalizeLetter(letter) === null)) {
        errors.push(`${location} (${word}): contém caracteres que não são letras portuguesas.`);
        isValid = false;
      }

      if (word !== word.toLocaleLowerCase("pt-BR")) {
        errors.push(`${location} (${word}): contém letras maiúsculas; nomes próprios não são aceitos.`);
        isValid = false;
      }

      const exactKey = word.normalize("NFC").toLocaleLowerCase("pt-BR");

      if (exactWords.has(exactKey)) {
        errors.push(`${location} (${word}): duplicata após normalização/case folding.`);
        isValid = false;
      } else {
        exactWords.add(exactKey);
      }

      const guessKey = comparisonKey(word);
      const previousWord = accentInsensitiveWords.get(guessKey);

      if (previousWord !== undefined) {
        errors.push(
          `${location} (${word}): duplicata sem acentos de "${previousWord}".`,
        );
        isValid = false;
      } else {
        accentInsensitiveWords.set(guessKey, word);
      }

      if (isValid) {
        validWords += 1;
      }
    }

    if (words.length < MINIMUM_WORDS) {
      errors.push(
        `O banco tem ${words.length} itens; são necessários pelo menos ${MINIMUM_WORDS}.`,
      );
    }
  }

  console.log(`Palavras no arquivo: ${Array.isArray(words) ? words.length : 0}`);
  console.log(`Palavras válidas: ${validWords}`);
  console.log(`Erros encontrados: ${errors.length}`);

  for (const error of errors.slice(0, MAX_DISPLAYED_ERRORS)) {
    console.error(`- ${error}`);
  }

  if (errors.length > MAX_DISPLAYED_ERRORS) {
    console.error(`- ... e mais ${errors.length - MAX_DISPLAYED_ERRORS} erro(s).`);
  }

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}
