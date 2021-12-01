import { PuzzleSolver } from '../../util/PuzzleSolver';
import { CalcTree, CalcTreeMode } from './tree/CalcTree';

class PuzzleSolver18 extends PuzzleSolver {
  constructor() {
    super(18);
  }

  solve(): void {
    this.solvePart(CalcTreeMode.NO_PRECEDENCE, 'A');
    this.solvePart(CalcTreeMode.ADDITION_FIRST, 'B');
  }

  private solvePart(calcMode: CalcTreeMode, part: 'A' | 'B'): void {
    const allTrees: CalcTree[] = this.inputReader
      .getPuzzleInputSplitByLines()
      .map((i) => new CalcTree(i, calcMode));
    const sum: number = allTrees.reduce((sum, tree) => sum + tree.calcResult(), 0);

    this.printSolution(sum, part);
  }
}

const time = Date.now();
new PuzzleSolver18().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
