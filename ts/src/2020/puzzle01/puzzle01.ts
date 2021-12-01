import { PuzzleInputReader } from '../../util/PuzzleInputReader';

const numbers: number[] = new PuzzleInputReader(1)
  .getPuzzleInputSplitByLines()
  .map((s) => Number.parseInt(s, 10));

let productA: number = 0;
let productB: number = 0;

// Part A
for (let i = 0; i < numbers.length - 1; i++) {
  for (let k = i + 1; k < numbers.length; k++) {
    if (numbers[i] + numbers[k] === 2020) {
      productA = numbers[i] * numbers[k];
    }
  }
}

console.log(`Solution Part A: ${productA}`);

// Part B
for (let i = 0; i < numbers.length - 2; i++) {
  for (let k = i + 1; k < numbers.length - 1; k++) {
    for (let j = k + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[k] + numbers[j] === 2020) {
        productB = numbers[i] * numbers[k] * numbers[j];
      }
    }
  }
}

console.log(`Solution Part A: ${productB}`);
