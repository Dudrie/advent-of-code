import { BagList } from './BagList';

interface ContainingBagInformation {
  bag: Bag;
  amount: number;
}

/**
 * Information about a bag.
 */
export class Bag {
  /** Color of this bag. */
  readonly bagColor: string;

  /**
   * Specifies how often this bag can hold bags of another color.
   */
  readonly containingBags: ContainingBagInformation[];

  private readonly bagList: BagList;

  /**
   * Loads the bag from the given data.
   *
   * The data must have the following form:
   *
   * <bagColor> bags contain <bagList> with
   * <bagList>: <amount> <bagColor> bags, <amount> <bagColor> bags, ...
   *
   * @param data Data to load the bag from.
   */
  constructor(data: string, bagList: BagList) {
    const [bagColorData, containingList] = data.split('contain');

    this.bagColor = Bag.getColorFromData(bagColorData);
    this.containingBags = [];
    this.bagList = bagList;

    this.loadContainingBags(containingList);
  }

  /**
   * Updates the bag from the given data.
   *
   * **Please note: Only the containing information will be updated.**
   *
   * The data must have the following form:
   *
   * <bagColor> bags contain <bagList> with
   * <bagList>: <amount> <bagColor> bags, <amount> <bagColor> bags, ...
   *
   * @param data Data to load the bag from.
   */
  updateBag(data: string): void {
    const [, containingList] = data.split('contain');

    this.loadContainingBags(containingList);
  }

  /**
   * @param bag Bag to check
   * @returns True if this bag (or a bag this bag can hold) can hold the given bag.
   */
  contains(bag: Bag): boolean {
    for (const info of this.containingBags) {
      if (info.bag.bagColor === bag.bagColor) {
        return true;
      }
    }

    for (const info of this.containingBags) {
      const isInnerBag = info.bag.contains(bag);

      if (isInnerBag) {
        return true;
      }
    }

    return false;
  }

  /**
   * @returns The total sum of all bags in this bag.
   */
  bagsWithin(): number {
    const sum: number = this.containingBags.reduce((innerSum, info) => {
      const bagsInInnerBag: number = info.bag.bagsWithin();

      return innerSum + info.amount + bagsInInnerBag * info.amount;
    }, 0);

    return sum;
  }

  private loadContainingBags(containingList: string): void {
    if (!containingList) {
      return;
    }

    containingList
      .split(',')
      .map((info) => info.trim())
      .map(this.getContainingInfo.bind(this))
      .forEach((info) => !!info && this.containingBags.push(info));
  }

  /**
   *
   * @param data Data which contains the information in the form "<amount> <hue> <color> bags(.)"
   * @returns Information about the containing bag.
   */
  private getContainingInfo(data: string): ContainingBagInformation | undefined {
    const [amount, hue, color] = data.split(/\s/g);

    if (amount === 'no') {
      return undefined;
    }

    const bagColor = `${hue} ${color}`;

    return {
      bag: this.bagList.getBag(bagColor),
      amount: Number.parseInt(amount, 10),
    };
  }

  /**
   * @param data Data in the form "<hue> <color> bags"
   *
   * @returns A unified string in the form "<hue> <color>""
   */
  static getColorFromData(data: string): string {
    return data.split(/\s/).slice(0, 2).join(' ');
  }

  toString(): string {
    const bags = this.containingBags;
    const contentInfo: string =
      bags.length > 0
        ? bags.map(({ bag, amount }) => bag.bagColor + ': ' + amount + '\n').join('\t')
        : 'Does not contain any bags.\n';

    return `Bag Instructions for: ${this.bagColor}
    \t${contentInfo}`;
  }
}
