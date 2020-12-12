import { PuzzleSolver } from '../../util/PuzzleSolver';
import { InstructionFactory } from './Instruction';
import { MovableObject } from '../../util/geometrie/MovableObject';

class PuzzleSolver12 extends PuzzleSolver {
  constructor() {
    super(12);
  }

  solve(): void {
    this.solveA();
  }

  private solveA() {
    const ferry: MovableObject = new MovableObject();
    const input: string[] = this.inputReader.getPuzzleInputSplitByLines();
    const instructions = input.map((i) => InstructionFactory.generateInstructionPartA(i));
    for (const instruction of instructions) {
      instruction.run(ferry);
    }

    this.printSolution(ferry.getPosition().getManhattanDistance(), 'A');
  }
}

const time = Date.now();
new PuzzleSolver12().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
