import { getLinesOfInput, readPuzzleInput } from '../util/utils';

enum TileType {
  SAND = '.',
  CLAY = '#',
  WATER_FLOWING = '|',
  WATER_STILL = '~',
  SOURCE = '+',
}

type Position = { x: number; y: number };
type Tile = { x: number; y: number; tileType: TileType };
type Field = {
  tiles: { [id: string]: Tile };
  startHeight: number;
  endHeight: number;
  startWidth: number;
  endWidth: number;
};

function parseInputLine(line: string) {
  const coordData: string[] = line.split(',').map(c => c.trim());
  const coords = { startX: 0, endX: 0, startY: 0, endY: 0 };

  for (const data of coordData) {
    const id: string = data.split('=')[0];
    const nums: number[] = data
      .split('=')[1]
      .split('..')
      .map(v => Number.parseInt(v));

    if (id === 'x') {
      coords.startX = nums[0];
      coords.endX = nums[1] && nums[1] !== Number.NaN ? nums[1] : nums[0];
    } else if (id === 'y') {
      coords.startY = nums[0];
      coords.endY = nums[1] && nums[1] !== Number.NaN ? nums[1] : nums[0];
    }
  }

  // For every field specified in that line create a new clay tile.
  for (let x = coords.startX; x <= coords.endX; x++) {
    for (let y = coords.startY; y <= coords.endY; y++) {
      addTileToField({ x, y, tileType: TileType.CLAY });
    }
  }
}

function addTileToField(tile: Tile) {
  const { x, y } = tile;
  FIELD.tiles[convertCoordsToString(x, y)] = tile;

  // Check, if the height & width boundaries changed
  if (x < FIELD.startWidth) {
    FIELD.startWidth = x;
  } else if (x > FIELD.endWidth) {
    FIELD.endWidth = x;
  }

  if (tile.tileType === TileType.CLAY) {
    // Only clay changes the field height and width.
    if (y < FIELD.startHeight) {
      FIELD.startHeight = y;
    } else if (y > FIELD.endHeight) {
      FIELD.endHeight = y;
    }
  }
}

function getTileAt(x: number, y: number): Tile {
  let tile: Tile | undefined = FIELD.tiles[convertCoordsToString(x, y)];

  if (!tile) {
    // New tile discovered, so add it to the field.
    tile = { x, y, tileType: TileType.SAND };
    FIELD.tiles[convertCoordsToString(x, y)] = tile;

    return tile;
  }

  return tile;
}

function convertCoordsToString(x: number, y: number): string {
  return `${x},${y}`;
}

function printGameField() {
  if (!IS_PRINTING_ENABLED) {
    return;
  }

  const lines: string[] = [];

  for (let x = FIELD.startWidth; x <= FIELD.endWidth; x++) {
    for (let y = 0; y <= FIELD.endHeight; y++) {
      if (lines[y] === undefined) {
        lines[y] = '';
      }

      lines[y] += getTileAt(x, y).tileType;
    }
  }

  for (const line of lines) {
    console.log(line);
  }

  console.log('\n');
}

function isTileAtNotWaterable(x: number, y: number): boolean {
  const tile = getTileAt(x, y);

  return tile.tileType === TileType.CLAY || tile.tileType === TileType.WATER_STILL;
}

