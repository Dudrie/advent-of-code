import { CalcNode } from './CalcNode';
import { NoPrecedenceTermParser } from '../parser/NoPrecedenceTermParser';
import { AdditionFirstTermParser } from '../parser/AdditionFirstTermParser';

export enum CalcTreeMode {
  NO_PRECEDENCE = 'NO_PRECEDENCE',
  ADDITION_FIRST = 'ADDITION_FIRST',
}

export class CalcTree {
  private root: CalcNode;

  constructor(term: string, mode: CalcTreeMode) {
    switch (mode) {
      case CalcTreeMode.NO_PRECEDENCE:
        this.root = new NoPrecedenceTermParser(term).getRootOfTerm();

        break;
      case CalcTreeMode.ADDITION_FIRST:
        this.root = new AdditionFirstTermParser(term).getRootOfTerm();
        break;

      default:
        throw new Error(`Mode ${mode} is not supported.`);
    }
  }

  /**
   * @returns Calculation result of the algebraic term represented by this tree.
   */
  calcResult(): number {
    return this.root.calcResult();
  }
}
