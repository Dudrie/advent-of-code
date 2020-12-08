import { JmpInstruction, NopInstruction } from './ActualInstructions';
import { InstructionFactory } from './InstructionFactory';
import { Instruction } from './Instructions';

export class InfiniteLoopException {
  readonly message: string;

  constructor(readonly accumulatorValue: number) {
    this.message = 'An infinite loop was detected';
  }
}

export class HandHeldSystem {
  private accumulator: number;
  private currentInstruction: number;
  private instructions: Instruction[];

  constructor(input: string[]) {
    this.accumulator = 0;
    this.currentInstruction = 0;
    this.instructions = input.map((i) => InstructionFactory.generateInstruction(i));
  }

  /**
   * Runs the instructions.
   *
   * The function will run until either the last instruction was run or an infinite loop is detected. For the puzzle the later will happen eventually.
   *
   * @throws `InfiniteLoopException`- The system ran into an infinite loop.
   */
  runInstructions(): void {
    while (this.currentInstruction < this.instructions.length) {
      const instruction = this.instructions[this.currentInstruction];

      if (instruction.wasAlreadyRun()) {
        throw new InfiniteLoopException(this.accumulator);
      }

      instruction.run(this);
    }
  }

  /**
   * The system will use the next instruction in the next cycle.
   */
  nextInstruction(): void {
    this.currentInstruction += 1;
  }

  /**
   * The system will jump the given amount of instruction before running the next cycle.
   *
   * @param amount Amount to jump.
   */
  jumpInstructions(amount: number): void {
    this.currentInstruction += amount;
  }

  /**
   * Adds the given value to the accumulator of the system.
   *
   * @param add Value to add (can be negative).
   */
  addToAccumulator(add: number): void {
    this.accumulator += add;
  }

  /**
   * Replaces the instruction at the given position.
   *
   * If it's a jmp operation it will be replaced by a nop and vice-versa. The argument of the instruction is kept. `acc` operations stay the same (an error gets thrown if you attempt to change an `acc` operation)
   *
   * @param instructionNo Number of the instruction to change.
   * @throws `Error` - If the instruction at the given number cannot be changed.
   */
  hackSystem(instructionNo: number): void {
    const instruction = this.instructions[instructionNo];

    if (instruction instanceof JmpInstruction) {
      this.instructions[instructionNo] = new NopInstruction(instruction.getArgument());
    } else if (instruction instanceof NopInstruction) {
      this.instructions[instructionNo] = new JmpInstruction(instruction.getArgument());
    } else {
      throw new Error(`Can not change the instruction with the number ${instructionNo}`);
    }
  }

  /**
   * @returns Copy of the list containing all instructions of this system.
   */
  getAllInstructions(): readonly Instruction[] {
    return [...this.instructions];
  }

  /**
   * @returns The current value of the accumulator.
   */
  getAccumulator(): number {
    return this.accumulator;
  }
}
