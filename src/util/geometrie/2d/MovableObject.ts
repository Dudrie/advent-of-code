import { Vector } from './Vector';
import { Direction } from './Direction';
import { Position } from './Position';

export class MovableObject {
  private directionVector: Vector;
  private position: Position;
  private attachedTo: MovableObject | undefined;
  private attachedObject: MovableObject | undefined;

  constructor(
    startingPosition: Position = Position.ORIGIN,
    startingDirection: Direction = Direction.EAST
  ) {
    this.position = startingPosition;
    this.directionVector = Vector.getDirectionVector(startingDirection);
    this.attachedObject = undefined;
    this.attachedTo = undefined;
  }

  /**
   * Attaches the given object to this one.
   *
   * All movements of this object will get passed to the attached one as well.
   * @param attachedObject Object to attach.
   */
  attachObject(attachedObject: MovableObject): void {
    this.attachedObject = attachedObject;
    attachedObject.setAttachedTo(this);
  }

  /**
   * @returns Object attached to this one or undefined if there is no object attached.
   */
  getAttachedObject(): MovableObject | undefined {
    return this.attachedObject;
  }

  /**
   * @param attachedTo Object this object is attached to.
   * @private
   */
  private setAttachedTo(attachedTo: MovableObject): void {
    this.attachedTo = attachedTo;
  }

  getAttachedTo(): MovableObject | undefined {
    return this.attachedTo;
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
   * Turns this object counter clockwise around the point where the attached object is.
   *
   * @param degrees Degrees to turn the object (counter clockwise).
   * @throw `Error` - This object is not attached to another object.
   */
  turnLeftAroundAttachedTo(degrees: number): void {
    if (!this.attachedTo) {
      throw new Error(
        'Can not turn this object around the object it is attached to because it is not attached to another object.'
      );
    }

    const prevPosition: Vector = this.position.toVector();
    const newPosition: Vector = prevPosition.turnAroundPosition(
      degrees,
      this.attachedTo.getPosition()
    );

    this.position = newPosition.toPosition();
  }

  /**
   * Turns the object by the given degrees to the right.
   *
   * @param degrees Degrees to turn.
   */
  turnRight(degrees: number): void {
    this.directionVector = this.directionVector.turn(360 - degrees);
  }

  /**
   * Turns this object clockwise around the point where the attached object is.
   *
   * @param degrees Degrees to turn the object (clockwise).
   * @throw `Error` - This object is not attached to another object.
   */
  turnRightAroundAttachedTo(degrees: number): void {
    this.turnLeftAroundAttachedTo(360 - degrees);
  }
}
