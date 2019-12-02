/**
 * Part B was solved using the underlying idea of sophiebits from the subreddit to search for a pattern within the amount that gets added to the sum with each iteration.
 * Q: https://www.reddit.com/r/adventofcode/comments/a5eztl/2018_day_12_solutions/ebm4c9d
 */
import { readPuzzleInput, getLinesOfInput } from '../util/utils';

const initialState: string =
  '###......#.#........##.###.####......#..#####.####..#.###..#.###.#..#..#.#..#..#.##...#..##......#.#';
const input: string[] = getLinesOfInput(readPuzzleInput(12));

type Patterns = { [pattern: string]: string };
const patterns: Patterns = {};
input.forEach(line => {
  const [pattern, result]: string[] = line.split('=>').map(i => i.trim());
  patterns[pattern] = result;
});

type Pots = { [idx: number]: string };
const initialPots: Pots = {};
let pots: Pots = initialPots;

let smallestIdxWithPot: number = 0;
let greatestIdxWithPot: number = 0;

for (let i = 0; i < initialState.length; i++) {
  initialPots[i] = initialState.charAt(i);

  if (initialPots[i] === '#') {
    greatestIdxWithPot = i;
  }
}

// Go over every generation
for (let gen = 1; gen <= 20; gen++) {
  const { newGenPots, smallest, greatest } = advancePotsOneGeneration(
    pots,
    patterns,
    smallestIdxWithPot,
    greatestIdxWithPot
  );

  pots = newGenPots;
  smallestIdxWithPot = smallest;
  greatestIdxWithPot = greatest;
}

console.log(`Part A -- Sum of all numbers of pots with plants: ${getPotsSum(pots)}`);

// Part B
console.log('\nCalculating Part B...');

let lastSum: number = 0;
let lastAdded: number = 0;
let countSameAdded: number = 0;
let generationIdxEqual: number = 0;

// Reset
pots = initialPots;
smallestIdxWithPot = 0;

for (const [idx, val] of Object.entries(pots)) {
  if (val === '#') {
    greatestIdxWithPot = Number.parseInt(idx);
  }
}

// for (let gen = 0; gen < 50000000000; gen++) {
for (let gen = 1; gen < 50000000000; gen++) {
  const { newGenPots, smallest, greatest } = advancePotsOneGeneration(
    pots,
    patterns,
    smallestIdxWithPot,
    greatestIdxWithPot
  );

  pots = newGenPots;
  smallestIdxWithPot = smallest;
  greatestIdxWithPot = greatest;

  const sum = getPotsSum(pots);
  const added = sum - lastSum;
  lastSum = sum;

  if (added === lastAdded) {
    countSameAdded++;
  }

  lastAdded = added;

  if (countSameAdded === 100) {
    console.log(
      `Added the same amount (${added}) a few times -- Assuming it stays equal from now on.`
    );
    generationIdxEqual = gen;
    break;
  }
}

const totalSum: number = lastSum + (50000000000 - generationIdxEqual) * lastAdded;
console.log(`Part B -- Sum of all numbers of pots with plants: ${totalSum}`);

// ========== HELPERS ==========
function getFallbackState(pattern: string): string {
  console.warn(`No matching pattern found for '${pattern}' -- Using '.' as result.`);
  return '.';
}

function getPotsSum(pots: Pots): number {
  let sum = 0;
  for (const [idx, content] of Object.entries(pots)) {
    if (content === '#') {
      sum += Number.parseInt(idx);
    }
  }

  return sum;
}

function advancePotsOneGeneration(
  pots: Pots,
  patterns: Patterns,
  smallestIdx: number,
  greatestIdx: number
): { newGenPots: Pots; smallest: number; greatest: number } {
  const newGenPots: Pots = {};
  let smallest: number = smallestIdx;
  let greatest: number = greatestIdx;

  for (let currPot = smallestIdx - 2; currPot < greatestIdx + 3; currPot++) {
    let currPattern: string = '';
    for (let i = currPot - 2; i < currPot + 3; i++) {
      currPattern += pots[i] || '.';
    }

    // If the pattern does not get matched, we set it to '.' and print a warning.
    newGenPots[currPot] = patterns[currPattern] || getFallbackState(currPattern);

    // Adjust min and max pots.
    if (newGenPots[currPot] === '#') {
      if (currPot < smallest) {
        smallest = currPot;
      } else if (currPot > greatest) {
        greatest = currPot;
      }
    }
  }

  return {
    newGenPots,
    smallest,
    greatest,
  };
}
