import * as fs from 'fs';
import * as path from 'path';
import pkg from '../../package.json';

/**
 * Used to load the puzzle inputs from files on the file system.
 */
export class PuzzleInputReader {
  private readonly input: string;

  /**
   * Initializes the reader by loading the input of the given puzzle.
   *
   * Reads the corresponding input file of the given puzzle by translating the puzzleNumber to a string. If the puzzleNumber does not have 2 digits a leading 0 will be added.
   *
   * @param puzzleNumber Number of the puzzle of which the input file should be read
   * @param testNr (default: 0) Determines if and which test input to load which is set by the number. The number has to be higher than 0 and there has to exist a file ending with 'TestXX' where 'XX' is the number.
   * @param loadFromInput Indicates that the input should be loaded using the old approach.
   */
  constructor(
    private readonly puzzleNumber: number,
    private readonly testNr: number = 0,
    private readonly loadFromInput: boolean = false
  ) {
    this.input = this.loadInput();
  }

  /**
   * @returns The loaded puzzle input as one string.
   */
  public getPuzzleInput(): string {
    return this.input;
  }

  /**
   * @returns The loaded puzzle input split by lines with empty lines __removed__ from the list.
   */
  public getPuzzleInputSplitByLines(): string[] {
    return this.getPuzzleInputSplitByLinesWithEmptyLines().filter((line) => line !== '');
  }

  /**
   * Returns the input parsed into blocks.
   *
   * Every block is determined by a new line in the input.
   *
   * @returns Blocks from input.
   */
  public getPuzzleInputGroupedByEmptyLines(): string[][] {
    return this.getPuzzleInputSplitByLinesWithEmptyLines().reduce<string[][]>(
      (grouped, currentLine) => {
        if (currentLine === '') {
          grouped[grouped.length] = [];
        } else {
          grouped[grouped.length - 1].push(currentLine);
        }

        return grouped;
      },
      [[]]
    );
  }

  /**
   * @returns The loaded puzzle input split by lines with empty lines __kept__ in the list.
   */
  private getPuzzleInputSplitByLinesWithEmptyLines(): string[] {
    return this.input.split(/\r\n|\r|\n/);
  }

  private loadInput(): string {
    const numString = this.getNumberAsString();
    const testString: string =
      this.testNr > 0 ? `Test${this.testNr.toString(10).padStart(2, '0')}` : '';

    const fileContentBuffer: Buffer = fs.readFileSync(
      path.join(
        __dirname,
        '..',
        `${pkg.currentYear}`,
        this.loadFromInput ? 'input' : `puzzle${numString}`,
        `puzzle${numString}${testString}.txt`
      )
    );

    return fileContentBuffer.toString();
  }

  private getNumberAsString(): string {
    return this.puzzleNumber.toString(10).padStart(2, '0');
  }
}

/**
 * @deprecated Is kept so old puzzle solutions don't break. Use the `PuzzleInputReader` class instead.
 *
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
  return new PuzzleInputReader(puzzleNumber, testNr, true).getPuzzleInput();
}

/**
 * @deprecated Is kept so old puzzle solutions don't break. Use the `PuzzleInputReader` class instead.
 *
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
export function printMap(map: Map<any, any>): void {
  const it = map.entries();
  let next = it.next();

  while (!next.done) {
    console.log(next.value[0], next.value[1]);
    next = it.next();
  }
}
