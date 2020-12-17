import { PuzzleSolver } from '../../util/PuzzleSolver';
import { InstructionFactory } from './Instruction';
import { MovableObject } from '../../util/geometrie/2d/MovableObject';
import { GeometryMode, GeometrySettings } from '../../util/geometrie/2d/GeometrySettings';
import { Position } from '../../util/geometrie/2d/Position';

class PuzzleSolver12 extends PuzzleSolver {
  constructor() {
    super(12);
  }

  solve(): void {
    GeometrySettings.setMode(GeometryMode.SCREEN);
    this.solveA();
    this.solveB();
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

  private solveB() {
    const input = this.inputReader.getPuzzleInputSplitByLines();
    const instructions = input.map((i) => InstructionFactory.generateInstructionPartB(i));
    const ferry: MovableObject = new MovableObject();
    const waypoint: MovableObject = new MovableObject(new Position(10, -1));
    ferry.attachObject(waypoint);

    for (const instruction of instructions) {
      instruction.run(waypoint);
    }

    this.printSolution(ferry.getPosition().getManhattanDistance(), 'B');
  }
}

const time = Date.now();
new PuzzleSolver12().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
