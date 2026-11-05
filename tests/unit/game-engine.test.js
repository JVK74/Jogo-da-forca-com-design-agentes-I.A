import assert from "node:assert/strict";
import test from "node:test";
import {
  applyGuess,
  createGame,
  DEFAULT_MAX_ATTEMPTS,
  getPublicState,
  MAX_ALLOWED_ATTEMPTS,
  normalizeLetter,
  restoreGame,
} from "../../src/worker/game/engine.js";

test("aceita palpite correto e preserva os acentos da palavra original", () => {
  const game = createGame("coração");
  const result = applyGuess(game, "A");

  assert.equal(result.accepted, true);
  assert.equal(result.correct, true);
  assert.deepEqual(getPublicState(result.game).revealedWord, [
    null,
    null,
    null,
    "a",
    null,
    "ã",
    null,
  ]);
});

test("palpite incorreto reduz uma tentativa e é registrado uma única vez", () => {
  const game = createGame("abacate", 3);
  const result = applyGuess(game, "Z");

  assert.equal(result.accepted, true);
  assert.equal(result.correct, false);
  assert.equal(result.game.attemptsRemaining, 2);
  assert.deepEqual(result.game.incorrectLetters, ["Z"]);
});

test("letras repetidas, incluindo variações de acento, não contam novamente", () => {
  const first = applyGuess(createGame("coração"), "A");
  const repeated = applyGuess(first.game, "á");

  assert.equal(repeated.accepted, false);
  assert.equal(repeated.reason, "already_guessed");
  assert.equal("game" in repeated, false);
});

test("palpite acentuado corresponde à letra sem acento", () => {
  const result = applyGuess(createGame("abacate"), "á");

  assert.equal(result.accepted, true);
  assert.equal(result.correct, true);
  assert.deepEqual(result.game.correctLetters, ["A"]);
});

test("rejeita dotless i e caracteres fora do alfabeto permitido", () => {
  for (const letter of ["ı", "ß", "ø", "ñ", "ě", "ð"]) {
    assert.equal(normalizeLetter(letter), null, letter);
  }
});

test("aceita as variantes acentuadas previstas, em maiúsculas e minúsculas", () => {
  const variants = new Map([
    ["Á", "A"], ["á", "A"],
    ["À", "A"], ["à", "A"],
    ["Â", "A"], ["â", "A"],
    ["Ã", "A"], ["ã", "A"],
    ["É", "E"], ["é", "E"],
    ["Ê", "E"], ["ê", "E"],
    ["Í", "I"], ["í", "I"],
    ["Ó", "O"], ["ó", "O"],
    ["Ô", "O"], ["ô", "O"],
    ["Õ", "O"], ["õ", "O"],
    ["Ú", "U"], ["ú", "U"],
    ["Ç", "C"], ["ç", "C"],
  ]);

  for (const [letter, expected] of variants) {
    assert.equal(normalizeLetter(letter), expected, letter);
  }
});

test("aceita letras em Unicode NFC e preserva a grafia NFC da palavra", () => {
  assert.equal(normalizeLetter("ã"), "A");
  assert.equal(normalizeLetter("ç"), "C");
  assert.equal(createGame("coração").secretWord, "coração".normalize("NFC"));
});

test("normaliza letras decompostas antes da validação e comparação", () => {
  assert.equal(normalizeLetter("a\u0303"), "A");
  assert.equal(normalizeLetter("c\u0327"), "C");

  const result = applyGuess(createGame("coração"), "a\u0303");
  assert.equal(result.accepted, true);
  assert.equal(result.correct, true);
  assert.deepEqual(getPublicState(result.game).revealedWord, [
    null, null, null, "a", null, "ã", null,
  ]);
});

test("rejeita letras com diacríticos não previstos e mais de um caractere", () => {
  for (const guess of ["ï", "ñ", "a\u0303b", "ab", "1", " ", "!", ""]) {
    assert.equal(normalizeLetter(guess), null, JSON.stringify(guess));
  }
});

