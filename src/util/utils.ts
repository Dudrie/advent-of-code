import * as fs from 'fs';
import * as path from 'path';
import pkg from '../../package.json';

/**
 * Reads the input of the given puzzle.
 *
 * Reads the corresponding input file of the given puzzle by translating the puzzleNumber to a string. If the puzzleNumber does not have 2 digits a leading 0 will be added. The input is returned as a single String.
 *
 * @param puzzleNumber Number of the puzzle of which the input file should be read
 * @param testNr (default: 0) Determines if and which test input to load which is set by the number. The number has to be higher than 0 and there has to exist a file ending with 'TestXX' where 'XX' is the number.
 *
 * @returns Puzzle input as String
 */
export function readPuzzleInput(puzzleNumber: number, testNr: number = 0): string {
  const numString: string = getNumString(puzzleNumber, 2);

  const testString: string = testNr > 0 ? `Test${getNumString(testNr, 2)}` : '';
  const fileContentBuffer: Buffer = fs.readFileSync(
    path.join(__dirname, '..', `${pkg.currentYear}`, 'input', `puzzle${numString}${testString}.txt`)
  );

  return fileContentBuffer.toString();
}

/**
 * Converts a number to a string with a given length.
 *
 * Converts the given number to a string with the specified length. If the number itself is to short the string gets enlarged by adding leading zeros.
 *
 * @param num Number to convert to a string
 * @param length Length the returned string should have
 *
 * @returns String of the given number with the given length.
 */
function getNumString(num: number, length: number): string {
  let numString: string = num + '';

  while (numString.length < length) {
    numString = '0' + numString;
  }

  return numString;
}

/**
 * Splits the given input by line.
 *
 * Each line of the given input will be a seperate entry in the returned array. It ignores empty lines.
 *
 * @param input Input to split by line
 * @returns Array with strings in which every (previous) line is an entry
 */
export function getLinesOfInput(input: string): string[] {
  return input.split(/\r\n|\r|\n/).filter(line => line !== '');
}

/**
 * Prints the given map to the console.
 *
 * Prints the content of the given map to the console. Alternating between a line with the key and a line with the corresponding value.
 *
 * @param map Map to print to console
 */
export function printMap(map: Map<any, any>) {
  const it = map.entries();
  let next = it.next();

  while (!next.done) {
    console.log(next.value[0], next.value[1]);
    next = it.next();
  }
}
