import { PuzzleSolver } from '../../util/PuzzleSolver';

interface Size {
  readonly rows: number;
  readonly columns: number;
}

/**
 * Vector to describe a movement / translation.
 */
class Vector {
  constructor(readonly right: number, readonly down: number) {}

  toString(): string {
    return `(${this.right},${this.down})`;
  }
}

/**
 * Generic location object to track the position of things.
 */
class Location {
  constructor(readonly x: number, readonly y: number) {}

  add(vector: Vector): Location {
    return new Location(this.x + vector.right, this.y + vector.down);
  }
}

class TreeMap {
  private readonly input: string[];

  /**
   * Size of the map.
   */
  readonly size: Size;

  /**
   * Parsed map.
   *
   * First index is Y and the second index is X.
   */
  private readonly map: string[][];

  constructor(inputByLines: string[]) {
    this.input = inputByLines;
    this.map = [];
    this.size = this.getMapSize(inputByLines);

    this.loadMap();
  }

  private loadMap(): void {
    for (let y = 0; y < this.input.length; y++) {
      const symbols = this.input[y].split('');

      for (let x = 0; x < symbols.length; x++) {
        this.setMapSymbol(new Location(x, y), symbols[x]);
      }
    }
  }

  private getMapSize(inputByLines: string[]): Size {
    const rows = inputByLines.length;
    const columns = inputByLines[0].length;

    return { rows, columns };
  }

  private setMapSymbol(location: Location, symbol: string): void {
    const { x, y } = location;

    if (!this.map[y]) {
      this.map[y] = [];
    }

    this.map[y][x] = symbol;
  }

  /**
   * Returns the symbol of the given location.
   *
   * If the location would be outside the current map to the right the map gets repeated in this direction.
   *
   * @param location Location to get the symbol of.
   *
   * @returns Symbol at the location (or '§' if there is no symbol).
   */
  getMapSymbol(location: Location): string {
    const { columns } = this.size;
    const { x, y } = location;

    return this.map[y][x % columns] ?? '§';
  }
}

class PuzzleDay03 extends PuzzleSolver {
  private readonly map: TreeMap;
  private readonly slopeForA: Vector;
  private readonly slopeList: Vector[];

  constructor() {
    super(3);

    this.map = new TreeMap(this.inputReader.getPuzzleInputSplitByLines());
    this.slopeList = [
      new Vector(1, 1),
      new Vector(3, 1),
      new Vector(5, 1),
      new Vector(7, 1),
      new Vector(1, 2),
    ];
    this.slopeForA = this.slopeList[1];
  }

  solve() {
    const treeCountPerSlope: Map<string, number> = new Map();

    for (const slope of this.slopeList) {
      let treeCount: number = 0;
      let currentPosition: Location = new Location(0, 0);

      while (currentPosition.y < this.map.size.rows) {
        const symbol = this.map.getMapSymbol(currentPosition);

        if (symbol === '#') {
          treeCount++;
        }

        currentPosition = currentPosition.add(slope);
      }

      treeCountPerSlope.set(slope.toString(), treeCount);
    }

    this.printSolution(treeCountPerSlope.get(this.slopeForA.toString()) ?? -1, 'A');
    this.printSolution(
      [...treeCountPerSlope.values()].reduce((prev, current) => prev * current, 1),
      'B'
    );
  }
}

new PuzzleDay03().solve();
