const MIN_WORD_LENGTH = 5;
const MAX_WORD_LENGTH = 12;

export function normalizeLetter(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.normalize("NFC");
  const letters = Array.from(normalized);

  if (letters.length !== 1 || !/^\p{L}$/u.test(normalized)) {
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

export function createGame(secretWord, maxAttempts = 6) {
  const { normalizedWord } = getWordLetters(secretWord);

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError("O número máximo de tentativas deve ser um inteiro positivo.");
  }

  return {
    secretWord: normalizedWord,
    usedLetters: [],
    correctLetters: [],
    incorrectLetters: [],
    attemptsRemaining: maxAttempts,
    maxAttempts,
    status: "playing",
  };
}

export function applyGuess(game, guess) {
  if (!game || typeof game.secretWord !== "string") {
    throw new TypeError("O estado da partida é inválido.");
  }

  if (game.status !== "playing") {
    return { game, accepted: false, reason: "game_finished" };
  }

  const letter = normalizeLetter(guess);

  if (letter === null) {
    return { game, accepted: false, reason: "invalid_guess" };
  }

  if (game.usedLetters.includes(letter)) {
    return { game, accepted: false, reason: "already_guessed" };
  }

  const { letters } = getWordLetters(game.secretWord);
  const isCorrect = letters.some((targetLetter) => normalizeLetter(targetLetter) === letter);
  const usedLetters = [...game.usedLetters, letter];

  if (isCorrect) {
    const correctLetters = [...game.correctLetters, letter];
    const targetLetters = new Set(letters.map(normalizeLetter));
    const status = [...targetLetters].every((targetLetter) =>
      correctLetters.includes(targetLetter),
    )
      ? "won"
      : "playing";

    return {
      game: { ...game, usedLetters, correctLetters, status },
      accepted: true,
      correct: true,
    };
  }

  const attemptsRemaining = game.attemptsRemaining - 1;
  const status = attemptsRemaining === 0 ? "lost" : "playing";

  return {
    game: {
      ...game,
      usedLetters,
      incorrectLetters: [...game.incorrectLetters, letter],
      attemptsRemaining,
      status,
    },
    accepted: true,
    correct: false,
  };
}

export function getPublicState(game) {
  if (!game || typeof game.secretWord !== "string") {
    throw new TypeError("O estado da partida é inválido.");
  }

  const { letters } = getWordLetters(game.secretWord);
  const correctLetters = new Set(game.correctLetters);

  return {
    revealedWord: letters.map((letter) =>
      correctLetters.has(normalizeLetter(letter)) ? letter : null,
    ),
    usedLetters: [...game.usedLetters],
    correctLetters: [...game.correctLetters],
    incorrectLetters: [...game.incorrectLetters],
    attemptsRemaining: game.attemptsRemaining,
    maxAttempts: game.maxAttempts,
    status: game.status,
  };
}
