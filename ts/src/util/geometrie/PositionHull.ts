import { Position } from './Position';

export class PositionHull {
  private readonly positions: Position[];
  private readonly dimension: number;
  private upperLeftCorner: Position;
  private lowerRightCorner: Position;

  constructor(positions: Position[]) {
    if (positions.length === 0) {
      throw new Error('The hull must have at least one position in it.');
    }

    this.positions = positions;
    this.dimension = this.getDimension();
    this.upperLeftCorner = Position.fillPosition(Number.MAX_SAFE_INTEGER, this.dimension);
    this.lowerRightCorner = Position.fillPosition(Number.MIN_SAFE_INTEGER, this.dimension);
    this.initHull();
  }

  /**
   * Expands this hull in all directions by the given length.
   * @param length Length to increase this hull by.
   */
  expandHull(length: number): void {
    this.upperLeftCorner = new Position(
      ...this.upperLeftCorner.getAllCoordinates().map((c) => c - length)
    );
    this.lowerRightCorner = new Position(
      ...this.lowerRightCorner.getAllCoordinates().map((c) => c + length)
    );
  }

  /**
   * @returns All positions inside this hull.
   */
  getPositionsInsideHull(): Position[] {
    return Position.getPositionsBetween(this.upperLeftCorner, this.lowerRightCorner);
  }

  /**
   * Initializes this hull as the smallest one around the positions.
   * @private
   */
  private initHull(): void {
    const min: number[] = new Array(this.dimension).fill(Number.MAX_SAFE_INTEGER);
    const max: number[] = new Array(this.dimension).fill(Number.MIN_SAFE_INTEGER);

    for (const position of this.positions) {
      for (let idx = 0; idx < this.dimension; idx++) {
        if (position.getCoordinate(idx) < min[idx]) {
          min[idx] = position.getCoordinate(idx);
        }

        if (position.getCoordinate(idx) > max[idx]) {
          max[idx] = position.getCoordinate(idx);
        }
      }
    }

    this.upperLeftCorner = new Position(...min);
    this.lowerRightCorner = new Position(...max);
  }

  /**
   * @returns Dimension of the positions in this hull.
   * @throw `Error` - If any of the given positions has a different dimension than the others.
   * @private
   */
  private getDimension(): number {
    const dimension: number = this.positions[0].dim();

    for (let i = 1; i < this.positions.length; i++) {
      if (this.positions[i].dim() !== dimension) {
        throw new Error('All positions in the hull must have the same dimension.');
      }
    }

    return dimension;
  }
}
