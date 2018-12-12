import { readPuzzleInput, getLinesOfInput } from './util/utils';

type Point = { x: number, y: number };
type Star = { pos: Point, velo: Point };
type Rectangle = { topLeft: Point, botRight: Point };

let input: string = readPuzzleInput(10);
// input = `
// position=< 9,  1> velocity=< 0,  2>
// position=< 7,  0> velocity=<-1,  0>
// position=< 3, -2> velocity=<-1,  1>
// position=< 6, 10> velocity=<-2, -1>
// position=< 2, -4> velocity=< 2,  2>
// position=<-6, 10> velocity=< 2, -2>
// position=< 1,  8> velocity=< 1, -1>
// position=< 1,  7> velocity=< 1,  0>
// position=<-3, 11> velocity=< 1, -2>
// position=< 7,  6> velocity=<-1, -1>
// position=<-2,  3> velocity=< 1,  0>
// position=<-4,  3> velocity=< 2,  0>
// position=<10, -3> velocity=<-1,  1>
// position=< 5, 11> velocity=< 1, -2>
// position=< 4,  7> velocity=< 0, -1>
// position=< 8, -2> velocity=< 0,  1>
// position=<15,  0> velocity=<-2,  0>
// position=< 1,  6> velocity=< 1,  0>
// position=< 8,  9> velocity=< 0, -1>
// position=< 3,  3> velocity=<-1,  1>
// position=< 0,  5> velocity=< 0, -1>
// position=<-2,  2> velocity=< 2,  0>
// position=< 5, -2> velocity=< 1,  2>
// position=< 1,  4> velocity=< 2,  1>
// position=<-2,  7> velocity=< 2, -2>
// position=< 3,  6> velocity=<-1, -1>
// position=< 5,  0> velocity=< 1,  0>
// position=<-6,  0> velocity=< 2,  0>
// position=< 5,  9> velocity=< 1, -2>
// position=<14,  7> velocity=<-2,  0>
// position=<-3,  6> velocity=< 2, -1>
// `;

let lines: string[] = getLinesOfInput(input);
let stars: Star[] = lines.map((l) => createStar(l));

let minDrawingRec: Rectangle = calcDrawingArea(stars);
let minArea: number = calcRectangleArea(minDrawingRec);
let idx: number = 0;
let s: number = 1;
let hasGottenSmaller: boolean = true;

// We assume that the message has the smallest drawing area.
while (hasGottenSmaller) {
    hasGottenSmaller = false;
    moveStars(stars);
    let drawingArea = calcDrawingArea(stars);
    let area = calcRectangleArea(drawingArea);

    if (area < minArea) {
        minDrawingRec = drawingArea;
        minArea = area;
        idx = s;
        hasGottenSmaller = true;
    }

    s += 1;
}

stars = lines.map((l) => createStar(l));

for (let i = 1; i <= idx; i++) {
    moveStars(stars);
}

printStars(stars, minDrawingRec);

console.log(`Part B -- Seconds to message: ${idx} seconds`);

// ========== HELPERS ==========
function createStar(line: string): Star {
    let regex: RegExp = /position=<\s*(-?[0-9]+),\s*(-?[0-9]+)> velocity=<\s*(-?[0-9]+),\s*(-?[0-9]+)>/g;
    let result = regex.exec(line);

    if (!result) {
        throw new Error(`Non parsable line: "${line}"`);
    }

    let [, x, y, dx, dy]: number[] = result.map((r) => Number.parseInt(r));

    return {
        pos: { x, y },
        velo: { x: dx, y: dy }
    };
}

function calcDrawingArea(stars: Star[]): Rectangle {
    return {
        topLeft: {
            x: Math.min(...stars.map((s) => s.pos.x)),
            y: Math.min(...stars.map((s) => s.pos.y))
        },
        botRight: {
            x: Math.max(...stars.map((s) => s.pos.x)),
            y: Math.max(...stars.map((s) => s.pos.y))
        }
    };
}

function printStars(stars: Star[], area: Rectangle): boolean {
    let lines: { [y: number]: { [x: number]: string } } = {};

    for (let y = area.topLeft.y; y <= area.botRight.y; y++) {
        lines[y] = {};
    }

    let couldPrintAllStars: boolean = true;
    stars.forEach((star) => {
        let { x, y } = star.pos;

        if (x >= area.topLeft.x && x <= area.botRight.x && y >= area.topLeft.y && y <= area.botRight.y) {
            lines[y][x] = '#';
        } else {
            couldPrintAllStars = false;
        }
    });

    for (let y = area.topLeft.y; y <= area.botRight.y; y++) {
        let line: string = '';
        for (let x = area.topLeft.x; x <= area.botRight.x; x++) {
            line += (lines[y][x] || '.');
        }

        console.log(line);
    }

    return couldPrintAllStars;
}

function moveStars(stars: Star[]) {
    for (let i = 0; i < stars.length; i++) {
        let { x, y } = stars[i].pos;
        let { x: dx, y: dy } = stars[i].velo;

        stars[i].pos = {
            x: x + dx,
            y: y + dy
        };
    }
}

function calcRectangleArea(rec: Rectangle): number {
    return (rec.botRight.x - rec.topLeft.x) * (rec.botRight.y - rec.topLeft.y);
}