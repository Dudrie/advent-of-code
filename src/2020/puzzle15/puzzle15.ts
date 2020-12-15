import { PuzzleSolver } from '../../util/PuzzleSolver';

interface NumberInformation {
  readonly lastTurn: number;
  readonly secondLastTurn: number;
}

class ElvMemoryGame {
  private readonly numbersPerTurn: number[];
  private readonly numberSpokenInformation: Map<number, NumberInformation>;
  private currentTurn: number;

  constructor(input: string) {
    this.numbersPerTurn = input.split(',').map((i) => Number.parseInt(i, 10));
    this.numberSpokenInformation = new Map();
    this.currentTurn = this.numbersPerTurn.length;

    this.initializeNumberSpokenInformation();
  }

  private initializeNumberSpokenInformation(): void {
    for (let i = 0; i < this.numbersPerTurn.length; i++) {
      const currentNumber = this.numbersPerTurn[i];
      this.numberSpokenInformation.set(currentNumber, { lastTurn: i + 1, secondLastTurn: 0 });
    }
  }

  getNumberSpokenAtTurn(turn: number): number {
    while (this.currentTurn < turn) {
      const numberSpoken = this.getNextNumberSpoken();
      const informationThisNumber = this.getInformationForNumber(numberSpoken);

      this.numbersPerTurn.push(numberSpoken);
      this.numberSpokenInformation.set(numberSpoken, {
        lastTurn: this.currentTurn + 1,
        secondLastTurn: informationThisNumber.lastTurn,
      });
      this.currentTurn++;
    }

    return this.numbersPerTurn[turn - 1];
  }

  private getInformationForNumber(numberSpoken: number): NumberInformation {
    const information = this.numberSpokenInformation.get(numberSpoken);

    return information ?? { lastTurn: 0, secondLastTurn: 0 };
  }

  private getNextNumberSpoken(): number {
    const lastNumberSpoken = this.numbersPerTurn[this.currentTurn - 1];
    const { lastTurn, secondLastTurn } = this.getInformationForNumber(lastNumberSpoken);

    return secondLastTurn > 0 ? lastTurn - secondLastTurn : 0;
  }
}

class PuzzleSolver15 extends PuzzleSolver {
  constructor() {
    super(15);
  }

  solve(): void {
    const memoryGame = new ElvMemoryGame(this.inputReader.getPuzzleInput());

    this.printSolution(memoryGame.getNumberSpokenAtTurn(2020), 'A');
    this.printSolution(memoryGame.getNumberSpokenAtTurn(30000000), 'B');
  }
}

const time = Date.now();
new PuzzleSolver15().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
