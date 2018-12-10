import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the input of the given puzzle.
 *
 * Reads the corresponding input file of the given puzzle by translating the puzzleNumber to a string. If the puzzleNumber does not have 2 digits a leading 0 will be added. The input is returned as a single String.
 *
 * @param puzzleNumber Number of the puzzle of which the input file should be read
 * @returns Puzzle input as String
 */
export function readPuzzleInput(puzzleNumber: number): string {
    let numString: string = puzzleNumber + '';

    if (puzzleNumber < 10 || numString.length < 2) {
        numString = '0' + numString;
    }

    let fileContentBuffer: Buffer = fs.readFileSync(path.join(__dirname, '..', '..', 'input', `puzzle${numString}.txt`));

    return fileContentBuffer.toString();
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
    return input.split(/\r\n|\r|\n/).filter((line) => line !== '');
}

/**
 * Prints the given map to the console.
 * 
 * Prints the content of the given map to the console. Alternating between a line with the key and a line with the corresponding value.
 * 
 * @param map Map to print to console
 */
export function printMap(map: Map<any, any>) {
    let it = map.entries();
    let next = it.next();

    while (!next.done) {
        console.log(next.value[0], next.value[1]);
        next = it.next();
    }
}