import { Direction } from './Direction';
import { Position } from './Position';

export class Vector {
  constructor(readonly rowDelta: number, readonly columnDelta: number) {}

  /**
   * Add the this vector and the given one using vector addition.
   * @param vector Vector add to this vector.
   * @returns Sum of the two vectors.
   */
  add(vector: Vector): Vector {
    return new Vector(this.rowDelta + vector.rowDelta, this.columnDelta + vector.columnDelta);
  }

  /**
   * @param scalar Scalar to multiply the vector with.
   * @returns New vector which is the result of the scalar multiplication of the given scalar and this vector.
   */
  scale(scalar: number): Vector {
    return new Vector(this.rowDelta * scalar, this.columnDelta * scalar);
  }

  /**
   * @returns Negative variant of this vector.
   */
  negate(): Vector {
    return this.scale(-1);
  }

  /**
   * Calculates a new PositionVector which is turned by the given amount of degrees using a form of multiplication with a 2D rotation matrix.
   *
   * @param degrees Degrees (not radian!) to turn the vector
   * @returns New vector turned by the given amount of degrees (counter clockwise).
   */
  turn(degrees: number): Vector {
    const radian: number = this.convertDegreeToRadian(degrees);
    const newColumnDelta: number =
      this.columnDelta * Math.cos(radian) - this.rowDelta * Math.sin(radian);
    const newRowDelta: number =
      this.columnDelta * Math.sin(radian) + this.rowDelta * Math.cos(radian);

    return new Vector(Math.round(newRowDelta), Math.round(newColumnDelta));
  }

  /**
   * Turns this vector around the given position.
   *
   * @param degrees Degrees to turn.
   * @param position Position to turn around.
   */
  turnAroundPosition(degrees: number, position: Position): Vector {
    const positionVector = Vector.fromPosition(position);
    const translatedVector = this.add(positionVector.negate());
    const turnedVector = translatedVector.turn(degrees);

    return turnedVector.add(positionVector);
  }

  /**
   * @returns The point reached from the origin by this vector.
   */
  toPosition(): Position {
    return new Position(this.rowDelta, this.columnDelta);
  }

  /**
   * @param degrees Value to convert.
   * @returns Radian value if the given degrees.
   * @private
   */
  private convertDegreeToRadian(degrees: number): number {
    return (degrees / 360) * 2 * Math.PI;
  }

  /**
   * @param position Position to get the vector representation of.
   * @returns Vector from the origin to the given position.
   */
  static fromPosition(position: Position): Vector {
    return new Vector(position.row, position.column);
  }

  /**
   * Returns a vector pointing in the given direction.
   *
   * The "length" of the vector is such that - on a square grid - the vector describes a movement of exactly one field.
   *
   * @param direction Direction to get the vector of.
   * @returns A vector pointing in the given direction.
   */
  static getDirectionVector(direction: Direction): Vector {
    switch (direction) {
      case Direction.NORTH:
        return new Vector(-1, 0);
      case Direction.NORTH_EAST:
        return new Vector(-1, 1);
      case Direction.EAST:
        return new Vector(0, 1);
      case Direction.SOUTH_EAST:
        return new Vector(1, 1);
      case Direction.SOUTH:
        return new Vector(1, 0);
      case Direction.SOUTH_WEST:
        return new Vector(1, -1);
      case Direction.WEST:
        return new Vector(0, -1);
      case Direction.NORTH_WEST:
        return new Vector(-1, -1);
      default:
        throw new Error(`Direction (${direction}) is not supported.`);
    }
  }

  static readonly allDirections: readonly Vector[] = [
    Vector.getDirectionVector(Direction.NORTH),
    Vector.getDirectionVector(Direction.NORTH_EAST),
    Vector.getDirectionVector(Direction.EAST),
    Vector.getDirectionVector(Direction.SOUTH_EAST),
    Vector.getDirectionVector(Direction.SOUTH),
    Vector.getDirectionVector(Direction.SOUTH_WEST),
    Vector.getDirectionVector(Direction.WEST),
    Vector.getDirectionVector(Direction.NORTH_WEST),
  ];
}
