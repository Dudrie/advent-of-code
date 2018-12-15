/** 
 * TODO: Write a (second) solution using complex numbers as it's stated in an idea in the comment from Shemetz on the AoC subreddit
 * 
 * Q: https://www.reddit.com/r/adventofcode/comments/a5qd71/2018_day_13_solutions/ebolyq6
*/
import { getLinesOfInput, readPuzzleInput } from './util/utils';

enum Direction {
    NORTH, EAST, SOUTH, WEST
}
type Turn = 'left' | 'right' | 'noTurn';
type Cart = { id: number, x: number, y: number, dir: Direction, lastTurn: number };

const TURNS: Turn[] = ['left', 'noTurn', 'right'];

let input: string[] = getLinesOfInput(readPuzzleInput(13));
let field: string[][] = [];
let carts: Cart[] = [];

// Instantiate the field and the cars.
for (let y = 0; y < input.length; y++) {
    field[y] = [];

    for (let x = 0; x < input[y].length; x++) {
        let c = input[y].charAt(x);

        switch (c) {
            case '>':
                carts.push({ id: carts.length + 1, x, y, dir: Direction.EAST, lastTurn: -1 });
                c = '-';
                break;

            case '<':
                carts.push({ id: carts.length + 1, x, y, dir: Direction.WEST, lastTurn: -1 });
                c = '-';
                break;

            case '^':
                carts.push({ id: carts.length + 1, x, y, dir: Direction.NORTH, lastTurn: -1 });
                c = '|';
                break;

            case 'v':
                carts.push({ id: carts.length + 1, x, y, dir: Direction.SOUTH, lastTurn: -1 });
                c = '|';
                break;
        }

        field[y][x] = c;
    }
}

console.log(`W: ${field[0].length}, L: ${field.length}`);

carts.sort(compareCarts);
// printField(field, carts);

let firstCrashPos: { x: number, y: number } | undefined;

while (carts.length > 1) {
    for (let idx = 0; idx < carts.length; idx++) {
        let cart = carts[idx];

        moveCart(cart, field);

        let crashedWithIdx: number = carts.findIndex((val) => {
            return cart.id !== val.id && compareCarts(cart, val) === 0;
        });

        if (crashedWithIdx !== -1) {
            // Remove the higher indexed car first.
            if (crashedWithIdx < idx) {
                carts.splice(idx, 1);
                carts.splice(crashedWithIdx, 1);
                idx -= 2;
            } else {
                carts.splice(crashedWithIdx, 1);
                carts.splice(idx, 1);
                idx -= 1;
            }

            if (!firstCrashPos) {
                firstCrashPos = { x: cart.x, y: cart.y };
            }
        }
    }

    carts.sort(compareCarts);
}

console.log(`\nPart A - Collision point: ${firstCrashPos!.x},${firstCrashPos!.y}`);

console.log(`Part B -- Position of last cart: ${carts[0].x},${carts[0].y}`);

// ========== HELPERS ==========
function moveCart(cart: Cart, field: string[][]) {
    let { EAST, WEST, NORTH, SOUTH } = Direction;

    // Move the cart one step
    if (cart.dir === EAST) {
        cart.x += 1;

    } else if (cart.dir === WEST) {
        cart.x -= 1;

    } else if (cart.dir === NORTH) {
        cart.y -= 1;

    } else if (cart.dir === SOUTH) {
        cart.y += 1;

    }

    // Make checks on where to go in the next tick
    // console.log(`${cart.x},${cart.y} -- ${field[0].length},${field.length}`);
    adjustCartDirection(cart, field[cart.y][cart.x]);
}

function adjustCartDirection(cart: Cart, currTile: string) {
    if (currTile === '+') {
        cart.lastTurn = (cart.lastTurn + 1) % TURNS.length;
        let nextTurn: Turn = TURNS[cart.lastTurn];

        if (nextTurn === 'left') {
            turnLeft(cart);
        } else if (nextTurn === 'right') {
            turnRight(cart);
        }

    } else if (currTile === '\\' || currTile === '/') {
        turnInCurveDirection(cart, field);
    }
}

function turnRight(cart: Cart) {
    let { NORTH, EAST, SOUTH, WEST } = Direction;
    switch (cart.dir) {
        case NORTH:
            cart.dir = EAST;
            break;
        case EAST:
            cart.dir = SOUTH;
            break;
        case SOUTH:
            cart.dir = WEST;
            break;
        case WEST:
            cart.dir = NORTH;
            break;
    }
}

function turnLeft(cart: Cart) {
    let { NORTH, EAST, SOUTH, WEST } = Direction;
    switch (cart.dir) {
        case NORTH:
            cart.dir = WEST;
            break;
        case EAST:
            cart.dir = NORTH;
            break;
        case SOUTH:
            cart.dir = EAST;
            break;
        case WEST:
            cart.dir = SOUTH;
            break;
    }
}

function turnInCurveDirection(cart: Cart, field: string[][]) {
    let { NORTH, EAST, SOUTH, WEST } = Direction;
    let curve: string = field[cart.y][cart.x];

    if (curve === '\\') {
        switch (cart.dir) {
            case EAST:
                cart.dir = SOUTH;
                break;
            case SOUTH:
                cart.dir = EAST;
                break;
            case WEST:
                cart.dir = NORTH;
                break;
            case NORTH:
                cart.dir = WEST;
                break;
        }

    } else if (curve === '/') {
        switch (cart.dir) {
            case EAST:
                cart.dir = NORTH;
                break;
            case SOUTH:
                cart.dir = WEST;
                break;
            case WEST:
                cart.dir = SOUTH;
                break;
            case NORTH:
                cart.dir = EAST;
                break;
        }
    }
}

/**
 * Compares the given two carts.
 * 
 * A cart is considered smaller if (higher works the same):
 *  1. It has a lower row index than the other
 *  2. If the row indexes are the same: It has a lower column index than the other
 * 
 * Two carts are considered equal if the have the same row **and** the same column index.
 * 
 * @param a First cart to compare
 * @param b Second cart to compare
 */
function compareCarts(a: Cart, b: Cart): number {
    if (a.y === b.y) {
        // Same row
        return (a.x - b.x);
    }

    return (a.y - b.y);
}

// @ts-ignore
function printField(field: string[][], carts: Cart[]) {
    let { NORTH, EAST, SOUTH, WEST } = Direction;
    let fieldToPrint: string[][] = [];

    for (let y = 0; y < field.length; y++) {
        fieldToPrint[y] = [];

        for (let x = 0; x < field[y].length; x++) {
            fieldToPrint[y][x] = field[y][x];
        }
    }

    carts.forEach((cart, idx) => {
        let cartChar: string = fieldToPrint[cart.y][cart.x];

        let c = carts.find((val, i) => i !== idx && compareCarts(cart, val) === 0);
        if (c) {
            cartChar = 'X';
        } else {
            switch (cart.dir) {
                case NORTH:
                    cartChar = '^';
                    break;
                case EAST:
                    cartChar = '>';
                    break;
                case SOUTH:
                    cartChar = 'v';
                    break;
                case WEST:
                    cartChar = '<';
                    break;
            }
        }

        fieldToPrint[cart.y][cart.x] = cartChar;
    });

    for (let y = 0; y < fieldToPrint.length; y++) {

        let line: string = '';
        for (let x = 0; x < fieldToPrint[y].length; x++) {
            line += fieldToPrint[y][x];
        }

        console.log(line);
    }
}