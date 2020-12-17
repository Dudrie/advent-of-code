import { Vector3D } from './Vector3D';

export class Position3D {
  constructor(readonly x: number, readonly y: number, readonly z: number) {}

  /**
   * @param vector Translation vector.
   * @returns Position resembling the addition of this position and the translation vector.
   */
  translate(vector: Vector3D): Position3D {
    return new Position3D(this.x + vector.xDelta, this.y + vector.yDelta, this.z + vector.zDelta);
  }

  /**
   * @returns A string representation of this position.
   */
  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  /**
   * @param other Other position to check.
   * @returns True if the other position is equal considering all coordinates compared with this one.
   */
  equals(other: Position3D): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * @returns The manhattan distance measured from the origin (0, 0, 0).
   */
  getManhattanDistance(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  /**
   * @returns Vector representation of this position.
   */
  toVector(): Vector3D {
    return Vector3D.fromPosition(this);
  }

  /**
   * Calculates all positions in a cube with the given length around this position.
   *
   * The cube will **not** include this position.
   *
   * @param length Positive (!) length of the cube. Defaults to `1`.
   * @returns Positions inside the cube without this position.
   */
  getCubeAround(length: number = 1): Position3D[] {
    const positions: Position3D[] = [];

    for (let x = -length; x <= length; x++) {
      for (let y = -length; y <= length; y++) {
        for (let z = -length; z <= length; z++) {
          if (x !== 0 || y !== 0 || z !== 0) {
            positions.push(new Position3D(this.x + x, this.y + y, this.z + z));
          }
        }
      }
    }

    return positions;
  }

  /**
   * Origin of the Cartesian coordinate system.
   */
  static readonly ORIGIN = new Position3D(0, 0, 0);
}

export class Position3DHull {
  private readonly positions: Position3D[];
  private upperLeftCorner: Position3D;
  private lowerRightCorner: Position3D;

  constructor(positions: Position3D[]) {
    this.positions = positions;
    this.upperLeftCorner = new Position3D(
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    );
    this.lowerRightCorner = new Position3D(
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER
    );
    this.initHull();
  }

  /**
   * Expands this hull in all directions by the given length.
   * @param length Length to increase this hull by.
   */
  expandHull(length: number): void {
    this.upperLeftCorner = new Position3D(
      this.upperLeftCorner.x - length,
      this.upperLeftCorner.y - length,
      this.upperLeftCorner.z - length
    );
    this.lowerRightCorner = new Position3D(
      this.lowerRightCorner.x + length,
      this.lowerRightCorner.y + length,
      this.lowerRightCorner.z + length
    );
  }

  /**
   * @returns All positions inside this hull.
   */
  getPositionsInsideHull(): Position3D[] {
    const positions: Position3D[] = [];
    const { x: minX, y: minY, z: minZ } = this.upperLeftCorner;
    const { x: maxX, y: maxY, z: maxZ } = this.lowerRightCorner;

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          positions.push(new Position3D(x, y, z));
        }
      }
    }

    return positions;
  }

  /**
   * Initializes this hull as the smallest one around the positions.
   * @private
   */
  private initHull(): void {
    let { x: minX, y: minY, z: minZ } = this.upperLeftCorner;
    let { x: maxX, y: maxY, z: maxZ } = this.lowerRightCorner;

    for (const position of this.positions) {
      const { x, y, z } = position;

      if (x < minX) {
        minX = x;
      }

      if (x > maxX) {
        maxX = x;
      }

      if (y < minY) {
        minY = y;
      }

      if (y > maxY) {
        maxY = y;
      }

      if (z < minZ) {
        minZ = z;
      }

      if (z > maxZ) {
        maxZ = z;
      }
    }

    this.upperLeftCorner = new Position3D(minX, minY, minZ);
    this.lowerRightCorner = new Position3D(maxX, maxY, maxZ);
  }
}
