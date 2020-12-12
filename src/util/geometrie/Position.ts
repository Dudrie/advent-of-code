import { Vector } from './Vector';

export class Position {
  constructor(readonly row: number, readonly column: number) {}

  /**
   * @param vector Translation vector.
   * @returns Position resembling the addition of this position and the translation vector.
   */
  translate(vector: Vector): Position {
    return new Position(this.row + vector.rowDelta, this.column + vector.columnDelta);
  }

  /**
   * @returns A string representation of this position.
   */
  toString(): string {
    return `(${this.row}, ${this.column})`;
  }

  /**
   * @returns The manhattan distance measured from the origin (0, 0).
   */
  getManhattanDistance(): number {
    return Math.abs(this.row) + Math.abs(this.column);
  }

  /**
   * Compares two positions.
   *
   * A position is considered smaller if it is higher up and/or further left as the other position.
   * @param other Position to compare this to.
   * @returns Negative if this is considered smaller, positive if it is considered greater and zero for equal position.
   */
  compare(other: Position): number {
    if (this.column === other.column) {
      return this.row - other.row;
    }

    return this.column - other.column;
  }

  /**
   * Origin of the Cartesian coordinate system.
   */
  static readonly ORIGIN = new Position(0, 0);
}
