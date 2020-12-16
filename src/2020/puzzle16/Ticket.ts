export class Ticket {
  private readonly fields: Map<number, number>;

  constructor(input: string) {
    this.fields = new Map();

    input.split(',').forEach((i, idx) => this.fields.set(idx, Number.parseInt(i, 10)));
  }

  /**
   * @param index Index of the field to get the value of.
   * @returns Value of the field at the given index.
   * @throw `Error` - If there is no field at the given index.
   */
  getValueOfField(index: number): number {
    const value: number | undefined = this.fields.get(index);

    if (value !== undefined) {
      return value;
    } else {
      throw new Error(`No value saved for field with index ${index}.`);
    }
  }

  /**
   * @returns A copy of the values of the fields of this ticket.
   */
  getFields(): number[] {
    return [...this.fields.values()];
  }

  /**
   * @returns Number of fields on the ticket.
   */
  getFieldCount(): number {
    return this.fields.size;
  }
}
