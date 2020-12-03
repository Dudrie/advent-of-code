import { getLinesOfInput, readPuzzleInput } from '../util/PuzzleInputReader';
import {
  Register,
  Operation,
  addr,
  addi,
  mulr,
  muli,
  banr,
  bani,
  borr,
  bori,
  setr,
  seti,
  gtir,
  gtri,
  gtrr,
  eqir,
  eqri,
  eqrr,
} from './puzzle16';

function runLine(line: string) {
  const lineParts: string[] = line.split(' ');
  const opName: string = lineParts.splice(0, 1)[0];
  const nums: number[] = lineParts.map(v => Number.parseInt(v));

  operations[opName](register, nums[0], nums[1], nums[2]);
}

// #region RUNNING SECTION
const inputData: string[] = getLinesOfInput(readPuzzleInput(19, 0));

let register: Register = [0, 0, 0, 0, 0, 0];
const ipParsed: number = Number.parseInt(/([0-5])/.exec(inputData.splice(0, 1)[0])![0]);
let ipRegister: number = ipParsed;

const operations: { [id: string]: Operation } = {
  addr,
  addi,
  mulr,
  muli,
  banr,
  bani,
  borr,
  bori,
  setr,
  seti,
  gtir,
  gtri,
  gtrr,
  eqir,
  eqri,
  eqrr,
};

while (register[ipRegister] < inputData.length) {
  runLine(inputData[register[ipRegister]]);

  register[ipRegister] += 1;
}

console.log(`Part A -- Contents of register 0: ${register[0]}`);

// Reset everything so it maps the description for part B
register = [1, 0, 0, 0, 0, 0];
ipRegister = ipParsed;

// TODO - Solution is: Reverse engineering of the input.

console.log(`Part B -- Contents of register 0: ${register[0]}`);
// #endregion
