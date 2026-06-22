import { config, gameState, checkGuess } from "./game.js";
console.log(gameState.targetWord);

const grid = document.getElementById("game-grid");

function addTileToGrid(row, col) {
  const tile = document.createElement("div");
  tile.className = "letter";
  tile.id = `cell-r${row},c${col}`;
  tile.setAttribute("data-row", row);
  grid.appendChild(tile);
}

function setUpGrid() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${config.wordLength}, 60px)`;
  for (let row = 0; row < config.maxAttempts; row++) {
    for (let col = 0; col < config.wordLength; col++) {
      addTileToGrid(row, col);
    }
  }
}

setUpGrid();

function isLetter(input) {
  return input.length === 1 && /[a-z]/i.test(input);
}

const handleKeyDown = (e) => {
  if (isLetter(e.key)) {
    addLetter(e.key);
  } else if (e.key === `Backspace`) {
    removeLetter();
  } else if (e.key === "Enter") {
    submitGuess();
  }
};

document.addEventListener("keydown", handleKeyDown);

document.getElementById("button-settings").addEventListener("click", () => {
  alert("sorry, no settings yet");
});

function addLetter(letter) {
  if (
    gameState.currentPosition < config.wordLength &&
    gameState.currentAttempt < config.maxAttempts
  ) {
    const cell = document.getElementById(
      `cell-r${gameState.currentAttempt},c${gameState.currentPosition}`,
    );
    cell.textContent = letter;
    gameState.currentPosition++;
  }
}

function removeLetter() {
  if (gameState.currentPosition > 0) {
    gameState.currentPosition--;
    const cell = document.getElementById(
      `cell-r${gameState.currentAttempt},c${gameState.currentPosition}`,
    );
    cell.textContent = "";
  }
}

const tileRevealDelay = 300;

async function submitGuess() {
  if (gameState.currentPosition < config.wordLength) {
    alert("incomplete word");
    return;
  }
  const rowTiles = document.querySelectorAll(
    `[data-row="${gameState.currentAttempt}"]`,
  );
  const userGuess = Array.from(rowTiles)
    .map((tile) => {
      return tile.textContent;
    })
    .join("");

  const results = await checkGuess(userGuess);
  if (!results) {
    console.error("not a word");
    return;
  }

  revealAttemptResults(results);

  const isWon = results.every((result) => result === "correct");
  if (isWon) {
    lockInput();
    setTimeout(() => {
      alert("you win!");
    }, config.wordLength * tileRevealDelay);
    return;
  }

  const isLoss = gameState.currentAttempt >= config.maxAttempts - 1;
  if (isLoss) {
    lockInput();
    setTimeout(() => {
      alert("you lose! LOSER");
    }, config.wordLength * tileRevealDelay);
    return;
  }

  gameState.currentAttempt++;
  gameState.currentPosition = 0;
}

function revealAttemptResults(results) {
  const rowToReveal = gameState.currentAttempt;
  results.forEach((result, col) => {
    const cell = document.getElementById(`cell-r${rowToReveal},c${col}`);
    setTimeout(() => {
      cell.classList.add(result);
    }, col * tileRevealDelay);
  });
}

function lockInput() {
  document.removeEventListener("keydown", handleKeyDown);
}
