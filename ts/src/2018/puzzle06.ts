import { getLinesOfInput, readPuzzleInput } from '../util/PuzzleInputReader';

const input: string[] = getLinesOfInput(readPuzzleInput(6));
// input = getLinesOfInput(`
// 1, 1
// 1, 6
// 8, 3
// 3, 4
// 5, 5
// 8, 9
// `);

const points: Point[] = [];
input.forEach((i) => points.push(parseLineOfInput(i)));

const topLeft: Point = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
const bottomRight: Point = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER };

points.forEach((p) => {
  if (p.x < topLeft.x) {
    topLeft.x = p.x;
  } else if (p.x > bottomRight.x) {
    bottomRight.x = p.x;
  }

  if (p.y < topLeft.y) {
    topLeft.y = p.y;
  } else if (p.y > bottomRight.y) {
    bottomRight.y = p.y;
  }
});

// Part A
console.log('Calculation Part A');

// We only need to check the places in between the points of the top left and the bottom right, bc finite areas can only exist 'between' these two points.
const areaOfPoint: { [ptString: string]: number } = {};

for (let x = topLeft.x; x < bottomRight.x + 1; x++) {
  for (let y = topLeft.y; y < bottomRight.y + 1; y++) {
    const { pt: ptWithMinDist, isTied } = getPointWithMinDistance({ x, y }, points);

    if (!isTied) {
      areaOfPoint[pointToString(ptWithMinDist)] =
        (areaOfPoint[pointToString(ptWithMinDist)] || 0) + 1;
    }
  }
}

const offset: number = 3635;
const pointsToTest: Point[] = [
  { x: topLeft.x - offset, y: topLeft.y - offset }, // TopLeft
  { x: bottomRight.x + offset, y: topLeft.y - offset }, // TopRight
  { x: topLeft.x - offset, y: bottomRight.y + offset }, // BotLeft
  { x: bottomRight.x + offset, y: bottomRight.y + offset }, // BotRight
];

pointsToTest.forEach((pt) => {
  const { pt: ptWithMinDist } = getPointWithMinDistance(pt, points);

  areaOfPoint[pointToString(ptWithMinDist)] = Number.POSITIVE_INFINITY;
});

let largestArea: number = 0;
for (const area of Object.values(areaOfPoint)) {
  if (area !== Number.POSITIVE_INFINITY && area > largestArea) {
    largestArea = area;
  }
}

console.log(`Part A -- Size of largest area: ${largestArea}`);

// Part B
console.log('\nCalculation Part B');
const maxDistance: number = 10000;
let pointsInArea: number = 0;

for (let x = topLeft.x; x <= bottomRight.x; x++) {
  for (let y = topLeft.y; y <= bottomRight.y; y++) {
    let distSum: number = 0;

    points.forEach((pt) => (distSum += calcManhattanDistance(pt, { x, y })));

    if (distSum < maxDistance) {
      pointsInArea += 1;
    }
  }
}

console.log(
  `Part B -- Size of region containg all points with sumDist less ${maxDistance}: ${pointsInArea}`
);

// ========== HELPERS ==========
type Point = { x: number; y: number };

function parseLineOfInput(line: string): Point {
  const result: string[] = line.split(',').map((s) => s.trim());

  if (!result) {
    throw new Error('ERROR! CALL SANTA IMMEDIATLY!');
  }

  const [x, y] = result;

  return { x: Number.parseInt(x), y: Number.parseInt(y) };
}

function calcManhattanDistance(pOne: Point, pTwo: Point): number {
  return Math.abs(pOne.x - pTwo.x) + Math.abs(pOne.y - pTwo.y);
}

function pointToString(pt: Point): string {
  return `${pt.x},${pt.y}`;
}

function getPointWithMinDistance(
  pointToCheck: Point,
  allPoints: Point[]
): { pt: Point; isTied: boolean } {
  const { x, y } = pointToCheck;
  const curPoint: Point = { x, y };

  let minDistance: number = calcManhattanDistance(allPoints[0], curPoint);
  let belongsToPoint: Point | undefined = allPoints[0];
  let isTied: boolean = false;

  for (let i = 1; i < points.length; i++) {
    const dist: number = calcManhattanDistance(points[i], curPoint);

    if (dist === minDistance) {
      isTied = true;
    } else if (dist < minDistance) {
      isTied = false;
      minDistance = dist;
      belongsToPoint = points[i];
    }
  }

  return { pt: belongsToPoint, isTied };
}
