import { getLinesOfInput, readPuzzleInput } from '../util/PuzzleInputReader';

const boxIds: string[] = getLinesOfInput(readPuzzleInput(2));

// Part A
console.log('Calculation Part A...');

let withTwo: number = 0;
let withThree: number = 0;

boxIds.forEach(id => {
  if (hasLetterGivenTimes(2, id)) {
    withTwo += 1;
  }

  if (hasLetterGivenTimes(3, id)) {
    withThree += 1;
  }
});

console.log(`Part A -- Checksum: ${withTwo * withThree}`);

// Part B
console.log('Calculation Part B...');

type Pair = { first: string; second: string };
const pairs: Pair[] = [];

for (let i = 0; i < boxIds.length; i++) {
  for (let k = i + 1; k < boxIds.length; k++) {
    const levDist: number = calcLevenshteinDistance(boxIds[i], boxIds[k]);

    if (levDist === 1) {
      pairs.push({ first: boxIds[i], second: boxIds[k] });
    }
  }
}

// Generate the output
let result: string = 'NO RESULT FOUND';
let wrongCharIdx: number = -1;

for (const idPair of pairs) {
  let innerRes: string | undefined = undefined;
  for (let i = 0; i < idPair.first.length && i < idPair.second.length; i++) {
    if (idPair.first[i] !== idPair.second[i]) {
      wrongCharIdx = i;
      break;
    }
  }

  if (wrongCharIdx !== -1) {
    innerRes = idPair.first
      .substring(0, wrongCharIdx)
      .concat(idPair.first.substring(wrongCharIdx + 1));
  }

  if (innerRes) {
    result = innerRes;
    break;
  }
}

console.log(`Part B -- Result: ${result}`);

// ================ HELPERS ====================

function countOccurences(letter: string, id: string): number {
  let count: number = 0;
  for (const s of id) {
    if (s === letter) {
      count += 1;
    }
  }

  return count;
}

function hasLetterGivenTimes(times: number, id: string): boolean {
  for (const s of id) {
    if (countOccurences(s, id) === times) {
      return true;
    }
  }

  return false;
}

function calcLevenshteinDistance(idOne: string, idTwo: string): number {
  const dist: number[][] = Array.from({ length: idOne.length + 1 }, () => {
    return Array.from({ length: idTwo.length + 1 }, () => 0);
  });

  for (let i = 1; i < idOne.length + 1; i++) {
    dist[i][0] = i;
  }

  for (let k = 1; k < idTwo.length + 1; k++) {
    dist[0][k] = k;
  }

  for (let i = 1; i < idOne.length; i++) {
    for (let k = 1; k < idTwo.length; k++) {
      let subCost: number = 0;
      if (idOne[i] != idTwo[k]) {
        subCost = 1;
      }

      dist[i][k] = Math.min(dist[i - 1][k] + 1, dist[i][k - 1] + 1, dist[i - 1][k - 1] + subCost);
    }
  }

  return dist[idOne.length - 1][idTwo.length - 1];
}
