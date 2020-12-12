import { Vector } from './Vector';
import { Position } from './Position';
import { Direction } from './Direction';

export class MovableObject {
  private directionVector: Vector;
  private position: Position;
  private attachedObject: MovableObject | undefined;

  constructor(
    startingPosition: Position = Position.ORIGIN,
    startingDirection: Direction = Direction.EAST
  ) {
    this.position = startingPosition;
    this.directionVector = Vector.getDirectionVector(startingDirection);
    this.attachedObject = undefined;
  }

  /**
   * Attaches the given object to this one.
   *
   * All movements of this object will get passed to the attached one as well.
   * @param attachedObject Object to attach.
   */
  attachObject(attachedObject: MovableObject): void {
    this.attachedObject = attachedObject;
  }

  /**
   * @returns The direction vector of this object.
   */
  getDirectionVector(): Vector {
    return this.directionVector;
  }

  /**
   * @returns Current position of the object
   */
  getPosition(): Position {
    return this.position;
  }

  /**
   * Moves the object by the given vector.
   *
   * If there is an attached object that object will get moved as well.
   *
   * @param movementVector Direction to move the object in (see above).
   */
  move(movementVector: Vector): void {
    this.position = this.position.translate(movementVector);
    this.attachedObject?.move(movementVector);
  }

  /**
   * Turns the object by the given degrees to the left.
   *
   * @param degrees Degrees to turn.
   */
  turnLeft(degrees: number): void {
    this.directionVector = this.directionVector.turn(degrees);
  }

  /**
   * Turns the object by the given degrees to the right.
   *
   * @param degrees Degrees to turn.
   */
  turnRight(degrees: number): void {
    this.directionVector = this.directionVector.turn(360 - degrees);
  }
}
