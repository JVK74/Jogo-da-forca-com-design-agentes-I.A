export const DEFAULT_MAX_ATTEMPTS = 6;
export const MAX_ALLOWED_ATTEMPTS = 26;

const MIN_WORD_LENGTH = 5;
const MAX_WORD_LENGTH = 12;
const ALLOWED_LETTER = /^[A-Za-zÀÁÂÃÇÉÊÍÓÔÕÚàáâãçéêíóôõú]$/u;

function isNormalizedGuessLetter(value) {
  return typeof value === "string" && /^[A-Z]$/.test(value);
}

export function normalizeLetter(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.normalize("NFC");
  const letters = Array.from(normalized);

  if (letters.length !== 1 || !ALLOWED_LETTER.test(normalized)) {
    return null;
  }

  const key = normalized
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleUpperCase("pt-BR");

  return /^[A-Z]$/.test(key) ? key : null;
}

function getWordLetters(word) {
  if (typeof word !== "string") {
    throw new TypeError("A palavra secreta deve ser um texto.");
  }

  const normalizedWord = word.normalize("NFC");
  const letters = Array.from(normalizedWord);

  if (
    letters.length < MIN_WORD_LENGTH ||
    letters.length > MAX_WORD_LENGTH ||
    letters.some((letter) => normalizeLetter(letter) === null)
  ) {
    throw new TypeError(
      "A palavra secreta deve ter de 5 a 12 letras portuguesas, sem espaços ou símbolos.",
    );
  }

  return { normalizedWord, letters };
}

export function createGame(secretWord, maxAttempts = DEFAULT_MAX_ATTEMPTS) {
  const { normalizedWord } = getWordLetters(secretWord);

  if (
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1 ||
    maxAttempts > MAX_ALLOWED_ATTEMPTS
  ) {
    throw new RangeError(
      `O número máximo de tentativas deve ser um inteiro entre 1 e ${MAX_ALLOWED_ATTEMPTS}.`,
    );
  }

  return {
    secretWord: normalizedWord,
    guessHistory: [],
    usedLetters: [],
    correctLetters: [],
    incorrectLetters: [],
    attemptsRemaining: maxAttempts,
    maxAttempts,
    status: "playing",
  };
}

function applyValidatedGuess(game, letter) {
  if (game.status !== "playing") {
    return { accepted: false, reason: "game_finished" };
  }

  if (game.usedLetters.includes(letter)) {
    return { accepted: false, reason: "already_guessed" };
  }

  const { letters } = getWordLetters(game.secretWord);
  const isCorrect = letters.some((targetLetter) => normalizeLetter(targetLetter) === letter);
  const usedLetters = [...game.usedLetters, letter];
  const guessHistory = [...game.guessHistory, letter];

  if (isCorrect) {
    const correctLetters = [...game.correctLetters, letter];
    const targetLetters = new Set(letters.map(normalizeLetter));
    const status = [...targetLetters].every((targetLetter) =>
      correctLetters.includes(targetLetter),
    )
      ? "won"
      : "playing";

    return {
      game: { ...game, guessHistory, usedLetters, correctLetters, status },
      accepted: true,
      correct: true,
    };
  }

  const attemptsRemaining = game.attemptsRemaining - 1;
  const status = attemptsRemaining === 0 ? "lost" : "playing";

  return {
    game: {
      ...game,
      guessHistory,
      usedLetters,
      incorrectLetters: [...game.incorrectLetters, letter],
      attemptsRemaining,
      status,
    },
    accepted: true,
    correct: false,
  };
}

export function restoreGame(snapshot) {
  if (
    snapshot === null ||
    typeof snapshot !== "object" ||
    Array.isArray(snapshot) ||
    Object.getPrototypeOf(snapshot) !== Object.prototype
  ) {
    throw new TypeError("O estado persistido da partida é inválido.");
  }

  const expectedKeys = [
    "attemptsRemaining",
    "correctLetters",
    "guessHistory",
    "incorrectLetters",
    "maxAttempts",
    "secretWord",
    "status",
    "usedLetters",
  ];
  const actualKeys = Object.keys(snapshot).sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw new TypeError("O estado persistido da partida está incompleto ou contém campos inválidos.");
  }

  const { normalizedWord } = getWordLetters(snapshot.secretWord);

  if (normalizedWord !== snapshot.secretWord) {
    throw new TypeError("A palavra persistida deve estar normalizada em Unicode NFC.");
  }

  if (
    !Number.isInteger(snapshot.maxAttempts) ||
    snapshot.maxAttempts < 1 ||
    snapshot.maxAttempts > MAX_ALLOWED_ATTEMPTS ||
    !Number.isInteger(snapshot.attemptsRemaining) ||
    snapshot.attemptsRemaining < 0 ||
    snapshot.attemptsRemaining > snapshot.maxAttempts
  ) {
    throw new TypeError("Os limites de tentativas persistidos são inválidos.");
  }

  if (!Array.isArray(snapshot.guessHistory)) {
    throw new TypeError("O histórico persistido de palpites é inválido.");
  }

  let restored = createGame(normalizedWord, snapshot.maxAttempts);

  for (const guess of snapshot.guessHistory) {
    if (!isNormalizedGuessLetter(guess) || normalizeLetter(guess) !== guess) {
      throw new TypeError("O histórico persistido contém um palpite inválido.");
    }

    const result = applyValidatedGuess(restored, guess);

    if (!result.accepted) {
      throw new TypeError("O histórico persistido contém palpites repetidos ou após o encerramento.");
    }

    restored = result.game;
  }

  const matchesSnapshot =
    snapshot.attemptsRemaining === restored.attemptsRemaining &&
    snapshot.status === restored.status &&
    Array.isArray(snapshot.usedLetters) &&
    Array.isArray(snapshot.correctLetters) &&
    Array.isArray(snapshot.incorrectLetters) &&
    JSON.stringify(snapshot.usedLetters) === JSON.stringify(restored.usedLetters) &&
    JSON.stringify(snapshot.correctLetters) === JSON.stringify(restored.correctLetters) &&
    JSON.stringify(snapshot.incorrectLetters) === JSON.stringify(restored.incorrectLetters);

  if (!matchesSnapshot) {
    throw new TypeError("O estado persistido não corresponde ao histórico de palpites.");
  }

  return restored;
}

export function applyGuess(game, guess) {
  const currentGame = restoreGame(game);

  if (currentGame.status !== "playing") {
    return { accepted: false, reason: "game_finished" };
  }

  const letter = normalizeLetter(guess);

  if (letter === null) {
    return { accepted: false, reason: "invalid_guess" };
  }

  if (currentGame.usedLetters.includes(letter)) {
    return { accepted: false, reason: "already_guessed" };
  }

  return applyValidatedGuess(currentGame, letter);
}

export function getPublicState(game) {
  const validGame = restoreGame(game);
  const { letters } = getWordLetters(validGame.secretWord);
  const correctLetters = new Set(validGame.correctLetters);

  return {
    revealedWord: letters.map((letter) =>
      correctLetters.has(normalizeLetter(letter)) ? letter : null,
    ),
    usedLetters: [...validGame.usedLetters],
    correctLetters: [...validGame.correctLetters],
    incorrectLetters: [...validGame.incorrectLetters],
    attemptsRemaining: validGame.attemptsRemaining,
    maxAttempts: validGame.maxAttempts,
    status: validGame.status,
  };
}
