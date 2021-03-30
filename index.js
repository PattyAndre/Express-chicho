const express = require("express");

const { BINGO_RANGE } = require("./data");

const app = express();
const port = 3000;

app.use(express.json());

const maxNumber = 75;
let numbersPool = [];
let calledNumbers = [];
let remainingNumbersToCall = maxNumber - 1;

const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fillNumbersPool = () => {
  //fill calledNumbers
  for (let index = 1; index <= maxNumber; index++) {
    numbersPool.push(index);
  }

  shuffleArray(numbersPool);
};

const generateRandomNumbersInRange = (min, max, count) => {
  const result = [];

  for (let index = 0; index < count; index++) {
    let number = Math.floor(Math.random() * (max - min + 1) + min);

    while (result.find((x) => x === number)) {
      number = Math.floor(Math.random() * (max - min + 1) + min);
    }

    result.push(number);
  }

  return result;
};

const validateBingoColumn = (columnArray) => {
  let result = true;

  for (let index = 0; index < columnArray.length; index++) {
    const number = columnArray[index];

    if (!calledNumbers.includes(number)) {
      result = false;
      break;
    }
  }

  return result;
};

fillNumbersPool();

app.get("/generateBingoCard", (req, res) => {
  const bingoCard = {
    b: [],
    i: [],
    n: [],
    g: [],
    o: [],
  };

  bingoCard.b = [
    ...generateRandomNumbersInRange(BINGO_RANGE.B.min, BINGO_RANGE.B.max, 5),
  ];
  bingoCard.i = [
    ...generateRandomNumbersInRange(BINGO_RANGE.I.min, BINGO_RANGE.I.max, 5),
  ];
  bingoCard.n = [
    ...generateRandomNumbersInRange(BINGO_RANGE.N.min, BINGO_RANGE.N.max, 4),
  ];
  bingoCard.g = [
    ...generateRandomNumbersInRange(BINGO_RANGE.G.min, BINGO_RANGE.G.max, 5),
  ];
  bingoCard.o = [
    ...generateRandomNumbersInRange(BINGO_RANGE.O.min, BINGO_RANGE.O.max, 5),
  ];

  res.json(bingoCard);
});

app.get("/callNumber", (req, res) => {
  const position = Math.floor(Math.random() * (remainingNumbersToCall - 1 + 1) + 1);
  const calledNumber = numbersPool[position];

  numbersPool = numbersPool.filter((number) => number != calledNumber);
  remainingNumbersToCall--;
  calledNumbers.push(calledNumber);

  console.log(numbersPool);
  console.log(remainingNumbersToCall);

  res.json({ number: calledNumber });
});

app.post("/checkBingoCard", (req, res) => {
  const { bingoCard } = req.body;

  //check every card column

  const isBColumnValid = validateBingoColumn(bingoCard.b);

  if (!isBColumnValid) res.json({ message: "Is not a winner card yet" });

  const isIColumnValid = validateBingoColumn(bingoCard.i);

  if (!isIColumnValid) res.json({ message: "Is not a winner card yet" });

  const isNColumnValid = validateBingoColumn(bingoCard.n);

  if (!isNColumnValid) res.json({ message: "Is not a winner card yet" });

  const isGColumnValid = validateBingoColumn(bingoCard.g);

  if (!isGColumnValid) res.json({ message: "Is not a winner card yet" });

  const isOColumnValid = validateBingoColumn(bingoCard.o);

  if (!isOColumnValid) res.json({ message: "Is not a winner card yet" });

  res.json({ message: "This is a winner card!" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
