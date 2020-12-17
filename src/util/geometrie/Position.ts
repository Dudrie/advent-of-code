import { Vector } from './Vector';
import { DimensionalObject } from './DimensionalObject';

interface PositionsBetweenAndInDirectionParams {
  min: number;
  max: number;
  positions: readonly Position[];
  idx: number;
}

export class Position extends DimensionalObject {
  /**
   * @param vector Translation vector.
   * @returns Position resembling the addition of this position and the translation vector.
   */
  translate(vector: Vector): Position {
    DimensionalObject.assertSameDimension(this, vector);

    return new Position(
      ...this.coordinates.map((coordinate, idx) => coordinate + vector.getCoordinate(idx))
    );
  }

  /**
   * @returns A string representation of this position.
   */
  toString(): string {
    return `(${this.coordinates.join(', ')})`;
  }

  /**
   * @param other Other position to check.
   * @returns True if the other position is equal considering all coordinates compared with this one.
   */
  equals(other: Position): boolean {
    if (other.dim() !== this.dim()) {
      return false;
    }

    for (let i = 0; i < this.coordinates.length; i++) {
      if (this.getCoordinate(i) !== other.getCoordinate(i)) {
        return false;
      }
    }

    return true;
  }

  /**
   * @returns Vector representation of this position.
   */
  toVector(): Vector {
    return Vector.fromPosition(this);
  }

  /**
   * Calculates all positions in a cube with the given length around this position.
   *
   * The cube will **not** include this position.
   *
   * @param length Positive (!) length of the cube. Defaults to `1`.
   * @returns Positions inside the cube without this position.
   */
  getCubeAround(length: number = 1): Position[] {
    let positions: Position[] = [];

    for (let i = this.getCoordinate(0) - length; i <= this.getCoordinate(0) + length; i++) {
      positions.push(this.setCoordinate(0, i));
    }

    for (let idx = 1; idx < this.dim(); idx++) {
      positions = Position.getPositionsBetweenAndInDirection({
        idx,
        min: this.getCoordinate(idx) - length,
        max: this.getCoordinate(idx) + length,
        positions: positions,
      });
    }

    return positions.filter((p) => !p.equals(this));
  }

  /**
   * @param index Index to set the given value.
   * @param value Value to set at the given index.
   * @returns New position with the given value at the given index.
   * @throw `Error` - If the index is not between 0 and the dimension of this position.
   */
  private setCoordinate(index: number, value: number): Position {
    if (index < 0 || index > this.dim()) {
      throw new Error(
        `The given index ${index} must not be smaller than 0 and not be greater than the dimension ${this.dim()}`
      );
    }

    const coordinates: readonly number[] = this.getAllCoordinates();
    return new Position(...coordinates.slice(0, index), value, ...coordinates.slice(index + 1));
  }

  /**
   * Generates a new position with the given dimension. All entries will be set to the given entry.
   *
   * @param entry Value for all entries.
   * @param dimension Dimension of the position.
   */
  static fillPosition(entry: number, dimension: number): Position {
    const coordinates: number[] = [];

    for (let i = 0; i < dimension; i++) {
      coordinates.push(entry);
    }

    return new Position(...coordinates);
  }

  /**
   * @param upperLeft "Upper left" position of the cube.
   * @param lowerRight "Lower right" position of the cube.
   * @returns All positions inside the cube.
   * @throws `Error` - If the given positions have different dimensions.
   */
  static getPositionsBetween(upperLeft: Position, lowerRight: Position): Position[] {
    Position.assertSameDimension(upperLeft, lowerRight);

    let positions: Position[] = [];

    for (let entry = upperLeft.getCoordinate(0); entry <= lowerRight.getCoordinate(0); entry++) {
      positions.push(upperLeft.setCoordinate(0, entry));
    }

    for (let idx = 1; idx < upperLeft.dim(); idx++) {
      positions = Position.getPositionsBetweenAndInDirection({
        idx,
        min: upperLeft.getCoordinate(idx),
        max: lowerRight.getCoordinate(idx),
        positions,
      });
    }

    return positions;
  }

  /**
   * Calculates all positions in one direction for all the given ones.
   *
   * @param min Smallest value in this direction.
   * @param max Highest value in this direction.
   * @param positions Positions to start with.
   * @param idx Index of the coordinate which should be changed.
   * @returns Generated positions.
   * @private
   */
  private static getPositionsBetweenAndInDirection({
    min,
    max,
    positions,
    idx,
  }: PositionsBetweenAndInDirectionParams): Position[] {
    const newPositions: Position[] = [];

    for (const position of positions) {
      for (let i = min; i <= max; i++) {
        newPositions.push(position.setCoordinate(idx, i));
      }
    }

    return newPositions;
  }
}
