import { readPuzzleInput } from '../util/PuzzleInputReader';

interface ProgramReturn {
  isFinished: boolean;
  store: number[];
}

function executeInstruction(position: number, store: number[]): ProgramReturn {
  const instruction = store[position];
  // console.log(`Position: ${position} -- Instruction: ${instruction}`);

  if (instruction === 99) {
    return { isFinished: true, store };
  }

  const elAPos = store[position + 1];
  const elBPos = store[position + 2];
  const saveToPos = store[position + 3];

  switch (instruction) {
    case 1:
      store[saveToPos] = store[elAPos] + store[elBPos];

      return { isFinished: false, store };
    case 2:
      store[saveToPos] = store[elAPos] * store[elBPos];

      return { isFinished: false, store };
    default:
      throw new Error(
        `Unknown instruction encountered (instruc: ${instruction}, pos: ${position}). Aborting program`
      );
  }
}

function runProgramm(state: number[], [noun, verb]: [number, number]): number {
  state[1] = noun;
  state[2] = verb;

  let isFinished: boolean = false;

  for (let pos = 0; pos < state.length && !isFinished; pos += 4) {
    const result = executeInstruction(pos, state);
    isFinished = result.isFinished;
  }

  return state[0];
}

const initialState: number[] = readPuzzleInput(2)
  .split(',')
  .map(i => Number.parseInt(i, 10));

const resultA = runProgramm([...initialState], [12, 2]);

console.log(`A: Result is ${resultA}`);

for (let noun = 0; noun <= 99; noun++) {
  for (let verb = 0; verb <= 99; verb++) {
    const result = runProgramm([...initialState], [noun, verb]);

    if (result === 19690720) {
      console.log(`B: Combination found: [${noun}, ${verb}] -> Result: ${100 * noun + verb}`);
      process.exit(0);
    }
  }
}

console.error(`No combination found for part two.`);
