import { getLinesOfInput, readPuzzleInput } from '../util/PuzzleInputReader';

enum TileType {
  OPEN = '.',
  TREES = '|',
  LUMBERYARD = '#',
}

class Position {
  constructor(public x: number, public y: number) {}

  getAsString(): string {
    return `${this.x},${this.y}`;
  }
}

type Tile = {
  pos: Position;
  tileType: TileType;
};

type Field = {
  tiles: { [pos: string]: Tile };
  width: number;
  height: number;
};

function buildField(input: string[]) {
  const { OPEN, TREES, LUMBERYARD } = TileType;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const c: string = input[y].charAt(x);
      const tile: Tile = { pos: new Position(x, y), tileType: OPEN };

      switch (c) {
        case LUMBERYARD.toString():
          tile.tileType = LUMBERYARD;
          break;
        case TREES.toString():
          tile.tileType = TREES;
          break;
        case OPEN.toString():
          tile.tileType = OPEN;
          break;
        default:
          console.warn(
            `Given character '${c}' could not be mapped to a TileType. Creating tile with OPEN TileType.`
          );
      }

      addTileToField(tile);
    }
  }
}

function addTileToField(tile: Tile) {
  FIELD.tiles[tile.pos.getAsString()] = tile;

  if (tile.pos.x >= FIELD.width) {
    FIELD.width = tile.pos.x + 1;
  }

  if (tile.pos.y >= FIELD.height) {
    FIELD.height = tile.pos.y + 1;
  }
}

function simulateMinute(): { [pos: string]: Tile } {
  const newTiles: { [pos: string]: Tile } = deepCopy(FIELD.tiles);

  for (let x = 0; x < FIELD.width; x++) {
    for (let y = 0; y < FIELD.height; y++) {
      const tile: Tile = newTiles[new Position(x, y).getAsString()];

      tile.tileType = getNewTileType(tile);
    }
  }

  return newTiles;
}

function getNewTileType(tile: Tile): TileType {
  const { OPEN, LUMBERYARD, TREES } = TileType;
  const tiles: Tile[] = getAdjacentTiles(tile);

  switch (tile.tileType) {
    case OPEN:
      const sumTrees: number = tiles.reduce((sum, t) => (sum += t.tileType === TREES ? 1 : 0), 0);
      if (sumTrees >= 3) {
        return TREES;
      }

      break;
    case TREES:
      const sumLumber: number = tiles.reduce(
        (sum, t) => (sum += t.tileType === LUMBERYARD ? 1 : 0),
        0
      );
      if (sumLumber >= 3) {
        return LUMBERYARD;
      }

      break;
    case LUMBERYARD:
      let hasOneLumber: boolean = false;
      let hasOneTrees: boolean = false;

      for (const tile of tiles) {
        if (tile.tileType === TREES) {
          hasOneTrees = true;
        } else if (tile.tileType === LUMBERYARD) {
          hasOneLumber = true;
        }
      }

      if (hasOneLumber && hasOneTrees) {
        return LUMBERYARD;
      } else {
        return OPEN;
      }
  }

  return tile.tileType;
}

function getAdjacentTiles(tile: Tile): Tile[] {
  const tiles: Tile[] = [];
  const { x, y } = tile.pos;

  // Top row
  if (y - 1 >= 0) {
    if (x - 1 >= 0) {
      tiles.push(getTileAt(x - 1, y - 1));
    }

    tiles.push(getTileAt(x, y - 1));

    if (x + 1 < FIELD.width) {
      tiles.push(getTileAt(x + 1, y - 1));
    }
  }

  // Middle row
  if (x - 1 >= 0) {
    tiles.push(getTileAt(x - 1, y));
  }

  if (x + 1 < FIELD.width) {
    tiles.push(getTileAt(x + 1, y));
  }

  // Bottom row.
  if (y + 1 < FIELD.height) {
    if (x - 1 >= 0) {
      tiles.push(getTileAt(x - 1, y + 1));
    }

    tiles.push(getTileAt(x, y + 1));

    if (x + 1 < FIELD.width) {
      tiles.push(getTileAt(x + 1, y + 1));
    }
  }

  return tiles;
}

function getTileAt(x: number, y: number): Tile {
  return FIELD.tiles[new Position(x, y).getAsString()];
}

function calcResourceValue(): [number, number, number] {
  let countTrees: number = 0;
  let countLumber: number = 0;

  for (const tile of Object.values(FIELD.tiles)) {
    if (tile.tileType === TileType.LUMBERYARD) {
      countLumber++;
    } else if (tile.tileType === TileType.TREES) {
      countTrees++;
    }
  }

  return [countTrees, countLumber, countTrees * countLumber];
}

function isSameTiles(oneTiles: { [pos: string]: Tile }, other: { [pos: string]: Tile }): boolean {
  for (let x = 0; x < FIELD.width; x++) {
    for (let y = 0; y < FIELD.height; y++) {
      const pos = new Position(x, y);

      if (oneTiles[pos.getAsString()].tileType !== other[pos.getAsString()].tileType) {
        return false;
      }
    }
  }

  return true;
}

function deepCopy<T>(obj: T): T {
  if (obj instanceof Position) {
    return new Position(obj.x, obj.y) as any;
  }

  if (typeof obj === 'object' && obj !== {}) {
    const cp: { [key: string]: any } = { ...(obj as { [key: string]: any }) };

    Object.keys(cp).forEach(key => {
      cp[key] = deepCopy(cp[key]);
    });

    return cp as T;
  }

  return obj;
}

function printField(passedMins: number) {
  if (!IS_PRINTING_ENABLED) {
    return;
  }

  const lines: string[] = [];

  for (let x = 0; x < FIELD.width; x++) {
    for (let y = 0; y < FIELD.height; y++) {
      if (lines[y] === undefined) {
        lines[y] = '';
      }

      lines[y] += getTileAt(x, y).tileType.toString();
    }
  }

  console.log(`After ${passedMins} minutes:`);
  for (const line of lines) {
    console.log(line);
  }
  console.log(''); // New line
}

// #region RUNNING SECTION
const input: string[] = getLinesOfInput(readPuzzleInput(18));

const IS_PRINTING_ENABLED: boolean = false;
const FIELD: Field = {
  tiles: {},
  width: 0,
  height: 0,
};

buildField(input);
printField(0);

// For part A: Change to 10 minutes/iterations.
const LAST_IDX: number = 1000000000;
const pastFields: { [pos: string]: Tile }[] = [deepCopy(FIELD.tiles)];

let hasGridRepeat: boolean = false;
for (let i = 1; i <= LAST_IDX; i++) {
  const newTiles = simulateMinute();
  for (let k = 0; !hasGridRepeat && k < pastFields.length; k++) {
    if (isSameTiles(pastFields[k], newTiles)) {
      // console.log('Grid repeat found');
      const restSteps = (LAST_IDX - k) % (i - k);
      i = LAST_IDX - restSteps;
      hasGridRepeat = true;
    }
  }

  pastFields.push(deepCopy(newTiles));

  FIELD.tiles = newTiles;
  printField(i);
}

const [countTrees, countLumber, result] = calcResourceValue();
console.log(`Resource value: ${countTrees} * ${countLumber} = ${result}`);

// #endregion
