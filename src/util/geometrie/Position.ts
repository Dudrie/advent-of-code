import { Vector } from './Vector';

export class Position {
  constructor(readonly x: number, readonly y: number) {}

  /**
   * @param vector Translation vector.
   * @returns Position_OLD resembling the addition of this position and the translation vector.
   */
  translate(vector: Vector): Position {
    return new Position(this.x + vector.xDelta, this.y + vector.yDelta);
  }

  /**
   * @returns A string representation of this position.
   */
  toString(): string {
    return `(${this.x}, ${this.y})`;
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
  compare(other: Position): number {
    if (this.x === other.x) {
      return this.y - other.y;
    }

    return this.x - other.x;
  }

  /**
   * @returns Vector representation of this position.
   */
  toVector(): Vector {
    return Vector.fromPosition(this);
  }

  /**
   * Origin of the Cartesian coordinate system.
   */
  static readonly ORIGIN = new Position(0, 0);
}
