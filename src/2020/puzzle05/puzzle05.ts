import { PuzzleSolver } from '../../util/PuzzleSolver';

class PuzzleSolver05 extends PuzzleSolver {
  private readonly seatIDs: number[];

  constructor() {
    super(5);

    this.seatIDs = [];
    this.loadSeats();
  }

  solve(): void {
    const max = this.seatIDs[this.seatIDs.length - 1];

    this.printSolution(max, 'A');
    this.printSolution(this.getMySeatId(), 'B');
  }

  /**
   * Load the seats and save the IDs in the `seat` property of this object.
   *
   * The seats are sorted ascending.
   */
  private loadSeats(): void {
    const input: string[] = this.inputReader.getPuzzleInputSplitByLines();
    const seats: number[] = [...input.map(this.convertSeatIdToBinary)].sort((a, b) => a - b);
    this.seatIDs.push(...seats);
  }

  /**
   * @returns ID of my seat.
   */
  private getMySeatId(): number {
    for (let i = 1; i < this.seatIDs.length; i++) {
      const first = this.seatIDs[i - 1];
      const second = this.seatIDs[i];

      // If the two seats in the list have a difference of two our seat is in the middle bc the list is sorted.
      if (second - first === 2) {
        return first + 1;
      }
    }

    throw new Error('Seat could not be found.');
  }

  /**
   * @param id ID on the boarding pass.
   * @returns ID as decimal number.
   */
  private convertSeatIdToBinary(id: string): number {
    const binary = id.replace(/F|L/g, '0').replace(/B|R/g, '1');

    return Number.parseInt(binary, 2);
  }
}

new PuzzleSolver05().solve();
