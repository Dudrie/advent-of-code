import { Position3D } from './Position3D';

export class Vector3D {
  constructor(readonly xDelta: number, readonly yDelta: number, readonly zDelta: number) {}

  /**
   * Add the this vector and the given one using vector addition.
   * @param vector Vector add to this vector.
   * @returns Sum of the two vectors.
   */
  add(vector: Vector3D): Vector3D {
    return new Vector3D(
      this.xDelta + vector.xDelta,
      this.yDelta + vector.yDelta,
      this.zDelta + vector.zDelta
    );
  }

  /**
   * @param scalar Scalar to multiply the vector with.
   * @returns New vector which is the result of the scalar multiplication of the given scalar and this vector.
   */
  scale(scalar: number): Vector3D {
    return new Vector3D(this.xDelta * scalar, this.yDelta * scalar, this.zDelta * scalar);
  }

  /**
   * @returns Negative variant of this vector.
   */
  negate(): Vector3D {
    return this.scale(-1);
  }

  /**
   * @returns The point reached from the origin by this vector.
   */
  toPosition(): Position3D {
    return new Position3D(this.xDelta, this.yDelta, this.zDelta);
  }

  /**
   * @param position Position to get the vector representation of.
   * @returns Vector from the origin to the given position.
   */
  static fromPosition(position: Position3D): Vector3D {
    return new Vector3D(position.x, position.y, position.z);
  }
}
