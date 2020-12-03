import { PuzzleInputReader } from './PuzzleInputReader';

/**
 * Base class for solving puzzles.
 */
export abstract class PuzzleSolver {
  protected readonly inputReader: PuzzleInputReader;

  constructor(puzzleNumber: number, testNr: number = 0) {
    this.inputReader = new PuzzleInputReader(puzzleNumber, testNr);
  }

  /**
   * Solves the given puzzle.
   */
  abstract solve(): void;

  protected printSolution(solution: number, part: 'A' | 'B'): void {
    console.log(`Solution ${part}: ${solution}`);
  }
}
