import { getLinesOfInput, readPuzzleInput } from '../util/PuzzleInputReader';
import _ from 'lodash';

class Galaxy {
  private orbits: { [planet: string]: string | undefined } = {};

  constructor(readonly input: string[]) {
    this.buildOrbits(input);
  }

  getOrbitCount(): number {
    return Object.entries(this.orbits)
      .map(([_, value]) => {
        let count = 0;
        let currentOuter = value;

        while (!!currentOuter) {
          count++;
          currentOuter = this.getInner(currentOuter);
        }

        return count;
      })
      .reduce((sum, curr) => sum + curr, 0);
  }

  getOrbitTransfers(): number {
    const orbitsOfYou = this.getAllOrbitsToCOM('YOU');
    const orbitsOfSanta = this.getAllOrbitsToCOM('SAN');

    // We take all orbits that are the same. The first of those is the one where we have to change "directions".
    const commonOrbits = _.intersection(orbitsOfYou, orbitsOfSanta);
    const firstMeet = commonOrbits[0];

    // We are subtracting one because we don't count the first transistion like "YOU -> A".
    const distanceFromYou = orbitsOfYou.indexOf(firstMeet) - 1;
    const distanceFromSanta = orbitsOfSanta.indexOf(firstMeet) - 1;

    return distanceFromYou + distanceFromSanta;
  }

  private getAllOrbitsToCOM(start: string): string[] {
    const orbits: string[] = [];
    let currentOrbit: string | undefined = start;

    while (!!currentOrbit) {
      orbits.push(currentOrbit);
      currentOrbit = this.getInner(currentOrbit);
    }

    return orbits;
  }

  private buildOrbits(input: string[]) {
    input
      .map((instruction) => instruction.split(')'))
      .forEach(([inner, outer]) => {
        this.addOrbit(inner, outer);
      });
  }

  private addOrbit(inner: string, outer: string) {
    this.orbits[outer] = inner;

    if (!this.orbits[inner]) {
      this.orbits[inner] = undefined;
    }
  }

  private getInner(outer: string): string | undefined {
    return this.orbits[outer];
  }
}

const input = getLinesOfInput(readPuzzleInput(6));
const galaxy = new Galaxy(input);

console.log(`A: Orbit count = ${galaxy.getOrbitCount()}`);

console.log(`B: Orbit transfers = ${galaxy.getOrbitTransfers()}`);
