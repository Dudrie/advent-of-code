import { DimensionalObject } from './DimensionalObject';
import { Position } from './Position';

export class Vector extends DimensionalObject {
  /**
   * Add the this vector and the given one using vector addition.
   * @param vector Vector add to this vector.
   * @returns Sum of the two vectors.
   * @throw `Error` - If the two vectors have different dimensions.
   */
  add(vector: Vector): Vector {
    DimensionalObject.assertSameDimension(this, vector);

    return new Vector(...this.coordinates.map((val, idx) => val + vector.getCoordinate(idx)));
  }

  /**
   * @param scalar Scalar to multiply the vector with.
   * @returns New vector which is the result of the scalar multiplication of the given scalar and this vector.
   */
  scale(scalar: number): Vector {
    return new Vector(...this.coordinates.map((val) => val * scalar));
  }

  /**
   * @returns Negative variant of this vector.
   */
  negate(): Vector {
    return this.scale(-1);
  }

  /**
   * @param position Position to convert to a vector.
   * @returns Vector from the origin to the given position.
   */
  static fromPosition(position: Position): Vector {
    return new Vector(...position.getAllCoordinates());
  }
}
