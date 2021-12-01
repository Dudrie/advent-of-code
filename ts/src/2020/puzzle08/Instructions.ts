import { HandHeldSystem } from './HandHeldSystem';

export abstract class Instruction {
  protected readonly argument: number;
  private wasRunEarlier: boolean;

  constructor(argument: number) {
    this.argument = argument;
    this.wasRunEarlier = false;
  }

  /**
   * Runs the instruction.
   *
   * After the instruction finishes the system is told where to look for the next instruction.
   *
   * @param system System to run the instruction on.
   */
  abstract run(system: HandHeldSystem): void;

  /**
   * Mark this instruction as already run.
   */
  didRun(): void {
    this.wasRunEarlier = true;
  }

  /**
   * @returns True if this instruction was run earlier.
   */
  wasAlreadyRun(): boolean {
    return this.wasRunEarlier;
  }

  /**
   * @returns Argument of this instruction.
   */
  getArgument(): number {
    return this.argument;
  }
}
