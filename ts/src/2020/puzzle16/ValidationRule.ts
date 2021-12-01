import { Ticket } from './Ticket';

interface ValidRange {
  readonly min: number;
  readonly max: number;
}

export class ValidationRule {
  private readonly validRanges: ValidRange[];
  readonly name: string;

  constructor(input: string) {
    const [name, ranges] = input.split(':').map((s) => s.trim());
    const [rangeA, rangeB] = ranges.split('or').map((s) => s.trim());

    this.name = name;
    this.validRanges = [this.getRangeFromInput(rangeA), this.getRangeFromInput(rangeB)];
  }

  /**
   * @param value Value to check.
   * @returns True if the given number conforms to this rule.
   */
  isValid(value: number): boolean {
    return this.validRanges.reduce<boolean>(
      (isValid, { min, max }) => isValid || (min <= value && value <= max),
      false
    );
  }

  /**
   * @param i Index of the field.
   * @param tickets Tickets to check.
   * @returns True if all fields at the i-th index of all given tickets are valid considering this rule.
   */
  isValidForAllIthFields(i: number, tickets: Ticket[]): boolean {
    for (const ticket of tickets) {
      if (!this.isValid(ticket.getValueOfField(i))) {
        return false;
      }
    }

    return true;
  }

  private getRangeFromInput(rangeInput: string): ValidRange {
    const [min, max] = rangeInput.split('-');
    return { min: Number.parseInt(min, 10), max: Number.parseInt(max, 10) };
  }
}
