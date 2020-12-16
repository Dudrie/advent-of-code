import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Validator } from './Validator';
import { Ticket } from './Ticket';

interface ParsedInput {
  validatorInput: string[];
  myTicketInput: string;
  otherTicketsInput: string[];
}

class PuzzleSolver16 extends PuzzleSolver {
  private readonly validator: Validator;
  private readonly myTicket: Ticket;
  private readonly otherTickets: Ticket[];
  private readonly validTickets: Ticket[];

  constructor() {
    super(16);

    const input: ParsedInput = this.getParsedInput();
    this.validator = new Validator(input.validatorInput);
    this.myTicket = new Ticket(input.myTicketInput);
    this.otherTickets = input.otherTicketsInput.map((i) => new Ticket(i));
    this.validTickets = [];
  }

  solve(): void {
    this.solveA();
    this.solveB();
  }

  /**
   * Solves part A of the puzzle.
   *
   * It also fills the `validTickets` property of this object with all valid tickets.
   *
   * @private
   */
  private solveA(): void {
    const errorFields: number[] = [];

    for (const ticket of this.otherTickets) {
      const invalidFields: number[] = this.validator.getFieldsThatApplyToNowRule(ticket);

      if (invalidFields.length === 0) {
        this.validTickets.push(ticket);
      } else {
        errorFields.push(...invalidFields);
      }
    }

    this.printSolution(
      errorFields.reduce((sum, field) => sum + field, 0),
      'A'
    );
  }

  /**
   * Solves part B of the puzzle.
   * @private
   */
  private solveB(): void {
    this.validator.mapTickets(this.validTickets);
    const indexes = this.validator.getIndexesForNamesThatStartWith('departure');
    const product: number = indexes.reduce(
      (product, index) => product * this.myTicket.getValueOfField(index),
      1
    );
    this.printSolution(product, 'B');
  }

  /**
   * @returns Puzzle input parsed by usage.
   * @private
   */
  private getParsedInput(): ParsedInput {
    const [
      validatorInput,
      myLineInputWithHeader,
      otherTicketsWithHeader,
    ] = this.inputReader.getPuzzleInputGroupedByEmptyLines();

    return {
      validatorInput,
      myTicketInput: myLineInputWithHeader[1],
      otherTicketsInput: otherTicketsWithHeader.slice(1),
    };
  }
}

const time = Date.now();
new PuzzleSolver16().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
