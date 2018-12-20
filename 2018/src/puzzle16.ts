import { readPuzzleInput, getLinesOfInput } from './util/utils';

type Register = number[];
type Operation = (r: Register, a: number, b: number, c: number) => void;
type OpData = { before: Register, after: Register, opString: string };
type OpArgs = { a: number, b: number, c: number };

function parseRegisterLine(line: string): Register {
    let nums: number[] = line.replace(' ', '')
        .split(':')[1]
        .replace(/\[|\]/, '')
        .split(',')
        .map((v) => Number.parseInt(v));

    return [nums[0], nums[1], nums[2], nums[3]];
}

/**
 * Runs the given operation on a __copy__ of the given register. The given args will be passed on to the operation.
 * 
 * @param op Operation to run
 * @param register Register at the beginning
 * @param args Arguements (values and/or register IDs) to pass to the operation
 */
function runOp(op: Operation, register: Register, args: OpArgs): Register {
    let { a, b, c } = args;
    let reg: Register = [...register];

    op(reg, a, b, c);

    return reg;
}

function areArraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

// #region instructions
function addr(register: Register, regAId: number, regBId: number, regCId: number) {
    register[regCId] = register[regAId] + register[regBId];
}

function addi(register: Register, regAId: number, valB: number, regCId: number) {
    register[regCId] = register[regAId] + valB;
}

function mulr(register: Register, regAId: number, regBId: number, regCId: number) {
    register[regCId] = register[regAId] * register[regBId];
}

function muli(register: Register, regAId: number, valB: number, regCId: number) {
    register[regCId] = register[regAId] * valB;
}

function banr(register: Register, regAId: number, regBId: number, regCId: number) {
    register[regCId] = register[regAId] & register[regBId];
}

function bani(register: Register, regAId: number, valB: number, regCId: number) {
    register[regCId] = register[regAId] & valB;
}

function borr(register: Register, regAId: number, regBId: number, regCId: number) {
    register[regCId] = register[regAId] | register[regBId];
}

function bori(register: Register, regAId: number, valB: number, regCId: number) {
    register[regCId] = register[regAId] | valB;
}

function setr(register: Register, regAId: number, _: number, regCId: number) {
    register[regCId] = register[regAId];
}

function seti(register: Register, valA: number, _: number, regCId: number) {
    register[regCId] = valA;
}

function gtir(register: Register, valA: number, regBId: number, regCId: number) {
    register[regCId] = (valA > register[regBId]) ? 1 : 0;
}

function gtri(register: Register, regAId: number, valB: number, regCId: number) {
    register[regCId] = (register[regAId] > valB) ? 1 : 0;
}

function gtrr(register: Register, regAId: number, regBId: number, regCId: number) {
    register[regCId] = (register[regAId] > register[regBId]) ? 1 : 0;
}

function eqir(register: Register, valA: number, regBId: number, regCId: number) {
    register[regCId] = (valA === register[regBId]) ? 1 : 0;
}

function eqri(register: Register, regAId: number, valB: number, regCId: number) {
    register[regCId] = (register[regAId] === valB) ? 1 : 0;
}

function eqrr(register: Register, regAId: number, regBId: number, regCId: number) {
    register[regCId] = (register[regAId] === register[regBId]) ? 1 : 0;
}
// #endregion

// #region RUNNING SECTION
let inputData: string[] = getLinesOfInput(readPuzzleInput(16));

// This is NOT a 'test' like puzzle 15. This is the input which resambles the test program for part B.
let inputTestProg: string[] = getLinesOfInput(readPuzzleInput(16, 1));

// const register: Register = [0, 0, 0, 0];
const ALL_OPS: Operation[] = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

// Build the past operation data
let pastOperations: OpData[] = [];

// Parse the past input data
for (let i = 0; i < inputData.length - 2; i += 3) {
    let line: string = inputData[i];
    pastOperations.push({
        before: parseRegisterLine(line),
        after: parseRegisterLine(inputData[i + 2]),
        opString: inputData[i + 1].trim()
    });
}

// Try every operation with ever past logged data and find the ones who could be the result of at least 3 operations.
// Also, we track which operations belong to which opIds.
let countDataResultingFromThreeOps: number = 0;
let mapIdToPossibleOps: { [id: string]: Operation[] } = {};

for (let opData of pastOperations) {
    let countResultOfOp: number = 0;
    let { before, after, opString: op } = opData;

    let [opId, a, b, c] = op.split(' ').map((v) => Number.parseInt(v));
    let args: OpArgs = { a, b, c };

    for (let op of ALL_OPS) {
        let result: Register = runOp(op, before, args);

        if (areArraysEqual(after, result)) {
            countResultOfOp += 1;

            // Add this operation to the list of possible operations for this id.
            let possibleOps: Operation[] = (mapIdToPossibleOps[`${opId}`] || []);
            if (!possibleOps.includes(op)) {
                possibleOps.push(op);
                mapIdToPossibleOps[`${opId}`] = possibleOps;
            }

            if (countResultOfOp === 3) {
                countDataResultingFromThreeOps += 1;
            }
        }
    }
}

console.log(`Part A -- Number of data blocks which belong to at least 3 operations: ${countDataResultingFromThreeOps}`);

// Part B -- Run test program
let mapIdToOp: Map<string, Operation> = new Map();

// Find the operation belonging to each id.
let entries: [string, Operation[]][] = Object.entries(mapIdToPossibleOps);

while (entries.length > 0) {
    // Sort the entries increasing in the length of their operation arrays.
    entries.sort((a, b) => a[1].length - b[1].length);

    for (let i = 0; i < entries.length; i++) {
        let [opId, opArray] = entries[i];
        let opToAddToMap: Operation | undefined = undefined;

        // Map all 'obvious' solutions (all which include only one array)
        if (opArray.length === 1) {
            opToAddToMap = opArray[0];
            
        } else {
            // Can we find an operation in the operation array which does NOT appear any other operation array?
            for (let op of opArray) {
                let isOnlyInCurrentArray: boolean = true;

                for (let k = (i + 1) % entries.length; k !== i; k = (k + 1) % entries.length) {
                    let [, altOpArray] = entries[k];
                    if (altOpArray.includes(op)) {
                        isOnlyInCurrentArray = false;
                        break;
                    }
                }

                if (isOnlyInCurrentArray) {
                    opToAddToMap = op;
                    break;
                }
            }
        }

        if (opToAddToMap) {
            mapIdToOp.set(opId, opToAddToMap);

            // Remove the operation from all entry-arrays because it already got mapped.
            for (let k = 0; k < entries.length; k++) {
                let idx: number = entries[k][1].indexOf(opToAddToMap);

                if (idx !== -1) {
                    entries[k][1].splice(idx, 1);
                }
            }

            // If we have added on operation from that entry (so we have mapped the id to an operation) emtpy the operation array so it gets removed in the filter step.
            entries[i][1] = [];
        }
    }

    // Only take the entries with at least one possible operation into the next step.
    entries = entries.filter((val) => val[1].length > 0);
}

let register: Register = [0, 0, 0, 0];

for (let testLine of inputTestProg) {
    let [opId, a, b, c] = testLine.split(' ').map((v) => Number.parseInt(v));
    let operationToRun: Operation | undefined = mapIdToOp.get(`${opId}`);

    if (!operationToRun) {
        throw new Error(`NO OPERATION FOUND FOR ID ${opId}`);
    }

    register = runOp(operationToRun, register, { a, b, c });
}

console.log(`Part B -- Content of register at 0: ${register[0]}`);

// #endregion