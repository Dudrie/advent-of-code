import { Memory } from './Memory';

export abstract class Instruction {
  /**
   * Run the instruction on the given memory.
   *
   * @param memory Memory to run the instruction on.
   */
  abstract run(memory: Memory): void;
}

class SetMaskInstruction extends Instruction {
  private readonly mask: string;

  constructor(input: string) {
    super();
    const [, mask] = input.split('=');

    this.mask = mask.trim();
  }

  run(memory: Memory): void {
    memory.setMask(this.mask);
  }
}

// noinspection RegExpRedundantEscape
class StoreValueInstruction extends Instruction {
  private readonly address: number;
  private readonly value: number;

  constructor(input: string) {
    super();
    const [, address, value] = input.match(/mem\[([0-9]+)\]\s=\s([0-9]+)/) ?? [];

    if (!address || !value) {
      throw new Error(`Could not parse input as StoreValueInstruction ("${input}").`);
    }

    this.address = Number.parseInt(address, 10);
    this.value = Number.parseInt(value, 10);
  }

  run(memory: Memory): void {
    memory.saveToMemory({ value: this.value, address: this.address });
  }
}

export abstract class InstructionFactory {
  /**
   * @param input Line of input to get the instruction for.
   * @returns Instruction for the given line.
   * @throws `Error` - The line could not be parsed to an instruction.
   */
  static generateInstruction(input: string): Instruction {
    const [type] = input.match(/^\w+/g) ?? [];

    switch (type) {
      case 'mask':
        return new SetMaskInstruction(input);
      case 'mem':
        return new StoreValueInstruction(input);
      default:
        throw new Error(`Could not parse type of input line "${input}".`);
    }
  }
}