function simulateWater(curPos: Position) {
  const { x, y } = curPos;
  const { SAND, WATER_FLOWING } = TileType;

  if (!isInBoundingBox({ x, y })) {
    return;
  }

  // First, check if we can go down, if so, do it as long as possible and mark the fields.
  let curY: number = y;
  while (getTileAt(x, curY + 1).tileType === SAND && isInBoundingBox({ x, y: curY })) {
    getTileAt(x, curY + 1).tileType = WATER_FLOWING;
    curY++;
  }

  // We have reached the final row, so we're done.
  if (curY > FIELD.endHeight) {
    return;
  }

  // Then, check if we can flow to the left and right and start filling in water right there
  let curX: number = x;
  while (isTileAtNotWaterable(curX, curY + 1) && getTileAt(curX - 1, curY).tileType === SAND) {
    getTileAt(curX - 1, curY).tileType = WATER_FLOWING;
    curX--;
  }

  // If we can drop down, start simualting again
  if (isInBoundingBox({ x: curX, y: curY + 1 }) && getTileAt(curX, curY + 1).tileType === SAND) {
    simulateWater({ x: curX, y: curY });
  }

  curX = x;
  while (isTileAtNotWaterable(curX, curY + 1) && getTileAt(curX + 1, curY).tileType === SAND) {
    getTileAt(curX + 1, curY).tileType = TileType.WATER_FLOWING;
    curX++;
  }

  // If we can drop down, start simualting again
  if (isInBoundingBox({ x: curX, y: curY + 1 }) && getTileAt(curX, curY + 1).tileType === SAND) {
    simulateWater({ x: curX, y: curY });
  }

  // If we reach a destination where we have clay/still water on two sides (bottom & left/right) fill the whole level with water
  if (isInBoundingBox({ x: curX, y: curY }) && isCorner({ x: curX, y: curY })) {
    const posLeft: Position | undefined = getSideWall({ x: curX, y: curY }, -1);
    const posRight: Position | undefined = getSideWall({ x: curX, y: curY }, 1);

    if (posLeft && posRight) {
      for (let xToWater = posLeft.x + 1; xToWater < posRight.x; xToWater++) {
        getTileAt(xToWater, curY).tileType = TileType.WATER_STILL;
      }
    }
  }

  // After we have filled that level, go one step up and simulate again from there
  while (curY > y) {
    simulateWater({ x, y: --curY });
  }
}

function isCorner({ x, y }: Position): boolean {
  return (
    isTileAtNotWaterable(x, y + 1) &&
    (isTileAtNotWaterable(x - 1, y) || isTileAtNotWaterable(x + 1, y))
  );
}

function getSideWall({ x, y }: Position, inc: number): Position | undefined {
  let curX: number = x;
  let tile: Tile = getTileAt(curX, y);

  while (
    tile.tileType !== TileType.CLAY &&
    isTileAtNotWaterable(curX, y + 1) &&
    isInBoundingBox({ x: curX, y })
  ) {
    curX += inc;
    tile = getTileAt(curX, y);
  }

  if (!isInBoundingBox({ x: curX, y }) || !isTileAtNotWaterable(tile.x, tile.y + 1)) {
    return undefined;
  }

  return { x: curX, y };
}

function isInBoundingBox({ x, y }: Position): boolean {
  return x >= FIELD.startWidth && x <= FIELD.endWidth && y >= 0 && y <= FIELD.endHeight;
}

// #region RUNNING SECTION
const input: string[] = getLinesOfInput(readPuzzleInput(17));

const IS_PRINTING_ENABLED: boolean = true;
const FIELD: Field = {
  tiles: {},
  startHeight: Number.MAX_SAFE_INTEGER,
  endHeight: Number.MIN_SAFE_INTEGER,
  startWidth: Number.MAX_SAFE_INTEGER,
  endWidth: Number.MIN_SAFE_INTEGER,
};

// Add clay as mentioned in the input
for (const line of input) {
  parseInputLine(line);
}

addTileToField({ x: 500, y: 0, tileType: TileType.SOURCE });

// Increase the bounding box by one to the left & right, so water can fall down there aswell
FIELD.startWidth -= 2;
FIELD.endWidth += 2;

console.log(FIELD);

simulateWater({ x: 500, y: 0 });

// Count all the wet fields
let wetCount: number = 0;
let stillWaterCount: number = 0;

for (let x = FIELD.startWidth; x <= FIELD.endWidth; x++) {
  for (let y = FIELD.startHeight; y <= FIELD.endHeight; y++) {
    const { tileType } = getTileAt(x, y);

    if (tileType === TileType.WATER_FLOWING) {
      wetCount++;
    } else if (tileType === TileType.WATER_STILL) {
      wetCount++;
      stillWaterCount++;
    }
  }
}

printGameField();
console.log(`Part A -- Number of wet fields: ${wetCount}`);
console.log(`Part B -- Number of non drained out fields: ${stillWaterCount}`);

// #endregion
