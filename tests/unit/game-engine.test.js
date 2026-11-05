import assert from "node:assert/strict";
import test from "node:test";
import { applyGuess, createGame, getPublicState } from "../../src/worker/game/engine.js";

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
  assert.equal(repeated.game.attemptsRemaining, first.game.attemptsRemaining);
});

test("palpite acentuado corresponde à letra sem acento", () => {
  const result = applyGuess(createGame("abacate"), "á");

  assert.equal(result.accepted, true);
  assert.equal(result.correct, true);
  assert.deepEqual(result.game.correctLetters, ["A"]);
});

test("rejeita entrada vazia, palavras, números e símbolos", () => {
  const game = createGame("abacate");

  for (const guess of ["", "ab", "123", "!", " a"]) {
    const result = applyGuess(game, guess);
    assert.equal(result.accepted, false, `Entrada ${JSON.stringify(guess)} deveria ser rejeitada`);
    assert.equal(result.reason, "invalid_guess");
    assert.equal(result.game, game);
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
  assert.equal(result.game, game);
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
