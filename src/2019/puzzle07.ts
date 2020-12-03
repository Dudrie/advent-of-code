import { readPuzzleInput } from '../util/PuzzleInputReader';

enum State {
  CREATED,
  RUNNING,
  WAITING_FOR_INTPUT,
  HALTED,
}

class IntcodeComputer {
  private store: number[];
  private currentPosition: number;
  private nextInput: number | undefined;
  private output: number;

  private state: State;

  constructor(instruction: string) {
    this.store = instruction.split(',').map(i => Number.parseInt(i, 10));
    this.currentPosition = 0;
    this.output = 0;

    this.state = State.CREATED;
    this.nextInput = undefined;
  }

  run(nextInput: number) {
    this.nextInput = nextInput;
    this.state = State.RUNNING;

    while (this.state === State.RUNNING) {
      this.executeNextInstruction();
    }
  }

  getStateAt(pos: number): number {
    return this.store[pos];
  }

  getOutput(): number {
    return this.output;
  }

  isHalted(): boolean {
    return this.state === State.HALTED;
  }

  private executeNextInstruction(): void {
    const instruction = this.store[this.currentPosition].toString();
    const opCode = Number.parseInt(instruction.substring(instruction.length - 2));
    const paramCodes: number[] = instruction
      .substr(0, instruction.length - 2)
      .split('')
      .reverse()
      .map(s => Number.parseInt(s));

    switch (opCode) {
      case 99:
        console.log('\tHalting computer...');
        this.state = State.HALTED;
        break;

      case 1:
        const [elASum, elBSum] = this.getReadParams(2, paramCodes);
        const saveSumTo = this.store[this.currentPosition + 3];

        this.store[saveSumTo] = elASum + elBSum;
        this.increaseCurrentPosition(4);
        break;

      case 2:
        const [elAProd, elBProd] = this.getReadParams(3, paramCodes);
        const saveProdTo = this.store[this.currentPosition + 3];

        this.store[saveProdTo] = elAProd * elBProd;
        this.increaseCurrentPosition(4);
        break;

      case 3:
        if (this.hasInput()) {
          const savePos = this.store[this.currentPosition + 1];
          const input = this.getInput();

          this.store[savePos] = input;
          this.increaseCurrentPosition(2);
        } else {
          this.state = State.WAITING_FOR_INTPUT;
        }
        break;

      case 4:
        const [elementRead] = this.getReadParams(1, paramCodes);

        this.output = elementRead;
        this.increaseCurrentPosition(2);
        break;

      case 5:
        const [numberToCheck, newPos] = this.getReadParams(2, paramCodes);

        if (numberToCheck !== 0) {
          this.currentPosition = newPos;
        } else {
          this.increaseCurrentPosition(3);
        }

        break;
      case 6:
        const [valueToCheck, newPointerPos] = this.getReadParams(2, paramCodes);

        if (valueToCheck === 0) {
          this.currentPosition = newPointerPos;
        } else {
          this.increaseCurrentPosition(3);
        }

        break;

      case 7:
        const [elACheckLess, elBCheckLess] = this.getReadParams(2, paramCodes);
        const saveResultTo = this.store[this.currentPosition + 3];

        this.store[saveResultTo] = elACheckLess < elBCheckLess ? 1 : 0;
        this.increaseCurrentPosition(4);
        break;

      case 8:
        const [elACheckEqual, elBCheckEqual] = this.getReadParams(2, paramCodes);
        const saveTo = this.store[this.currentPosition + 3];

        this.store[saveTo] = elACheckEqual === elBCheckEqual ? 1 : 0;
        this.increaseCurrentPosition(4);
        break;
      default:
        throw new Error(`Unknown op code ${opCode}.`);
    }
  }

  private getReadParams(paramCount: number, paramCodes: number[]): number[] {
    while (paramCodes.length < paramCount) {
      paramCodes.push(0);
    }

    const params: number[] = [];

    for (let i = 0; i < paramCount; i++) {
      params.push(this.getReadParamAt(this.currentPosition + 1 + i, paramCodes[i]));
    }

    return params;
  }

  private getReadParamAt(pos: number, paramCode: number): number {
    if (paramCode === 0) {
      const positionOfElement = this.store[pos];
      return this.store[positionOfElement];
    } else if (paramCode === 1) {
      return this.store[pos];
    } else {
      throw new Error(`Unknown parameter code ${paramCode}`);
    }
  }

