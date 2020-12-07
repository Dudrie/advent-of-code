import { Bag } from './Bag';

export class BagList {
  private readonly bags: Map<string, Bag>;

  constructor() {
    this.bags = new Map();
  }

  /**
   * Adds a bag with the given data to this list.
   *
   * If this list already contains a bag with the given color that bag is updated instead.
   *
   * @param bagData Data of the bag to add
   */
  addBag(bagData: string): void {
    let bag = this.bags.get(Bag.getColorFromData(bagData));

    if (bag) {
      bag.updateBag(bagData);
    } else {
      bag = new Bag(bagData, this);
      this.bags.set(bag.bagColor, bag);
    }
  }

  /**
   * Returns the bag with the given color saved in this list.
   *
   * If there is no bag with the given color a new one is created and returned instead.
   *
   * @param color Color of the bag
   * @returns The bag in this list of the given color.
   */
  getBag(color: string): Bag {
    const bag = this.bags.get(color);

    if (!bag) {
      const newBag = new Bag(color, this);
      this.bags.set(newBag.bagColor, newBag);

      return newBag;
    }

    return bag;
  }

  /**
   * @returns A copy of the list of all bags this BagList contains.
   */
  getAllBags(): readonly Bag[] {
    return [...this.bags.values()];
  }

  /**
   * Prints the bag list in a readable manner.
   *
   * Should only be used for debugging.
   */
  printBagList(): void {
    for (const bag of this.bags.values()) {
      console.log(bag.toString());
    }
  }
}
