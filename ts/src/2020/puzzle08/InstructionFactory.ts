import { AccInstruction, JmpInstruction, NopInstruction } from './ActualInstructions';
import { Instruction } from './Instructions';

export abstract class InstructionFactory {
  /**
   * Generates an instruction from the given information.
   *
   * @param instructionLine Information about the instruction.
   * @throws `Error` - If no instruction could be generated from the information.
   */
  static generateInstruction(instructionLine: string): Instruction {
    const [operation, arg] = instructionLine.split(/\s/);
    const argument = Number.parseInt(arg);

    switch (operation) {
      case 'acc':
        return new AccInstruction(argument);

      case 'jmp':
        return new JmpInstruction(argument);

      case 'nop':
        return new NopInstruction(argument);

      default:
        throw new Error(`Operation "${operation}" is not a valid operation.`);
    }
  }
}
