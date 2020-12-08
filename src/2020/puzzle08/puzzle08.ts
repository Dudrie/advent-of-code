import { PuzzleSolver } from '../../util/PuzzleSolver';
import { JmpInstruction, NopInstruction } from './ActualInstructions';
import { HandHeldSystem, InfiniteLoopException } from './HandHeldSystem';

class PuzzleSolver08 extends PuzzleSolver {
  private readonly input: string[];

  constructor() {
    super(8);
    this.input = this.inputReader.getPuzzleInputSplitByLines();
  }

  solve(): void {
    const system = new HandHeldSystem(this.input);

    try {
      system.runInstructions();
    } catch (err: unknown) {
      if (err instanceof InfiniteLoopException) {
        this.printSolution(err.accumulatorValue, 'A');
      }
    }

    const repairedSystem = this.getRepairedSystem(system);
    this.printSolution(repairedSystem.getAccumulator(), 'B');
  }

  /**
   * Tries to repair the system.
   *
   * If successful a **new** system with repaired instructions is returned. The system also has one completed run of it's instructions.
   *
   * @param system System to repair.
   * @returns **New** and repaired system.
   * @throws `Error` - The system could not be repaired.
   */
  private getRepairedSystem(system: HandHeldSystem): HandHeldSystem {
    console.log('Trying to repair the system...');
    const instructions = system.getAllInstructions();

    for (let instructionNo = 0; instructionNo < instructions.length; instructionNo++) {
      const instruction = instructions[instructionNo];

      if (
        instruction instanceof JmpInstruction ||
        // We do not need to replace 'nop' with argument of 0
        (instruction instanceof NopInstruction && instruction.getArgument() !== 0)
      ) {
        const otherSystem = new HandHeldSystem(this.input);
        otherSystem.hackSystem(instructionNo);

        try {
          otherSystem.runInstructions();

          // Run was successful so return the system.
          console.log('System repaired.');
          return otherSystem;
        } catch (err) {
          console.log(`Hack on instruction #${instructionNo} unsuccessful. Trying another.`);
        }
      }
    }

    throw new Error('Could not repair the system.');
  }
}

new PuzzleSolver08().solve();
