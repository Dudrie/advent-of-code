/**
 * This solution was created thanks to the helping comment of IndieBret on the AoC subreddit.
 *
 * Source: https://www.reddit.com/r/adventofcode/comments/a2lesz/2018_day_3_solutions/eazgkm2
 */
import { getLinesOfInput, readPuzzleInput } from '../util/utils';

const claims: string[] = getLinesOfInput(readPuzzleInput(3));
// claims = [
//     '#1 @ 1,3: 4x4',
//     '#2 @ 3,1: 4x4',
//     '#3 @ 5,5: 2x2'
// ]; // Should have 4 overlapping squares (#1 and #2 are overlapping)

// Part A
console.log('Calculating part A');
const recs: Rectangle[] = claims.map(input => createRectangleFromInput(input));

console.log(`Rectangle count: ${recs.length}`);

const tiles: Tiles = {};
let overlappedTiles: number = 0;

for (const rectangle of recs) {
  // console.log(`Calculating rectangle #${rectangle.id}`);
  addCoveredTiles(rectangle, tiles);
}

for (const tile of Object.values(tiles)) {
  if (tile > 1) {
    overlappedTiles += 1;
  }
}

console.log(`Overlapped: ${overlappedTiles}`);

// Part B
console.log('Calculating part B');
console.log(`Lonely claim: ${findLonelyClaim(recs)}`);

// =========== HELPERS ==========
type Point = { x: number; y: number };
type Rectangle = { id: number; pos: Point; width: number; height: number };
type Tiles = { [k: string]: number };

function createRectangleFromInput(input: string): Rectangle {
  // Sample input: #123 @ 3,2: 5x4 -> id: 123, pos: (3, 2), w: 5, h: 4
  const parts: string[] = input.split(' ');

  const id: number = Number.parseInt(parts[0].substr(1));
  const posArg: string[] = parts[2].substr(0, parts[2].length - 1).split(',');
  const pos: Point = {
    x: Number.parseInt(posArg[0]),
    y: Number.parseInt(posArg[1]),
  };

  const dimArgs: string[] = parts[3].split('x');
  const width: number = Number.parseInt(dimArgs[0]);
  const height: number = Number.parseInt(dimArgs[1]);

  return {
    id,
    pos,
    width,
    height,
  };
}

function addCoveredTiles(rec: Rectangle, tiles: Tiles) {
  for (let x = rec.pos.x; x < rec.pos.x + rec.width; x++) {
    for (let y = rec.pos.y; y < rec.pos.y + rec.height; y++) {
      tiles[`${x},${y}`] = (tiles[`${x},${y}`] || 0) + 1;
    }
  }
}

function findLonelyClaim(recs: Rectangle[]): number {
  for (let i = 0; i < recs.length; i++) {
    let lonelyClaim: boolean = true;

    for (let k = 0; k < recs.length; k++) {
      if (i !== k && isOverlapping(recs[i], recs[k])) {
        lonelyClaim = false;
        break;
      }
    }

    if (lonelyClaim) {
      return recs[i].id;
    }
  }

  return -1;
}

function isOverlapping(recOne: Rectangle, recTwo: Rectangle): boolean {
  return (
    recOne.pos.x < recTwo.pos.x + recTwo.width &&
    recOne.pos.y < recTwo.pos.y + recTwo.height &&
    recTwo.pos.x < recOne.pos.x + recOne.width &&
    recTwo.pos.y < recOne.pos.y + recOne.height
  );
}
