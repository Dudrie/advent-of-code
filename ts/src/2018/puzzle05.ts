import { readPuzzleInput } from '../util/PuzzleInputReader';

/** Thats the (absolute) difference between the charCode of a small letter and it's big variant. */
const CHAR_CODE_DIFF: number = 32;

const origInput: string = readPuzzleInput(5);
// origInput = 'dabAcCaCBAcCcaDA'; // Testing

// Part A
console.log('Calculating Part A');
console.log(`Part A -- Unit count remaining: ${clearReactingPolymers(origInput).length}`);

// Part B
console.log('Calculating Part B');

const str: string = 'az';
const charSmallA: number = str.charCodeAt(0);
const charSmallZ: number = str.charCodeAt(1);

let currentSmallestLength: number = Number.MAX_SAFE_INTEGER;

for (let i = charSmallA; i < charSmallZ + 1; i++) {
  const character: string = String.fromCharCode(i);
  // console.log(`${character}|${character.toUpperCase()}`);
  const cleanedChain: string = origInput.replace(
    new RegExp(`${character}|${character.toUpperCase()}`, 'g'),
    ''
  );

  const resultChain: string = clearReactingPolymers(cleanedChain);

  if (resultChain.length < currentSmallestLength) {
    currentSmallestLength = resultChain.length;
  }
}

console.log(`Part B -- Smallest possible length: ${currentSmallestLength}`);

// ========== HELPERS ==========
/**
 * Will remove all reaction 'pairs' from the given polymer.
 *
 * This is done by iterating multiple times over the polymer and removing all reactions within it. The result polymer is returned. Please be aware that there is at least one iteration even if there are no reactions within the given polymer.
 *
 * @param polyChain Polymer chain which reactions should be cleared
 * @return Result polymer after all reactions are cleared
 */
function clearReactingPolymers(polyChain: string): string {
  let resultChain = polyChain;
  let hadChangeInLastRun: boolean = false;

  do {
    hadChangeInLastRun = false;

    for (let i = 0; i < resultChain.length - 1; i++) {
      const charCur: number = resultChain.charCodeAt(i);
      const charNext: number = resultChain.charCodeAt(i + 1);

      if (Number.isNaN(charCur) || Number.isNaN(charNext)) {
        throw new Error('ERROR! CALL SANTA IMMEDIATLY!');
      }

      if (Math.abs(charCur - charNext) === CHAR_CODE_DIFF) {
        // REACTION! - so remove the two chars from the string.
        resultChain = resultChain.substring(0, i).concat(resultChain.substring(i + 2));
        hadChangeInLastRun = true;
      }
    }
  } while (hadChangeInLastRun);

  return resultChain;
}
