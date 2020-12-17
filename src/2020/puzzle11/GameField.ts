import { Tile, TileType } from './Tile';
import { Vector2D } from '../../util/geometrie/2d/Vector2D';
import { Position2D } from '../../util/geometrie/2d/Position2D';

export enum GenerationMethod {
  GAME_OF_LIFE,
  VISIBILITY,
}

export class Size {
  constructor(readonly columnCount: number, readonly rowCount: number) {}
}

export class GameField {
  private readonly tiles: Map<string, Tile>;
  private readonly generationMethod: GenerationMethod;
  private readonly size: Size;
  readonly didChangeFromLast: boolean;

  constructor(
    tiles: readonly Tile[],
    generationMethod: GenerationMethod,
    didChangeFromLast: boolean = true
  ) {
    this.tiles = new Map();
    this.generationMethod = generationMethod;
    this.didChangeFromLast = didChangeFromLast;

    let maxPosition: Position2D = new Position2D(-1, -1);

    tiles.forEach((tile) => {
      if (tile.position.compare(maxPosition) > 0) {
        maxPosition = tile.position;
      }
      this.tiles.set(tile.position.toString(), tile);
    });

    this.size = new Size(maxPosition.x + 1, maxPosition.y + 1);
  }

  /**
   * Generates the next GameField according to the puzzle rules (aka Game of Life rules).
   * @returns New GameField.
   */
  getNextGameField(): GameField {
    const newTiles: Tile[] = [];
    let didChange: boolean = false;

    for (const tile of this.tiles.values()) {
      const relevantSeats: Tile[] = this.getRelevantSeats(tile);
      const occupiedAdjacentCount: number = relevantSeats.reduce(
        (count, tile) => (tile.type === TileType.OCCUPIED ? count + 1 : count),
        0
      );
      const maxOccupiedCountBeforeLeaving = this.getMaxOccupiedCountBeforeLeaving();

      if (tile.type === TileType.EMPTY && occupiedAdjacentCount === 0) {
        newTiles.push(new Tile(TileType.OCCUPIED, tile.position));
        didChange = true;
      } else if (
        tile.type === TileType.OCCUPIED &&
        occupiedAdjacentCount >= maxOccupiedCountBeforeLeaving
      ) {
        newTiles.push(new Tile(TileType.EMPTY, tile.position));
        didChange = true;
      } else {
        newTiles.push(tile);
      }
    }

    return new GameField(newTiles, this.generationMethod, didChange);
  }

  /**
   * @param position Position of the tile.
   * @returns The tile at the position. If there is no tile `undefined` is returned.
   */
  getTileAt(position: Position2D): Tile | undefined {
    return this.tiles.get(position.toString());
  }

  /**
   * @returns The total count of seats occupied on this game field.
   */
  getOccupiedSeatCount(): number {
    const tiles = [...this.tiles.values()];
    return tiles.reduce((count, tile) => (tile.type === TileType.OCCUPIED ? count + 1 : count), 0);
  }

  /**
   * @returns The maximum amount of occupied seats before the person leaves.
   * @private
   */
  private getMaxOccupiedCountBeforeLeaving(): number {
    switch (this.generationMethod) {
      case GenerationMethod.GAME_OF_LIFE:
        return 4;
      case GenerationMethod.VISIBILITY:
        return 5;
      default:
        throw new Error(`Generation method ${this.generationMethod} is not supported.`);
    }
  }

  /**
   * @returns True if the position is within the boundaries of this game field.
   */
  private isPositionInField(position: Position2D): boolean {
    const { x, y } = position;
    const { rowCount, columnCount } = this.size;

    return x >= 0 && x < columnCount && y >= 0 && y < rowCount;
  }

  /**
   * Searches and returns the relevant seats for the given tiles.
   *
   * The "relevant seat" definition is dependant on the generation mode.
   *
   * @param tile Tile to get relevant seats of.
   * @returns All tiles with seats that given tile would take into consideration.
   * @private
   */
  private getRelevantSeats(tile: Tile): Tile[] {
    switch (this.generationMethod) {
      case GenerationMethod.GAME_OF_LIFE:
        return this.getAdjacentSeats(tile);
      case GenerationMethod.VISIBILITY:
        return this.getAllVisibleSeats(tile);
      default:
        throw new Error(`Generation method ${this.generationMethod} is not supported.`);
    }
  }

  /**
   * @param tile Tile to get the adjacent tiles of.
   * @returns Adjacent tiles of the given tile.
   * @private
   */
  private getAdjacentSeats(tile: Tile): Tile[] {
    const { x, y } = tile.position;
    const adjacent: Tile[] = [];

    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
      for (let columnDelta = -1; columnDelta <= 1; columnDelta++) {
        if (rowDelta != 0 || columnDelta != 0) {
          const tile: Tile | undefined = this.getTileAt(
            new Position2D(x + rowDelta, y + columnDelta)
          );

          if (tile) {
            adjacent.push(tile);
          }
        }
      }
    }

    return adjacent;
  }

  /**
   * Searches and returns the first visible seat in each direction (if there is one).
   *
   * The resulting list will not contain any non-seats tiles (like floors);
   *
   * @param tile Tile to get visible seats of.
   * @returns All visible seats of the given tile.
   * @private
   */
  private getAllVisibleSeats(tile: Tile): Tile[] {
    const relevantTiles: Tile[] = [];

    for (const direction of Vector2D.allDirections) {
      const firstVisibleSeat = this.getFirstVisibleSeatInDirection(tile.position, direction);
      if (firstVisibleSeat) {
        relevantTiles.push(firstVisibleSeat);
      }
    }

    return relevantTiles;
  }

  /**
   * @param start Starting position.
   * @param direction Direction to look for tiles.
   * @returns The first seat visible from the start position in the given direction.
   * @private
   */
  private getFirstVisibleSeatInDirection(start: Position2D, direction: Vector2D): Tile | undefined {
    let currentPosition = start.translate(direction);

    while (this.isPositionInField(currentPosition)) {
      const tile: Tile | undefined = this.getTileAt(currentPosition);

      if (tile?.isSeat()) {
        return tile;
      }

      currentPosition = currentPosition.translate(direction);
    }
    return undefined;
  }
}
