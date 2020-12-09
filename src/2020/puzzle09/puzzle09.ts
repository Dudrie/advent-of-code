import { PuzzleSolver } from '../../util/PuzzleSolver';

class PuzzleSolver09 extends PuzzleSolver {
  private readonly preambleLength: number;
  private readonly listOfNumbers: number[];

  constructor() {
    super(9);

    this.preambleLength = 25;
    this.listOfNumbers = this.inputReader
      .getPuzzleInputSplitByLines()
      .map((i) => Number.parseInt(i, 10));
  }

  solve(): void {
    let firstNumberWithoutSum: number = -1;

    for (let pos = this.preambleLength; pos < this.listOfNumbers.length; pos++) {
      if (!this.hasPairToSumIt(pos)) {
        firstNumberWithoutSum = this.listOfNumbers[pos];
        break;
      }
    }

    if (firstNumberWithoutSum === -1) {
      throw new Error('Could not find such number');
    }

    const setOfNumbers: number[] = this.getNumbersThatSumToThis(firstNumberWithoutSum);

    this.printSolution(firstNumberWithoutSum, 'A');
    this.printSolution(setOfNumbers[0] + setOfNumbers[setOfNumbers.length - 1], 'B');
  }

  /**
   * @param goalNumber Number to search the sum of.
   * @returns **Sorted** (asc) list of numbers that sum up to the given number
   */
  private getNumbersThatSumToThis(goalNumber: number): number[] {
    let numbers: number[] = [];

    for (let i = 0; i < this.listOfNumbers.length - 1; i++) {
      const startingNumber = this.listOfNumbers[i];
      let sum: number = startingNumber;
      numbers = [startingNumber];

      for (let k = i + 1; k < this.listOfNumbers.length; k++) {
        const secondNumber = this.listOfNumbers[k];
        sum += secondNumber;
        numbers.push(secondNumber);

        if (sum === goalNumber) {
          return numbers.sort();
        } else if (sum > goalNumber) {
          // If the sum is greater than what we search we can abort the inner loop.
          break;
        }
      }
    }

    return [];
  }

  /**
   * @param currentPosition Current position to check
   * @returns True if there are 2 numbers within the correct range that sum to the number at the `currentPosition`
   */
  private hasPairToSumIt(currentPosition: number): boolean {
    const currentNumber = this.listOfNumbers[currentPosition];
    const lowerBoundry = currentPosition - this.preambleLength;
    const upperBoundry = currentPosition;

    for (let i = lowerBoundry; i < upperBoundry - 1; i++) {
      const firstNumber = this.listOfNumbers[i];

      for (let k = i + 1; k < upperBoundry; k++) {
        const secondNumber = this.listOfNumbers[k];

        if (firstNumber + secondNumber === currentNumber) {
          return true;
        }
      }
    }

    return false;
  }
}

new PuzzleSolver09().solve();
