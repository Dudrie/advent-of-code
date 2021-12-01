import { PuzzleSolver } from '../../util/PuzzleSolver';
import { BagList } from './BagList';

class PuzzleSolver07 extends PuzzleSolver {
  private readonly bags: BagList;

  constructor() {
    super(7);

    this.bags = new BagList();
    this.loadBags();
  }

  solve(): void {
    const shinyGoldBag = this.bags.getBag('shiny gold');
    const amountCanContainShinyGold: number = this.bags
      .getAllBags()
      .reduce((sum, bag) => (bag.contains(shinyGoldBag) ? sum + 1 : sum), 0);

    this.printSolution(amountCanContainShinyGold, 'A');
    this.printSolution(shinyGoldBag.bagsWithin(), 'B');
  }

  private loadBags() {
    const input = this.inputReader.getPuzzleInputSplitByLines();

    input.forEach((instruction) => {
      this.bags.addBag(instruction);
    });
  }
}

new PuzzleSolver07().solve();