  private hasInput(): boolean {
    return this.nextInput !== undefined;
  }

  private getInput(): number {
    if (this.nextInput === undefined) {
      throw new Error(
        'Input requested but it is undefined. Make sure you provide a correct input.'
      );
    }

    const input = this.nextInput;
    this.nextInput = undefined;

    return input;
  }

  private increaseCurrentPosition(increaseBy: number) {
    this.currentPosition += increaseBy;
  }
}

function runAmplifierTillItHalts(program: string, phase: number, input: number): number {
  const amplifier = new IntcodeComputer(program);
  amplifier.run(phase);

  while (!amplifier.isHalted()) {
    amplifier.run(input);
  }

  return amplifier.getOutput();
}

function swap(array: number[], idxA: number, idxB: number) {
  const tmp = array[idxA];
  array[idxA] = array[idxB];
  array[idxB] = tmp;
}

/**
 * Permutates a given array by using Heaps' Algorithm (https://en.wikipedia.org/wiki/Heap%27s_algorithm).
 *
 * @param initialArray Array to permutate
 */
function* permutate(initialArray: number[]) {
  const permutation = [...initialArray];
  const length = initialArray.length;
  const stackState = Array(length).fill(0);
  let i = 1;
  let k = 0;

  yield [...permutation];

  while (i < length) {
    if (stackState[i] < i) {
      k = i % 2 === 0 ? 0 : stackState[i];

      swap(permutation, i, k);

      stackState[i]++;
      i = 1;

      yield [...permutation];
    } else {
      stackState[i] = 0;
      i++;
    }
  }
}

const program = readPuzzleInput(7);

let thrusterSignal: number = Number.MIN_SAFE_INTEGER;
let thrusterPhases: number[] = [];

for (const permutation of permutate([0, 1, 2, 3, 4])) {
  console.log(`Checking ${permutation}...`);

  const [phaseA, phaseB, phaseC, phaseD, phaseE] = permutation;
  const resultAmpA = runAmplifierTillItHalts(program, phaseA, 0);
  const resultAmpB = runAmplifierTillItHalts(program, phaseB, resultAmpA);
  const resultAmpC = runAmplifierTillItHalts(program, phaseC, resultAmpB);
  const resultAmpD = runAmplifierTillItHalts(program, phaseD, resultAmpC);
  const resultAmpE = runAmplifierTillItHalts(program, phaseE, resultAmpD);

  if (resultAmpE > thrusterSignal) {
    thrusterSignal = resultAmpE;
    thrusterPhases = [...permutation];
  }
}

console.log(`A: Highest signal for thruster = ${thrusterSignal} (Phases: ${thrusterPhases})`);

console.log(`\n===== Need MORE signal (Part B) =====`);

function runAmplifiersInFeedbackLoop(phases: number[]): number {
  const [phaseA, phaseB, phaseC, phaseD, phaseE] = phases;

  const ampA = new IntcodeComputer(program);
  const ampB = new IntcodeComputer(program);
  const ampC = new IntcodeComputer(program);
  const ampD = new IntcodeComputer(program);
  const ampE = new IntcodeComputer(program);

  const amplifiers: IntcodeComputer[] = [ampA, ampB, ampC, ampD, ampE];
  let activeAmplifier = 0;
  let nextInput = 0;

  ampA.run(phaseA);
  ampB.run(phaseB);
  ampC.run(phaseC);
  ampD.run(phaseD);
  ampE.run(phaseE);

  while (!amplifiers[activeAmplifier].isHalted()) {
    const currentAmp = amplifiers[activeAmplifier];
    currentAmp.run(nextInput);

    nextInput = currentAmp.getOutput();

    activeAmplifier = (activeAmplifier + 1) % amplifiers.length;
  }

  return ampE.getOutput();
}

let amplifiedThrusterSignal = Number.MIN_SAFE_INTEGER;
let amplifiedThrusterPhases: number[] = [];

for (const permutation of permutate([5, 6, 7, 8, 9])) {
  console.log(`Checking ${permutation}...`);

  const result = runAmplifiersInFeedbackLoop(permutation);

  if (result > amplifiedThrusterSignal) {
    amplifiedThrusterSignal = result;
    amplifiedThrusterPhases = [...permutation];
  }
}

console.log(
  `B: Highest signal for thruster = ${amplifiedThrusterSignal} (Phases: ${amplifiedThrusterPhases})`
);
