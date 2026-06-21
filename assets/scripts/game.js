export const config = {
  wordLength: 5,
  maxAttempts: 6,
};

export const gameState = {
  currentAttempt: 0,
  currentPosition: 0,
  targetWord: await getRandomWord(),
};

async function getRandomWord() {
  let validWord = false;
  let data;
  const loadingText = document.getElementById("game-loading");
  loadingText.classList.remove("hidden");
  while (!validWord) {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?length=${config.wordLength}`,
      // `https://random-words-api.kushcreates.com/api?length=${config.wordLength}&words=1`,
    );
    data = await response.json();
    validWord = await isValidWord(data[0]);
    console.log("attempted word: " + data[0] + ". Is a word?: " + validWord);
  }
  // return data[0].word;
  loadingText.classList.add("hidden");
  return data[0];
}

export async function checkGuess(guess) {
  const isValid = await isValidWord(guess.toLowerCase());
  if (!isValid) return;
  const targetLetters = gameState.targetWord.toLowerCase().split("");
  const guessLetters = guess.toLowerCase().split("");

  // TODO: Make checks for misplaced more complex.
  return guessLetters.map((letter, index) => {
    if (letter === targetLetters[index]) {
      return "correct";
    } else if (targetLetters.includes(letter)) {
      return "misplaced";
    } else {
      return "incorrect";
    }
  });
}

async function isValidWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    return response.ok;
  } catch {
    return false;
  }
}
