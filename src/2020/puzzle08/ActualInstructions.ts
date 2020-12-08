import { HandHeldSystem } from './HandHeldSystem';
import { Instruction } from './Instructions';

/**
 * Implementation of the `acc` instruction.
 */
export class AccInstruction extends Instruction {
  run(system: HandHeldSystem): void {
    this.didRun();
    system.addToAccumulator(this.argument);
    system.nextInstruction();
  }
}

/**
 * Implementation of the `jmp` instruction.
 */
export class JmpInstruction extends Instruction {
  run(system: HandHeldSystem): void {
    this.didRun();
    system.jumpInstructions(this.argument);
  }
}

/**
 * Implementation of the `nop` instruction.
 */
export class NopInstruction extends Instruction {
  run(system: HandHeldSystem): void {
    this.didRun();
    system.nextInstruction();
  }
}