test("rejeita entrada vazia, palavras, números e símbolos", () => {
  const game = createGame("abacate");

  for (const guess of ["", "ab", "123", "!", " a"]) {
    const result = applyGuess(game, guess);
    assert.equal(result.accepted, false, `Entrada ${JSON.stringify(guess)} deveria ser rejeitada`);
    assert.equal(result.reason, "invalid_guess");
    assert.equal("game" in result, false);
  }
});

test("applyGuess não altera o estado de entrada", () => {
  const game = createGame("abacate");
  const snapshot = structuredClone(game);

  const correct = applyGuess(game, "A");
  const incorrect = applyGuess(game, "Z");

  assert.deepEqual(game, snapshot);
  assert.notStrictEqual(correct.game, game);
  assert.notStrictEqual(incorrect.game, game);
});

test("usa seis tentativas por padrão e aceita os limites configuráveis", () => {
  assert.equal(DEFAULT_MAX_ATTEMPTS, 6);
  assert.equal(createGame("abacate").maxAttempts, DEFAULT_MAX_ATTEMPTS);
  assert.equal(createGame("abacate", 1).maxAttempts, 1);
  assert.equal(createGame("abacate", MAX_ALLOWED_ATTEMPTS).maxAttempts, MAX_ALLOWED_ATTEMPTS);
});

test("rejeita configurações de tentativas fora do limite", () => {
  for (const maxAttempts of [0, -1, 1.5, MAX_ALLOWED_ATTEMPTS + 1, Number.NaN]) {
    assert.throws(() => createGame("abacate", maxAttempts), RangeError);
  }
});

test("encerra a partida com vitória quando todas as letras forem acertadas", () => {
  let game = createGame("abacate");

  for (const letter of ["A", "B", "C", "T", "E"]) {
    const result = applyGuess(game, letter);
    assert.equal(result.accepted, true);
    game = result.game;
  }

  assert.equal(game.status, "won");
});

test("encerra a partida com derrota ao esgotar as tentativas", () => {
  let game = createGame("abacate", 2);

  game = applyGuess(game, "X").game;
  const result = applyGuess(game, "Y");

  assert.equal(result.game.status, "lost");
  assert.equal(result.game.attemptsRemaining, 0);
});

test("não aceita palpites após o encerramento", () => {
  let game = createGame("abacate", 1);
  game = applyGuess(game, "X").game;
  const result = applyGuess(game, "A");

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "game_finished");
  assert.equal("game" in result, false);
});

test("estado público não contém a palavra secreta, mesmo após o fim", () => {
  const game = createGame("jabuticaba", 1);
  const beforeEnd = getPublicState(game);
  const afterEnd = getPublicState(applyGuess(game, "X").game);

  for (const publicState of [beforeEnd, afterEnd]) {
    assert.equal("secretWord" in publicState, false);
    assert.equal(JSON.stringify(publicState).includes("jabuticaba"), false);
  }
});

test("serializa e restaura estado, mantendo o segredo fora do estado público", () => {
  let game = createGame("coração", 4);
  game = applyGuess(game, "A").game;
  game = applyGuess(game, "Z").game;

  const restored = restoreGame(JSON.parse(JSON.stringify(game)));

  assert.deepEqual(restored, game);
  assert.equal("secretWord" in getPublicState(restored), false);
  assert.equal(JSON.stringify(getPublicState(restored)).includes("coração"), false);
  assert.deepEqual(restored.guessHistory, ["A", "Z"]);
});

test("partida restaurada continua aceitando palpites com resultado consistente", () => {
  let game = createGame("abacate", 3);
  game = applyGuess(game, "Z").game;
  const restored = restoreGame(JSON.parse(JSON.stringify(game)));

  const originalResult = applyGuess(game, "A");
  const restoredResult = applyGuess(restored, "A");

  assert.deepEqual(restoredResult, originalResult);
});

test("restaura partidas encerradas com estado terminal consistente", () => {
  let won = createGame("abacate");
  for (const letter of ["A", "B", "C", "T", "E"]) {
    won = applyGuess(won, letter).game;
  }

  let lost = createGame("abacate", 1);
  lost = applyGuess(lost, "Z").game;

  assert.equal(restoreGame(JSON.parse(JSON.stringify(won))).status, "won");
  assert.equal(restoreGame(JSON.parse(JSON.stringify(lost))).status, "lost");
});

