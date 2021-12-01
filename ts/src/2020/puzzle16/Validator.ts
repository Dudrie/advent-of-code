import { Ticket } from './Ticket';
import { ValidationRule } from './ValidationRule';

export class Validator {
  private readonly rules: ValidationRule[];
  private readonly fieldMapping: Map<string, number[]>;

  constructor(input: readonly string[]) {
    this.rules = input.map((i) => new ValidationRule(i));
    this.fieldMapping = new Map();
  }

  /**
   * @param ticket Ticket to check the fields of.
   * @returns List of all values of the fields that are invalid.
   */
  getFieldsThatApplyToNowRule(ticket: Ticket): number[] {
    const invalidFields: number[] = [];

    for (const field of ticket.getFields()) {
      if (!this.isFieldValidForAnyRule(field)) {
        invalidFields.push(field);
      }
    }

    return invalidFields;
  }

  /**
   * Maps the fields according to the validation rules using the given tickets.
   *
   * @param tickets Tickets to use.
   */
  mapTickets(tickets: Ticket[]): void {
    const fieldCount: number = tickets[0].getFieldCount();

    for (const rule of this.rules) {
      for (let i = 0; i < fieldCount; i++) {
        if (rule.isValidForAllIthFields(i, tickets)) {
          const prevMapping: number[] = this.getMapping(rule.name);
          this.setMapping(rule.name, [...prevMapping, i]);
        }
      }
    }

    this.finalizeMapping();
  }

  /**
   * Finalizes mapping by diverging towards a state in which each rule has exactly one index mapped to it.
   *
   * This uses some kind of exclusive principle.
   *
   * @private
   */
  private finalizeMapping(): void {
    const otherMap: Map<string, number[]> = new Map(this.fieldMapping);

    while (otherMap.size > 0) {
      const smallestMapping: SmallestEntry = this.getSmallestMapping(otherMap);
      const indexes: number[] = this.getMapping(smallestMapping.name);
      const index: number = indexes[0];

      this.removeIndexFromAllMappings(index);
      this.setMapping(smallestMapping.name, [index]);
      otherMap.delete(smallestMapping.name);
    }
  }

  /**
   * @param map Map to find the entry with the shortest array value.
   * @returns Information about the entry with the shortest array in the given map.
   * @private
   */
  private getSmallestMapping(map: Map<string, number[]>): SmallestEntry {
    let smallestEntry: SmallestEntry = { name: '', value: [], length: Number.MAX_SAFE_INTEGER };

    for (const [name, mappings] of map.entries()) {
      if (mappings.length < smallestEntry.length) {
        smallestEntry = { name, value: mappings, length: mappings.length };
      }
    }

    return smallestEntry;
  }

  /**
   * Removes the given index from **all** mappings that currently have it.
   *
   * @param fieldIndex Index to remove from all mappings.
   * @private
   */
  private removeIndexFromAllMappings(fieldIndex: number): void {
    for (const [name, mappings] of this.fieldMapping.entries()) {
      const idx: number = mappings.indexOf(fieldIndex);
      if (idx !== -1) {
        const newMappings = [...mappings.slice(0, idx), ...mappings.slice(idx + 1)];
        this.setMapping(name, newMappings);
      }
    }
  }

  /**
   * @param prefix Prefix of the rule's name.
   * @returns List of indexes of the fields which rules start with the given prefix.
   */
  getIndexesForNamesThatStartWith(prefix: string): number[] {
    const indexes: number[] = [];

    for (const rule of this.rules) {
      if (rule.name.startsWith(prefix)) {
        indexes.push(...this.getMapping(rule.name));
      }
    }

    return indexes;
  }

  /**
   * Sets the mapping for the given name to the given indexes.
   *
   * @param fieldName Name of the field.
   * @param indexes Index of the field on the tickets.
   * @private
   */
  private setMapping(fieldName: string, indexes: number[]): void {
    this.fieldMapping.set(fieldName, indexes);
  }

  /**
   * @param fieldName
   * @returns Index of the field on the tickets that belong to the given name.
   * @private
   */
  private getMapping(fieldName: string): number[] {
    return this.fieldMapping.get(fieldName) ?? [];
  }

  /**
   * @param field Value of the field to check.
   * @returns True if the value is valid for at least one field.
   * @private
   */
  private isFieldValidForAnyRule(field: number): boolean {
    for (const rule of this.rules) {
      if (rule.isValid(field)) {
        return true;
      }
    }

    return false;
  }
}

interface SmallestEntry {
  readonly name: string;
  readonly length: number;
  readonly value: number[];
}
