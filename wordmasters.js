const word = document.querySelector(".wotd");
const input = document.querySelector(".input");

let wordOfTheDay;
let playerInput = "";

// input.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     const word = event.target.value;
//     validateWord(word);
//   }
// });

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

function renderWord(word) {
  for (let i = 0; i < wordOfTheDay.length; i++) {
    document.querySelector(`.letter-${i}`);
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
  word.textContent = wordOfTheDay;

  document.addEventListener("keydown", (event) => {
    if (isLetter(event.key)) {
      playerInput += event.key;
      renderWord(playerInput);
    }
  });
}

init();