test("rejeita estado persistido inconsistente", () => {
  const game = createGame("abacate");
  const corrupted = { ...game, attemptsRemaining: 0 };

  assert.throws(() => restoreGame(corrupted), TypeError);
});

test("respostas de rejeição não incluem estado privado nem palavra secreta", () => {
  const secret = "jabuticaba";
  const game = createGame(secret, 6);
  const invalid = applyGuess(game, "!");
  const afterWrongGuess = applyGuess(game, "Z").game;
  const repeated = applyGuess(afterWrongGuess, "Z");
  const lost = applyGuess(createGame(secret, 1), "Z").game;
  const finished = applyGuess(lost, "A");

  for (const rejection of [invalid, repeated, finished]) {
    assert.equal(rejection.accepted, false);
    assert.equal("game" in rejection, false);
    assert.equal(JSON.stringify(rejection).includes(secret), false);
  }
});

test("mensagens de erro da restauração não incluem dados privados", () => {
  const secret = "jabuticaba";
  const snapshot = createGame(secret);
  delete snapshot.guessHistory;

  assert.throws(() => restoreGame(snapshot), (error) => {
    assert.equal(error instanceof TypeError, true);
    assert.equal(error.message.includes(secret), false);
    return true;
  });
});

test("restauração rejeita vitória forjada após esgotar tentativas", () => {
  const game = createGame("abacate", 1);
  const impossibleWin = {
    ...game,
    guessHistory: ["Z", "A", "B", "C", "T", "E"],
    usedLetters: ["Z", "A", "B", "C", "T", "E"],
    correctLetters: ["A", "B", "C", "T", "E"],
    incorrectLetters: ["Z"],
    attemptsRemaining: 0,
    status: "won",
  };

  assert.throws(() => restoreGame(JSON.parse(JSON.stringify(impossibleWin))), TypeError);
});

test("restauração rejeita palpites registrados depois do encerramento", () => {
  let game = createGame("abacate", 1);
  game = applyGuess(game, "Z").game;
  const afterEnd = {
    ...game,
    guessHistory: [...game.guessHistory, "A"],
    usedLetters: [...game.usedLetters, "A"],
    correctLetters: ["A"],
  };

  assert.throws(() => restoreGame(JSON.parse(JSON.stringify(afterEnd))), TypeError);
});

test("restauração rejeita listas inconsistentes, incompletas e adulteradas", () => {
  const game = createGame("abacate");
  const withGuess = applyGuess(game, "Z").game;
  const missingField = { ...withGuess };
  delete missingField.incorrectLetters;
  const alteredAttempts = { ...withGuess, attemptsRemaining: 4 };
  const alteredList = { ...withGuess, incorrectLetters: [] };
  const unknownField = { ...withGuess, debug: "unexpected" };

  for (const snapshot of [missingField, alteredAttempts, alteredList, unknownField]) {
    assert.throws(() => restoreGame(JSON.parse(JSON.stringify(snapshot))), TypeError);
  }
});

test("restauração rejeita palpites duplicados, inválidos e fora da ordem canônica", () => {
  const game = createGame("abacate");

  for (const guessHistory of [["A", "A"], ["!",], ["á"], ["A", "Z", "A"]]) {
    assert.throws(
      () => restoreGame({ ...game, guessHistory }),
      TypeError,
      JSON.stringify(guessHistory),
    );
  }
});

test("restauração e palpites mantêm a palavra privada fora das rejeições", () => {
  const secret = "jabuticaba";
  let game = createGame(secret, 1);
  game = applyGuess(game, "Z").game;
  const restored = restoreGame(JSON.parse(JSON.stringify(game)));
  const rejection = applyGuess(restored, "A");

  assert.equal("game" in rejection, false);
  assert.equal(JSON.stringify(rejection).includes(secret), false);
  assert.equal(JSON.stringify(getPublicState(restored)).includes(secret), false);
});
