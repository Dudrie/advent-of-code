import { Direction } from './Direction';
import { Position } from './Position';
import { GeometryMode, GeometrySettings } from './GeometrySettings';

export class Vector {
  constructor(readonly xDelta: number, readonly yDelta: number) {}

  /**
   * Add the this vector and the given one using vector addition.
   * @param vector Vector add to this vector.
   * @returns Sum of the two vectors.
   */
  add(vector: Vector): Vector {
    return new Vector(this.xDelta + vector.xDelta, this.yDelta + vector.yDelta);
  }

  /**
   * @param scalar Scalar to multiply the vector with.
   * @returns New vector which is the result of the scalar multiplication of the given scalar and this vector.
   */
  scale(scalar: number): Vector {
    return new Vector(this.xDelta * scalar, this.yDelta * scalar);
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
    const signum = GeometrySettings.getMode() === GeometryMode.MATHEMATICS ? 1 : -1;
    const radian: number = signum * this.convertDegreeToRadian(degrees);
    const newXDelta: number = this.xDelta * Math.cos(radian) - this.yDelta * Math.sin(radian);
    const newYDelta: number = this.xDelta * Math.sin(radian) + this.yDelta * Math.cos(radian);

    return new Vector(Math.round(newXDelta), Math.round(newYDelta));
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
    return new Position(this.xDelta, this.yDelta);
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
    return new Vector(position.x, position.y);
  }

  /**
   * @param from Starting point.
   * @param to End point.
   * @returns Vector from the start to the end point.
   */
  static between(from: Position, to: Position): Vector {
    return new Vector(to.x - from.x, to.y - from.y);
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
        return new Vector(0, -1);
      case Direction.NORTH_EAST:
        return new Vector(1, -1);
      case Direction.EAST:
        return new Vector(1, 0);
      case Direction.SOUTH_EAST:
        return new Vector(1, 1);
      case Direction.SOUTH:
        return new Vector(0, 1);
      case Direction.SOUTH_WEST:
        return new Vector(-1, 1);
      case Direction.WEST:
        return new Vector(-1, 0);
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
