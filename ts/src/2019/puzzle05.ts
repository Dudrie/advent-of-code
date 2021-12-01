import { readPuzzleInput } from '../util/PuzzleInputReader';

class IntcodeComputer {
  private store: number[];
  private currentPosition: number;

  private output: number;

  constructor(instruction: string) {
    this.store = instruction.split(',').map((i) => Number.parseInt(i, 10));
    this.currentPosition = 0;
    this.output = 0;
  }

  run() {
    let isFinished = false;

    while (!isFinished) {
      const result = this.executeNextInstruction();
      isFinished = result.isStopped;
    }
  }

  getStateAt(pos: number): number {
    return this.store[pos];
  }

  getOutput(): number {
    return this.output;
  }

  private executeNextInstruction(): { isStopped: boolean } {
    const instruction = this.store[this.currentPosition].toString();
    const opCode = Number.parseInt(instruction.substring(instruction.length - 2));
    const paramCodes: number[] = instruction
      .substr(0, instruction.length - 2)
      .split('')
      .reverse()
      .map((s) => Number.parseInt(s));

    switch (opCode) {
      case 99:
        console.log('Halting computer...');
        return { isStopped: true };

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
        const savePos = this.store[this.currentPosition + 1];
        const input = this.getInput();

        this.store[savePos] = input;
        this.increaseCurrentPosition(2);
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

    return { isStopped: false };
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

  private getInput(): number {
    return 5;
  }

  private increaseCurrentPosition(increaseBy: number) {
    this.currentPosition += increaseBy;
  }
}

const input = readPuzzleInput(5);
const computer = new IntcodeComputer(input);

computer.run();
console.log(`A: Result is ${computer.getOutput()}`);
