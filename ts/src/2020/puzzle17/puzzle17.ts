import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Space } from './Space';

class PuzzleSolver17 extends PuzzleSolver {
  constructor() {
    super(17);
  }

  solve(): void {
    this.solveForDimension(3, 'A');
    this.solveForDimension(4, 'B');
  }

  private solveForDimension(dimension: number, part: 'A' | 'B'): void {
    const space: Space = new Space(this.inputReader.getPuzzleInputSplitByLines(), dimension);

    console.log(`Running cycle for part ${part}`);
    for (let i = 0; i < 6; i++) {
      space.runTick();
      console.log(`Active cubes after cycle ${i + 1}: ${space.getActiveCubeCount()}`);
    }

    this.printSolution(space.getActiveCubeCount(), 'A');
  }
}

const time = Date.now();
new PuzzleSolver17().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
