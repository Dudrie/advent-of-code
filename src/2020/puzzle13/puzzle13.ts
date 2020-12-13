import { PuzzleSolver } from '../../util/PuzzleSolver';

class Bus {
  readonly id: number;
  readonly outOfOrder: boolean;

  constructor(idData: string) {
    this.id = Number.parseInt(idData, 10);
    this.outOfOrder = idData === 'x';
  }

  /**
   * @param currentTime Current time.
   * @returns Time until this bus departs measured from the current time.
   */
  getTimeTilDeparture(currentTime: number): number {
    return this.id - (currentTime % this.id);
  }
}

interface Congruence {
  readonly remainder: number;
  readonly modulus: number;
}

interface Solution {
  readonly a: number;
  readonly b: number;
  readonly factorA: number;
  readonly factorB: number;
}

class PuzzleSolver13 extends PuzzleSolver {
  private readonly buses: Bus[];
  private readonly earliestYouCouldDepart: number;

  constructor() {
    super(13);

    const [earliestInfo, busData] = this.inputReader.getPuzzleInputSplitByLines();
    this.buses = busData.split(',').map((b) => new Bus(b));
    this.earliestYouCouldDepart = Number.parseInt(earliestInfo, 10);
  }

  solve(): void {
    this.solveA();
    this.solveB();
  }

  private solveA() {
    let earliestBus: Bus | undefined = undefined;

    for (const bus of this.buses) {
      const currentEarliest: number =
        earliestBus?.getTimeTilDeparture(this.earliestYouCouldDepart) ?? Number.MAX_SAFE_INTEGER;
      const untilCurrentDeparts: number = bus.getTimeTilDeparture(this.earliestYouCouldDepart);

      if (untilCurrentDeparts < currentEarliest) {
        earliestBus = bus;
      }
    }

    if (!earliestBus) {
      throw new Error('Could not find a departing bus.');
    }

    this.printSolution(
      earliestBus.id * earliestBus.getTimeTilDeparture(this.earliestYouCouldDepart),
      'A'
    );
  }

  private solveB() {
    // We use that all IDs of the buses are actual prime numbers and therefore pairwise coprime.
    // We can then use the chinese remainder theorem to calculate the result.

    // I Setup the congruence system.
    const system: Congruence[] = this.generateCongruenceSystem();

    // II Multiply all prime numbers to get the modulus.
    const bigModulus: number = this.buses.reduce(
      (product, bus) => (bus.outOfOrder ? product : product * bus.id),
      1
    );

    // III Apply the extended euclidean algorithm on each congruence in the system.
    //     We need to use BigInts because the numbers of the live input are bigger than MAX_SAFE_INTEGER.
    let result: bigint = 0n;

    for (const congruence of system) {
      const { factorA: factorSubmodulus, a: subModulus } = this.useExtendedEuclideanAlgorithm(
        bigModulus / congruence.modulus,
        congruence.modulus
      );
      const ei: bigint = BigInt(factorSubmodulus * subModulus);

      result += BigInt(congruence.remainder) * ei;
    }

    const parsedResult: number = Number.parseInt((result % BigInt(bigModulus)).toString(10), 10);
    this.printSolution(this.convertRemainderToNonNegative(parsedResult, bigModulus), 'B');
  }

  /**
   * @returns Generated congruence system of all functioning (!) buses.
   * @private
   */
  private generateCongruenceSystem(): Congruence[] {
    const system: Congruence[] = [];

    for (let i = 0; i < this.buses.length; i++) {
      const bus = this.buses[i];
      if (!bus.outOfOrder) {
        system.push({ modulus: bus.id, remainder: this.convertRemainderToNonNegative(-i, bus.id) });
      }
    }

    return system;
  }

  /**
   * Calculates the first non-negative representation of the given remainder for the given modulus.
   *
   * @param remainder Remainder to the representation of.
   * @param modulus Modulus.
   * @returns First non-negative representation.
   * @private
   */
  private convertRemainderToNonNegative(remainder: number, modulus: number): number {
    let current = remainder;

    while (current < 0) {
      current += modulus;
    }

    return current;
  }

  /**
   * Calculates the factors of the following equation:
   *
   * factorA * a + factorB * b = 1
   *
   * This is done by using the extended euclidean algorithm.
   *
   * Please note that the call of this function is commutative, so the order in which a and b are provided does **not** matter.
   *
   * @param a First number.
   * @param b Second number.
   * @returns The factors `factorA` and `factorB` of the above equation.
   * @private
   */
  private useExtendedEuclideanAlgorithm(a: number, b: number): Solution {
    if (Number.isNaN(a) || Number.isNaN(b)) {
      throw new Error(`One of the given numbers is NaN (a=${a}, b=${b})`);
    }

    if (a < b) {
      throw new Error(`The first number must be the higher one (a=${a}, b=${b})`);
    }

    // Make sure the call is commutative.
    let dividend: number = a;
    let remainder: number = b;

    // Equation in each step: factorA * a + factorB * b = remainder
    let factorA: number = 0;
    let factorB: number = 1;

    // Save the numbers from the last call.
    let prevFactorA: number = 1;
    let prevFactorB: number = 0;

    while (remainder !== 0) {
      const quotient = Math.floor(dividend / remainder);
      const oldDividend = dividend;
      const tmpFactorA = prevFactorA;
      const tmpFactorB = prevFactorB;

      dividend = remainder;
      remainder = oldDividend - quotient * remainder;

      prevFactorA = factorA;
      factorA = tmpFactorA - quotient * factorA;

      prevFactorB = factorB;
      factorB = tmpFactorB - quotient * factorB;
    }

    console.log(`Euclidean with a = ${a} and b = ${b}`);
    console.log(`\tResult: ${prevFactorA} * ${a} + ${prevFactorB} * ${b} = 1`);

    return {
      a,
      b,
      factorA: prevFactorA,
      factorB: prevFactorB,
    };
  }
}

const time = Date.now();
new PuzzleSolver13().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
