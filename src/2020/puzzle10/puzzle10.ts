import { PuzzleSolver } from '../../util/PuzzleSolver';

class Adapter {
  /** All adapters this adapter can connect to. */
  private readonly canConnectTo: Set<Adapter>;

  /** Joltage of this adapter. */
  readonly joltage: number;

  /** The amount of possible successor paths. */
  private possibleSuccessorPaths: number | undefined;

  constructor(info: string) {
    this.joltage = Number.parseInt(info, 10);
    this.canConnectTo = new Set();
  }

  addConnector(adapter: Adapter): void {
    this.canConnectTo.add(adapter);
  }

  /**
   * Calculates the amount of paths starting at this adapter.
   *
   * It uses a dynamic programming solution: Once the number of possible paths is calculated it is stored and returned on later calls of this function.
   */
  getPossibleSuccessorPathCount(): number {
    if (this.possibleSuccessorPaths !== undefined) {
      return this.possibleSuccessorPaths;
    }

    if (this.canConnectTo.size === 0) {
      // If the adapter can not be connected to a next adapter it is the end of a unique path. So we return 1.
      return 1;
    }

    let possiblePaths: number = 0;

    for (const adapter of this.canConnectTo.values()) {
      possiblePaths += adapter.getPossibleSuccessorPathCount();
    }

    this.possibleSuccessorPaths = possiblePaths;
    return possiblePaths;
  }
}

class PuzzleSolver10 extends PuzzleSolver {
  /** Adapters by joltages for easier access for part B */
  private readonly adaptersByJoltage: Map<number, Adapter>;

  /**
   * All adapters **in our bag** and the device.
   *
   * This does **NOT** include the charging outlet.
   *
   */
  private readonly adapters: Adapter[];

  constructor() {
    super(10);

    this.adapters = [];
    this.adaptersByJoltage = new Map();
    this.loadAdapters();
  }

  solve(): void {
    const differences: { [k: number]: number } = {};
    let currentAdapter: Adapter = this.adaptersByJoltage.get(0) ?? new Adapter('0');

    for (const adapter of this.adapters) {
      const diff = adapter.joltage - currentAdapter.joltage;

      if (diff > 3) {
        throw new Error(
          `Could not find a suitable follow up adapter for joltage ${currentAdapter.joltage}`
        );
      }

      currentAdapter = adapter;
      differences[diff] = (differences[diff] ?? 0) + 1;
    }

    const possibleDistinctPaths = this.adaptersByJoltage.get(0)?.getPossibleSuccessorPathCount();

    this.printSolution(differences[1] * differences[3], 'A');
    this.printSolution(possibleDistinctPaths ?? -1, 'B');
  }

  /**
   * Loads the adapters and builds a "directed graph" where each adapter knows it's possible successors.
   */
  private loadAdapters(): void {
    const chargingOutlet: Adapter = new Adapter('0');
    this.adapters.push(
      ...this.inputReader
        .getPuzzleInputSplitByLines()
        .map((i) => new Adapter(i))
        .sort((a, b) => a.joltage - b.joltage)
    );
    const highestJoltage: number = this.adapters[this.adapters.length - 1].joltage;

    // Add the charging outlet and our device.
    this.adaptersByJoltage.set(0, chargingOutlet);
    this.adapters.push(new Adapter((highestJoltage + 3).toString(10)));

    // Build "graph"
    for (const adapter of this.adapters) {
      this.adaptersByJoltage.set(adapter.joltage, adapter);

      for (let joltage = adapter.joltage - 1; joltage >= adapter.joltage - 3; joltage--) {
        this.adaptersByJoltage.get(joltage)?.addConnector(adapter);
      }
    }
  }
}

new PuzzleSolver10().solve();
