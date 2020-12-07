import { PuzzleInputReader } from './PuzzleInputReader';

/**
 * Base class for solving puzzles.
 */
export abstract class PuzzleSolver {
  private readonly puzzleNumber: number;

  private _inputReader: PuzzleInputReader;

  get inputReader(): PuzzleInputReader {
    return this._inputReader;
  }

  constructor(puzzleNumber: number) {
    this._inputReader = new PuzzleInputReader(puzzleNumber);
    this.puzzleNumber = puzzleNumber;
  }

  protected loadPuzzleTestData(testNr: number): void {
    this._inputReader = new PuzzleInputReader(this.puzzleNumber, testNr);
  }

  /**
   * Prints the solution in a unified way to the console.
   *
   * @param solution Solution to print.
   * @param part Part of the puzzle the solution belongs to.
   */
  protected printSolution(solution: number, part: 'A' | 'B'): void {
    console.log(`Solution ${part}: ${solution}`);
  }

  /**
   * Solves the given puzzle.
   */
  abstract solve(): void;
}
