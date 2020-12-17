import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Space } from './Space';

class PuzzleSolver17 extends PuzzleSolver {
  constructor() {
    super(17);
  }

  solve(): void {
    this.solveA();
    this.solveB();
  }

  private solveA(): void {
    const space: Space = new Space(this.inputReader.getPuzzleInputSplitByLines(), 3);

    console.log('Running cycle for part A');
    this.runCycleForSpace(space);

    this.printSolution(space.getActiveCubeCount(), 'A');
  }

  private solveB(): void {
    const space: Space = new Space(this.inputReader.getPuzzleInputSplitByLines(), 4);

    console.log('Running cycle for part B');
    this.runCycleForSpace(space);

    this.printSolution(space.getActiveCubeCount(), 'B');
  }

  private runCycleForSpace(space: Space): void {
    for (let i = 0; i < 6; i++) {
      space.runTick();
      console.log(`Active cubes after cycle ${i + 1}: ${space.getActiveCubeCount()}`);
    }
  }
}

const time = Date.now();
new PuzzleSolver17().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
