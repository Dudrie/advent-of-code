import { MovableObject } from '../../util/geometrie/MovableObject';
import { Direction } from '../../util/geometrie/Direction';
import { Vector } from '../../util/geometrie/Vector';

export abstract class Instruction {
  protected constructor(protected readonly action: string, protected readonly value: number) {}

  /**
   * Run the command on the given object.
   * @param object Ferry to run this command on.
   */
  abstract run(object: MovableObject): void;
}

class MovementInstruction extends Instruction {
  constructor(action: string, value: number) {
    super(action, value);
  }

  run(object: MovableObject) {
    const direction = this.getDirectionFromAction();
    let movementVector: Vector;

    if (direction !== undefined) {
      movementVector = Vector.getDirectionVector(direction).scale(this.value);
    } else {
      movementVector = object.getDirectionVector().scale(this.value);
    }

    object.move(movementVector);
  }

  /**
   * @returns The direction associated with the action of this instruction. `undefined` if the ferry should move straight.
   * @private
   */
  private getDirectionFromAction(): Direction | undefined {
    switch (this.action) {
      case 'N':
        return Direction.NORTH;
      case 'S':
        return Direction.SOUTH;
      case 'E':
        return Direction.EAST;
      case 'W':
        return Direction.WEST;
      case 'F':
        return undefined;
      default:
        throw new Error(`Action "${this.action}" is not a valid movement action.`);
    }
  }
}

class TurnInstruction extends Instruction {
  constructor(action: string, value: number) {
    super(action, value);

    if (this.action !== 'L' && this.action !== 'R') {
      throw new Error(`Action "${this.action} is not a valid turn action.`);
    }
  }

  run(object: MovableObject) {
    // Important: The geometry classes assume a default screen coordinate system (ie y-axios DOWN). However, this exercise points the y-axis UP, so turning left and right are interchanged...
    if (this.shouldTurnLeft()) {
      object.turnRight(this.value);
    } else {
      object.turnLeft(this.value);
    }
  }

  /**
   * @returns True if the ferry should be turned left.
   * @private
   */
  private shouldTurnLeft(): boolean {
    return this.action === 'L';
  }
}

export abstract class InstructionFactory {
  /**
   * Generates an instruction from the given information.
   *
   * @param instructionLine Information about the instruction.
   * @throws `Error` - If no instruction could be generated from the information.
   */
  static generateInstructionPartA(instructionLine: string): Instruction {
    const [action, value] = InstructionFactory.getActionAndValue(instructionLine);

    switch (action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
      case 'F':
        return new MovementInstruction(action, value);

      case 'L':
      case 'R':
        return new TurnInstruction(action, value);

      default:
        throw new Error(`Action "${action}" is not supported.`);
    }
  }

  /**
   * @param instructionLine Instruction line to parse.
   * @returns Action and value indicated by the given line.
   * @private
   */
  private static getActionAndValue(instructionLine: string): [string, number] {
    const action: string = instructionLine.charAt(0);
    const value: number = Number.parseInt(instructionLine.substring(1), 10);
    return [action, value];
  }
}
