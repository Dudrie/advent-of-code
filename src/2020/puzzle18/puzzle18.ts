import { PuzzleSolver } from '../../util/PuzzleSolver';
import { CalcTree, CalcTreeMode } from './tree/CalcTree';

class PuzzleSolver18 extends PuzzleSolver {
  constructor() {
    super(18);
  }

  solve(): void {
    this.solveA();
    this.solveB();
  }

  private solveA(): void {
    const allTrees: CalcTree[] = this.inputReader
      .getPuzzleInputSplitByLines()
      .map((i) => new CalcTree(i, CalcTreeMode.NO_PRECEDENCE));
    const sum: number = allTrees.reduce((sum, tree) => sum + tree.calcResult(), 0);

    this.printSolution(sum, 'A');
  }

  private solveB(): void {}
}

const time = Date.now();
new PuzzleSolver18().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
