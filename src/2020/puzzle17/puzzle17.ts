import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Space } from './Space';

class PuzzleSolver17 extends PuzzleSolver {
  constructor() {
    super(17);
  }

  solve(): void {
    const space: Space = new Space(this.inputReader.getPuzzleInputSplitByLines());

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
