const input = document.querySelector(".input");

let wordOfTheDay;
let buffer = "";
let pastWords = [];
let currentRow = 1;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function validateWord(word) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word: word }),
  };
  const response = await fetch(
    `https://words.dev-apis.com/validate-word/`,
    options
  );
  const data = await response.json();
  console.log(data);
}

// TODO: Refactor this section to support the different rows for limited scope.
// TODO: Need to check each letter in the word and compare it to the word of the day to style it.
// TODO: This also needs to render past words and style them accordingly.
async function renderWord(word) {
  const typedWord = await word;
  // TODO: Refactor this section to support the different rows for limited scope.
  for (let i = 0; i < 30; i++) {
    if (typedWord[i] === "") {
      document.getElementById(`letter-${i}`).textContent = "";
    } else if (typedWord[i] != "") {
      const letter = typedWord[i];
      document.getElementById(`letter-${i}`).textContent = letter;
    }
  }
}

async function getWordOfTheDay() {
  const response = await fetch("https://words.dev-apis.com/word-of-the-day");
  const data = await response.json();
  return data.word;
}

async function init() {
  console.log("Project Initiated!");
  wordOfTheDay = await getWordOfTheDay();

  document.addEventListener("keydown", (event) => {
    if (isLetter(event.key)) {
      buffer += event.key;
    } else if (event.key === "Backspace") {
      buffer = buffer.slice(0, -1);
    } else if (event.key === "Enter") {
      validateWord(buffer);
      pastWords.push(buffer);
      buffer = "";
      currentRow++;
      console.log(pastWords);
    }

    renderWord(buffer);
  });
}

init();
