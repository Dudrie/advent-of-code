import { readPuzzleInput, getLinesOfInput } from '../util/PuzzleInputReader';

type WireGrid = { [pos: string]: Wire[] };

interface Position {
  x: number;
  y: number;
}

function addPositions(posA: Position, posB: Position): Position {
  return { x: posA.x + posB.x, y: posA.y + posB.y };
}

function getLength({ x, y }: Position): number {
  return Math.abs(x) + Math.abs(y);
}

class Wire {
  private _position: Position;
  private _stepCount: number;
  private stepsToPosition: { [pos: string]: number | undefined };

  public get position(): Position {
    return this._position;
  }

  constructor(readonly identifier: string) {
    this._position = { x: 0, y: 0 };
    this._stepCount = 0;
    this.stepsToPosition = {};
  }

  public moveWire(movement: Position) {
    this._position = addPositions(this.position, movement);
    this._stepCount += getLength(movement);

    if (this.stepsToPosition[this.getPositionAsString()] === undefined) {
      this.stepsToPosition[this.getPositionAsString()] = this._stepCount;
    }
  }

  public getPositionAsString({ x, y }: Position = this.position): string {
    return `${x},${y}`;
  }

  public getDistanceToCenter() {
    return getLength(this.position);
  }

  public getStepsToPosition(pos: Position): number {
    return this.stepsToPosition[this.getPositionAsString(pos)] ?? 0;
  }
}

function calculcateWirePath(
  wire: Wire,
  wirePathInput: string,
  grid: WireGrid
): { shortestDistance: number; smallestStepCount: number } {
  let shortestDistance: number = Number.MAX_SAFE_INTEGER;
  let smallestStepCount: number = Number.MAX_SAFE_INTEGER;

  const instructions = wirePathInput.split(',');

  instructions.forEach(instruction => {
    const direction: string = instruction.substring(0, 1);
    const steps: number = Number.parseInt(instruction.substring(1));

    if (Number.isNaN(steps)) {
      throw new Error(`Given instruction could not be parsed -- instruction: ${instruction}`);
    }

    let movement: Position = { x: 0, y: 0 };

    for (let i = 0; i < steps; i++) {
      switch (direction) {
        case 'U':
          movement = { x: 0, y: 1 };
          break;

        case 'R':
          movement = { x: 1, y: 0 };
          break;

        case 'D':
          movement = { x: 0, y: -1 };
          break;

        case 'L':
          movement = { x: -1, y: 0 };
          break;

        default:
          throw new Error(
            `Direction could not be mapped -- instruction ${instruction}, direction: ${direction}`
          );
      }

      wire.moveWire(movement);

      const positionString = wire.getPositionAsString();
      const wiresAtPosition = grid[positionString] || [];

      if (wiresAtPosition.length > 0 && !wiresAtPosition.includes(wire)) {
        const distance = wire.getDistanceToCenter();
        const sumOfSteps = wiresAtPosition.reduce(
          (sum, otherWire) => sum + otherWire.getStepsToPosition(wire.position),
          wire.getStepsToPosition(wire.position)
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
        }

        if (sumOfSteps < smallestStepCount) {
          smallestStepCount = sumOfSteps;
        }
      }

      if (!wiresAtPosition.includes(wire)) {
        wiresAtPosition.push(wire);
      }

      grid[positionString] = wiresAtPosition;
    }
  });

  return { shortestDistance, smallestStepCount };
}

const input: string[] = getLinesOfInput(readPuzzleInput(3));

const pathFirstWire: string = input[0];
const pathSecondWire: string = input[1];
const grid: WireGrid = {};

const firstWire = new Wire('ONE');
const secondWire = new Wire('TWO');

calculcateWirePath(firstWire, pathFirstWire, grid);
const { shortestDistance, smallestStepCount } = calculcateWirePath(
  secondWire,
  pathSecondWire,
  grid
);

console.log(`A: Shortest distance ${shortestDistance}.`);
console.log(`B: Smallest step count ${smallestStepCount}.`);
