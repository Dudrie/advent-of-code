import { Position } from '../../util/geometrie/Position';

export enum TileType {
  FLOOR,
  EMPTY,
  OCCUPIED,
}

export class Tile {
  constructor(readonly type: TileType, readonly position: Position) {}

  /**
   * @returns True if this tile is considered to be a seat.
   */
  isSeat(): boolean {
    return this.type === TileType.OCCUPIED || this.type === TileType.EMPTY;
  }

  /**
   * @param character Character to get the TileType of.
   * @returns The TileType specified by the given character.
   * @throws `Error` - If the character can not be mapped to a TileType.
   */
  static getTypeFromCharacter(character: string): TileType {
    switch (character) {
      case '.':
        return TileType.FLOOR;
      case '#':
        return TileType.OCCUPIED;
      case 'L':
        return TileType.EMPTY;
      default:
        throw new Error(`Could not map character "${character}" to a TileType.`);
    }
  }
}
