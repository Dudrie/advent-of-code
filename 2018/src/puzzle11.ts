/** Puzzle input */
let serialNr: number = 9110;
let grid: number[][] = new Array(301);

for (let x = 1; x <= 300; x++) {
    if (!grid[x]) {
        grid[x] = new Array(301);
    }

    for (let y = 1; y <= 300; y++) {
        grid[x][y] = calcCellPower(x, y, serialNr);
    }
}

// Part A
let maxSqaure: { x: number, y: number, power: number } = {
    x: -1,
    y: -1,
    power: Number.MIN_SAFE_INTEGER
};

for (let x = 1; x <= 300 - 3; x++) {
    for (let y = 1; y <= 300 - 3; y++) {
        let power = 0;
        for (let k = x; k < x + 3; k++) {
            for (let l = y; l < y + 3; l++) {
                power += grid[k][l];
            }
        }

        if (power > maxSqaure.power) {
            maxSqaure = { x, y, power };
        }
    }
}

console.log(`Part A -- Top left coordinate: ${maxSqaure.x},${maxSqaure.y} (Power: ${maxSqaure.power})`);

// Part B
console.log('\nPart B');
let powerSquares: { [id: string]: { [sqSize: number]: number } } = {};
console.log('Calculating power sums for each square size...');

// Initialize table
for (let x = 1; x <= 300; x++) {
    for (let y = 1; y <= 300; y++) {
        powerSquares[getCellId(x, y)] = {
            [1]: grid[x][y]
        };
    }
}

// Calc the size of each square based on the square one size smaller
for (let size = 2; size <= 300; size++) {
    for (let x = 1; x <= 300 - size + 1; x++) {
        for (let y = 1; y <= 300 - size + 1; y++) {
            let power: number = powerSquares[getCellId(x, y)][size - 1];

            // Add the new column
            for (let dy = y; dy < y + size; dy++) {
                power += grid[x + size - 1][dy];
            }

            // Add the new row - but skip the last entry, bc else it would have been added twice.
            for (let dx = x; dx < x + size - 1; dx++) {
                power += grid[dx][y + size - 1];
            }

            powerSquares[getCellId(x, y)][size] = power;
        }
    }
}

console.log('Finding greatest square of each id...');
let maxForId: { [id: string]: { size: number, power: number } } = {};

for (let id in powerSquares) {
    maxForId[id] = { size: 0, power: Number.MIN_SAFE_INTEGER };

    for (let [size, power] of Object.entries(powerSquares[id])) {
        if (maxForId[id].power < power) {
            maxForId[id] = { size: Number.parseInt(size), power };
        }
    }
}

console.log('Finding greatest square in total...');
let maxDynamicSquare: { id: string, size: number, power: number } = { id: '', size: 0, power: Number.MIN_SAFE_INTEGER };
for (let [id, sqInfo] of Object.entries(maxForId)) {
    if (maxDynamicSquare.power < sqInfo.power) {
        maxDynamicSquare = { id, size: sqInfo.size, power: sqInfo.power };
    }
}

console.log(`Part B -- Top left coordinate: ${maxDynamicSquare.id},${maxDynamicSquare.size} (Power: ${maxDynamicSquare.power})`);

// ========== HELPERS ==========
function calcCellPower(x: number, y: number, serialNr: number): number {
    let rackId: number = x + 10;
    let power: number = y * rackId;

    power += serialNr;
    power *= rackId;

    if (power < 100) {
        power = 0;

    } else {
        power = Math.floor((power / 100) % 10);
    }

    return power - 5;
}

function getCellId(x: number, y: number): string {
    return `${x},${y}`;
}