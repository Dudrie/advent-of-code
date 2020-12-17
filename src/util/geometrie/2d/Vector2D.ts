import { Direction } from './Direction';
import { Position2D } from './Position2D';
import { GeometryMode, GeometrySettings } from './GeometrySettings';
import { Vector } from '../Vector';

export class Vector2D extends Vector {
  get xDelta(): number {
    return this.getCoordinate(0);
  }

  get yDelta(): number {
    return this.getCoordinate(1);
  }

  constructor(xDelta: number, yDelta: number) {
    super(xDelta, yDelta);
  }

  /**
   * Add the this vector and the given one using vector addition.
   * @param vector Vector add to this vector.
   * @returns Sum of the two vectors.
   */
  add(vector: Vector2D): Vector2D {
    const result = super.add(vector);
    return new Vector2D(result.getCoordinate(0), result.getCoordinate(1));
  }

  /**
   * @param scalar Scalar to multiply the vector with.
   * @returns New vector which is the result of the scalar multiplication of the given scalar and this vector.
   */
  scale(scalar: number): Vector2D {
    const result = super.scale(scalar);
    return new Vector2D(result.getCoordinate(0), result.getCoordinate(1));
  }

  /**
   * @returns Negative variant of this vector.
   */
  negate(): Vector2D {
    return this.scale(-1);
  }

  /**
   * Calculates a new PositionVector which is turned by the given amount of degrees using a form of multiplication with a 2D rotation matrix.
   *
   * @param degrees Degrees (not radian!) to turn the vector
   * @returns New vector turned by the given amount of degrees (counter clockwise).
   */
  turn(degrees: number): Vector2D {
    const signum = GeometrySettings.getMode() === GeometryMode.MATHEMATICS ? 1 : -1;
    const radian: number = signum * this.convertDegreeToRadian(degrees);
    const newXDelta: number = this.xDelta * Math.cos(radian) - this.yDelta * Math.sin(radian);
    const newYDelta: number = this.xDelta * Math.sin(radian) + this.yDelta * Math.cos(radian);

    return new Vector2D(Math.round(newXDelta), Math.round(newYDelta));
  }

  /**
   * Turns this vector around the given position.
   *
   * @param degrees Degrees to turn.
   * @param position Position to turn around.
   */
  turnAroundPosition(degrees: number, position: Position2D): Vector2D {
    const positionVector = Vector2D.fromPosition(position);
    const translatedVector = this.add(positionVector.negate());
    const turnedVector = translatedVector.turn(degrees);

    return turnedVector.add(positionVector);
  }

  /**
   * @returns The point reached from the origin by this vector.
   */
  toPosition(): Position2D {
    return new Position2D(this.xDelta, this.yDelta);
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
   * @returns Vector2D from the origin to the given position.
   */
  static fromPosition(position: Position2D): Vector2D {
    return new Vector2D(position.x, position.y);
  }

  /**
   * @param from Starting point.
   * @param to End point.
   * @returns Vector2D from the start to the end point.
   */
  static between(from: Position2D, to: Position2D): Vector2D {
    return new Vector2D(to.x - from.x, to.y - from.y);
  }

  /**
   * Returns a vector pointing in the given direction.
   *
   * The "length" of the vector is such that - on a square grid - the vector describes a movement of exactly one field.
   *
   * @param direction Direction to get the vector of.
   * @returns A vector pointing in the given direction.
   */
  static getDirectionVector(direction: Direction): Vector2D {
    switch (direction) {
      case Direction.NORTH:
        return new Vector2D(0, -1);
      case Direction.NORTH_EAST:
        return new Vector2D(1, -1);
      case Direction.EAST:
        return new Vector2D(1, 0);
      case Direction.SOUTH_EAST:
        return new Vector2D(1, 1);
      case Direction.SOUTH:
        return new Vector2D(0, 1);
      case Direction.SOUTH_WEST:
        return new Vector2D(-1, 1);
      case Direction.WEST:
        return new Vector2D(-1, 0);
      case Direction.NORTH_WEST:
        return new Vector2D(-1, -1);
      default:
        throw new Error(`Direction (${direction}) is not supported.`);
    }
  }

  static readonly allDirections: readonly Vector2D[] = [
    Vector2D.getDirectionVector(Direction.NORTH),
    Vector2D.getDirectionVector(Direction.NORTH_EAST),
    Vector2D.getDirectionVector(Direction.EAST),
    Vector2D.getDirectionVector(Direction.SOUTH_EAST),
    Vector2D.getDirectionVector(Direction.SOUTH),
    Vector2D.getDirectionVector(Direction.SOUTH_WEST),
    Vector2D.getDirectionVector(Direction.WEST),
    Vector2D.getDirectionVector(Direction.NORTH_WEST),
  ];
}
