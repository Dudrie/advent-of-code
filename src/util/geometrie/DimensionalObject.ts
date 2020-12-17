export abstract class DimensionalObject {
  protected readonly coordinates: readonly number[];

  constructor(...coordinates: readonly number[]) {
    this.coordinates = coordinates;
  }

  /**
   * @returns Dimension of this vector.
   */
  dim(): number {
    return this.coordinates.length;
  }

  /**
   * @param index Index of the coordinate;
   * @returns Value of the coordinate at the given index.
   * @throws `Error` - If there is no coordinate for the given index.
   */
  getCoordinate(index: number): number {
    if (this.coordinates[index] === undefined) {
      throw new Error(`There is no entry at the index: ${index}.`);
    }

    return this.coordinates[index];
  }

  /**
   * @returns All entries of this object.
   */
  getAllCoordinates(): readonly number[] {
    return [...this.coordinates];
  }

  /**
   * @param objA First object.
   * @param objB Second object.
   * @throws `Error` - If the two object have different dimensions.
   * @protected
   */
  protected static assertSameDimension(objA: DimensionalObject, objB: DimensionalObject): void {
    if (objA.dim() !== objB.dim()) {
      throw new Error(`The given dimensional objects must have the same dimension.`);
    }
  }
}
