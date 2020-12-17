import { Vector2D } from './Vector2D';
import { Position } from '../Position';

export class Position2D extends Position {
  get x(): number {
    return this.getCoordinate(0);
  }

  get y(): number {
    return this.getCoordinate(1);
  }

  /**
   * @param vector Translation vector.
   * @returns Position_OLD resembling the addition of this position and the translation vector.
   */
  translate(vector: Vector2D): Position2D {
    return new Position2D(this.x + vector.xDelta, this.y + vector.yDelta);
  }

  /**
   * @returns The manhattan distance measured from the origin (0, 0).
   */
  getManhattanDistance(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  /**
   * Compares two positions.
   *
   * A position is considered smaller if it is higher up and/or further left as the other position.
   * @param other Position to compare this to.
   * @returns Negative if this is considered smaller, positive if it is considered greater and zero for equal position.
   */
  compare(other: Position2D): number {
    if (this.x === other.x) {
      return this.y - other.y;
    }

    return this.x - other.x;
  }

  /**
   * @returns Vector2D representation of this position.
   */
  toVector(): Vector2D {
    const result = super.toVector();
    return new Vector2D(result.getCoordinate(0), result.getCoordinate(1));
  }

  /**
   * Origin of the Cartesian coordinate system.
   */
  static readonly ORIGIN = new Position2D(0, 0);
}
