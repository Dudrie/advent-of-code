import { Position } from '../../util/geometrie/Position';
import { PositionHull } from '../../util/geometrie/PositionHull';

enum CubeState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

class Cube {
  constructor(readonly state: CubeState, readonly position: Position) {}

  /**
   * @param newState State of the copy of this cube.
   * @returns A copy of this cube but with the given state.
   */
  setState(newState: CubeState): Cube {
    return new Cube(newState, this.position);
  }

  /**
   * @returns True if cube is active.
   */
  isActive(): boolean {
    return this.state === CubeState.ACTIVE;
  }
}

class CubeWorld {
  private readonly cubes: Map<string, Cube>;

  constructor(cubes: Cube[]) {
    this.cubes = new Map();

    cubes.forEach((cube) => this.setCube(cube.position, cube));
  }

  /**
   * @returns Number of cubes currently active in the cube world.
   */
  getActiveCubeCount(): number {
    return this.getAllCubes().filter((c) => c.isActive()).length;
  }

  /**
   * @param position Position of the cube.
   * @param cube Cube to set at that position.
   * @private
   */
  setCube(position: Position, cube: Cube): void {
    if (!cube.position.equals(position)) {
      throw new Error(
        `The given position ${position.toString()} is not the position of the given cube ${cube.position.toString()}`
      );
    }

    if (cube.isActive()) {
      this.cubes.set(this.convertPositionToMapKey(position), cube);
    } else {
      this.cubes.delete(this.convertPositionToMapKey(position));
    }
  }

  /**
   * Returns the cube at the given position.
   *
   * If there was no cube saved at the given position a new **inactive** cube at this position is returned.
   *
   * @param position Position to get the cube at.
   * @returns Cube at that position.
   * @private
   */
  getCube(position: Position): Cube {
    const cube: Cube | undefined = this.cubes.get(this.convertPositionToMapKey(position));

    return cube ?? new Cube(CubeState.INACTIVE, position);
  }

  /**
   * @returns All cubes in this cube world.
   */
  getAllCubes(): Cube[] {
    return [...this.cubes.values()];
  }

  /**
   * @param position Position to convert.
   * @returns Key for the cube map of the given position.
   * @private
   */
  private convertPositionToMapKey(position: Position): string {
    return position.toString();
  }

  /**
   * Generates a cube world with cubes in the z=0 plane from the given input.
   * @param input Input to use for the generation.
   * @param dimension Dimension of the cube world.
   * @returns Generated cube world.
   * @private
   */
  static fromInput(input: string[], dimension: number): CubeWorld {
    const cubes: Cube[] = [];

    for (let y = 0; y < input.length; y++) {
      const line: string = input[y];
      for (let x = 0; x < line.length; x++) {
        const charAtPos: string = line.charAt(x);
        const state: CubeState = charAtPos === '#' ? CubeState.ACTIVE : CubeState.INACTIVE;
        const positionCoordinates: number[] = [x, y];

        for (let idx = positionCoordinates.length; idx < dimension; idx++) {
          positionCoordinates.push(0);
        }

        cubes.push(new Cube(state, new Position(...positionCoordinates)));
      }
    }

    return new CubeWorld(cubes);
  }

  /**
   * Generates a copy of the given cube world.
   *
   * @param cubeWorld Cube world to copy.
   * @returns The copied cube world.
   */
  static fromCubeWorld(cubeWorld: CubeWorld): CubeWorld {
    return new CubeWorld(cubeWorld.getAllCubes());
  }
}

export class Space {
  private cubeWorld: CubeWorld;

  constructor(input: string[], dimension: number) {
    this.cubeWorld = CubeWorld.fromInput(input, dimension);
  }

  /**
   * Runs one tick of the game.
   */
  runTick(): void {
    const newCubeWorld: CubeWorld = CubeWorld.fromCubeWorld(this.cubeWorld);
    const cubes: Cube[] = this.getRelevantCubesForTick();

    for (const cube of cubes) {
      const neighbors: Cube[] = this.getCubesAroundCube(cube);
      const activeNeighbors: number = neighbors.filter((c) => c.isActive()).length;

      if (this.shouldCubeBeActive(cube, activeNeighbors)) {
        newCubeWorld.setCube(cube.position, cube.setState(CubeState.ACTIVE));
      } else {
        newCubeWorld.setCube(cube.position, cube.setState(CubeState.INACTIVE));
      }
    }

    this.cubeWorld = newCubeWorld;
  }

  /**
   * @returns Number of cubes currently active in this space.
   */
  getActiveCubeCount(): number {
    return this.cubeWorld.getActiveCubeCount();
  }

  /**
   * @param cube Cube to check.
   * @param activeNeighbors Active neighbors of the given cube.
   * @returns True if the cube should be active with the given amount of active neighbors.
   * @private
   */
  private shouldCubeBeActive(cube: Cube, activeNeighbors: number): boolean {
    if (cube.isActive()) {
      return activeNeighbors === 2 || activeNeighbors === 3;
    } else {
      return activeNeighbors === 3;
    }
  }

  /**
   * @returns All relevant cubes for the next tick.
   * @private
   */
  private getRelevantCubesForTick(): Cube[] {
    const hull: PositionHull = new PositionHull(
      this.cubeWorld.getAllCubes().map((c) => c.position)
    );
    hull.expandHull(1);
    return hull.getPositionsInsideHull().map((p) => this.cubeWorld.getCube(p));
  }

  /**
   * @param cube Cube to get neighbors.
   * @returns All neighbors of the given cube.
   * @private
   */
  private getCubesAroundCube(cube: Cube): Cube[] {
    return cube.position.getCubeAround().map((p) => this.cubeWorld.getCube(p));
  }
}
