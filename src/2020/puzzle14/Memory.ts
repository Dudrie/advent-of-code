export abstract class Memory {
  protected static readonly BIT_LENGTH: number = 36;

  private readonly memory: { [key: number]: number };
  private mask: string;

  protected constructor() {
    this.mask = '';
    this.memory = {};
  }

  /**
   * @param mask New mask used for further operations.
   */
  setMask(mask: string): void {
    this.assertValidMask(mask);
    this.mask = mask;
  }

  /**
   * Saves the given value to the given address in the memory.
   *
   * @param value Value to save.
   * @param address Address to save it to.
   */
  saveToMemory({ value, address }: SaveParams): void {
    this.memory[address] = value;
  }

  /**
   * @returns Sum of all values currently saved in this memory.
   */
  getSumOfValues(): number {
    return Object.values(this.memory).reduce((sum, val) => sum + val, 0);
  }

  /**
   * @param value Value to convert.
   * @returns Array containing the 'digits' of the binary representation of the given value.
   * @protected
   */
  protected convertValueToBinary(value: number): string[] {
    return value.toString(2).padStart(Memory.BIT_LENGTH, '0').split('');
  }

  /**
   * @param binary Binary to convert to an integer.
   * @returns Integer value of the given binary representation.
   * @protected
   */
  protected convertBinaryToValue(binary: string[]): number {
    return Number.parseInt(binary.join(''), 2);
  }

  /**
   * @returns Current mask.
   * @protected
   */
  protected getMask(): string {
    return this.mask;
  }

  private assertValidMask(mask: string): void {
    if (mask.length !== Memory.BIT_LENGTH) {
      throw new Error(`Mask "${mask}" has not a length of 36.`);
    }
  }
}

export class MemoryPartA extends Memory {
  constructor() {
    super();
  }

  /**
   * Saves the given value to the given address in the memory.
   *
   * @param value Value to save.
   * @param address Address to save it to.
   */
  saveToMemory({ value, address }: SaveParams): void {
    const binaryRepresentation: string[] = this.convertValueToBinary(value);
    const mask: string = this.getMask();

    for (let pos = 0; pos < mask.length; pos++) {
      const maskChar: string = mask.charAt(pos);

      switch (maskChar) {
        case '0':
          binaryRepresentation[pos] = '0';
          break;
        case '1':
          binaryRepresentation[pos] = '1';
          break;
        case 'X':
          break;
        default:
          throw new Error(`Mask character "${maskChar}" is not supported.`);
      }

      super.saveToMemory({
        address,
        value: this.convertBinaryToValue(binaryRepresentation),
      });
    }
  }
}

export class MemoryPartB extends Memory {
  constructor() {
    super();
  }

  /**
   * Saves the given value to the given address in the memory.
   *
   * @param value Value to save.
   * @param address Address to save it to.
   */
  saveToMemory({ value, address }: SaveParams): void {
    const binaryRepresentation: string[] = this.convertValueToBinary(address);
    const addresses: number[] = this.getAddresses(binaryRepresentation, 0).map((address) =>
      this.convertBinaryToValue(address)
    );

    for (const address of addresses) {
      super.saveToMemory({ value, address });
    }
  }

  /**
   * Calculates all addresses that should be used to save the current value.
   *
   * This is done according to the rules in part 2.
   *
   * @param currentAddress Current state of the address.
   * @param position Position to start calculating at (inclusive).
   * @returns List containing all addresses for this (sub)path.
   * @private
   */
  private getAddresses(currentAddress: string[], position: number): string[][] {
    const copyOfAddress: string[] = [...currentAddress];
    const newAddresses: string[][] = [];

    for (let i = position; i < currentAddress.length; i++) {
      const maskChar: string = this.getMask().charAt(i);

      switch (maskChar) {
        case '0':
          break;
        case '1':
          copyOfAddress[i] = '1';
          break;
        case 'X':
          const addressesWithZero: string[][] = this.getAddresses(
            this.replaceValueInArray(i, '0', copyOfAddress),
            i + 1
          );
          const addressesWithOne: string[][] = this.getAddresses(
            this.replaceValueInArray(i, '1', copyOfAddress),
            i + 1
          );

          newAddresses.push(...addressesWithZero, ...addressesWithOne);
          return newAddresses;
        default:
          throw new Error(`Mask character "${maskChar}" is not supported.`);
      }
    }

    return [copyOfAddress];
  }

  /**
   * This just replaces a value in an array.
   *
   * Why one needs a function for this you might ask? First, the array gets copied, so it can be reused in recursive functions. Second, one can replace a value in one line - which makes the above code more readable.
   *
   * @param position Position to set the value at.
   * @param value Value to set at the given position.
   * @param array Original array.
   * @returns Copy the array but with the value put in.
   * @private
   */
  private replaceValueInArray(position: number, value: string, array: string[]): string[] {
    const copy: string[] = [...array];
    copy[position] = value;

    return copy;
  }
}

interface SaveParams {
  value: number;
  address: number;
}
