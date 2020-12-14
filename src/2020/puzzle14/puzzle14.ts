import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Memory, MemoryPartA, MemoryPartB } from './Memory';
import { Instruction, InstructionFactory } from './Instructions';

class PuzzleSolver14 extends PuzzleSolver {
  private readonly instructions: Instruction[];

  constructor() {
    super(14);

    this.instructions = this.inputReader
      .getPuzzleInputSplitByLines()
      .map((i) => InstructionFactory.generateInstruction(i));
  }

  solve(): void {
    const memoryPartA: Memory = new MemoryPartA();
    const memoryPartB: Memory = new MemoryPartB();

    this.instructions.forEach((instruction) => {
      instruction.run(memoryPartA);
      instruction.run(memoryPartB);
    });

    this.printSolution(memoryPartA.getSumOfValues(), 'A');
    this.printSolution(memoryPartB.getSumOfValues(), 'B');
  }
}

const time = Date.now();
new PuzzleSolver14().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
