const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;
  setLoading(false);
  isLoading = false;

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      // Replaces the last letter with a new one since we are at the max length
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter;
  }

  async function commit() {
    if (currentGuess.length != ANSWER_LENGTH) {
      // Ignore if the guess is not complete
      return;
    }

    // TODO: Validate the guess
    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const resObj = await res.json();
    const validWord = resObj.validWord;
    isLoading = false;
    setLoading(false);

    if (!validWord) {
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);

    // Check for correct letters
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      const letter = guessParts[i];
      const letterDiv = letters[currentRow * ANSWER_LENGTH + i];
      if (letter === wordParts[i]) {
        letterDiv.classList.add("correct");
        map[letter]--;
      }
    }

    // Check for close letters and wrong letters
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      const letter = guessParts[i];
      const letterDiv = letters[currentRow * ANSWER_LENGTH + i];
      if (guessParts[i] === wordParts[i]) {
        // Do nothing
      } else if (wordParts.includes(letter) && map[letter] > 0) {
        letterDiv.classList.add("close");
        map[letter]--;
      } else {
        letterDiv.classList.add("wrong");
      }
    }

    currentRow++;

    // Check if the game is done
    if (currentGuess === word) {
      done = true;
      document.querySelector(".brand").classList.add("winner");
      console.log("You win!");
    } else if (currentRow === ROUNDS) {
      alert(`You lost! The word was: ${word}`);
      done = true;
    }

    // Reset the current guess
    currentGuess = "";
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  function markInvalidWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid");

      setTimeout(() => {
        letters[ANSWER_LENGTH * currentRow + i].classList.remove("invalid");
      }, 300);
    }
  }

  document.addEventListener("keydown", async function handleKeyPress(event) {
    if (done || isLoading) {
      // Do nothing game is done or loading
      return;
    }

    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // Ignore other keys
      console.log(`Ignoring key: ${action}`);
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle("show", isLoading);
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

  return obj;
}

init();
