import { CalcMethod, CalcNode, InnerCalcNode } from '../tree/CalcNode';
import { TermParser } from './TermParser';

export class AdditionFirstTermParser extends TermParser {
  private currentRightIndex: number;

  constructor(term: string) {
    super(term);

    this.currentRightIndex = 0;
  }

  protected buildSubTreeFromSubTerms(): CalcNode {
    const subTerms: string[] = this.getSubterms();
    const indexesOfMultiply: number[] = [];
    subTerms.forEach((subTerm, idx) => subTerm === '*' && indexesOfMultiply.push(idx));

    if (indexesOfMultiply.length === 0) {
      return this.getSubTreeRoot(subTerms);
    }

    // Make sure to include the last step as well.
    indexesOfMultiply.unshift(-1);

    this.currentRightIndex = subTerms.length;
    let currentRoot: CalcNode | undefined = undefined;

    for (let i = indexesOfMultiply.length - 1; i >= 0; i--) {
      const index = indexesOfMultiply[i];

      if (!currentRoot) {
        currentRoot = new InnerCalcNode(CalcMethod.MULTIPLICATION);
      }

      currentRoot = this.adjustNodesForIndex(index, currentRoot);
    }

    if (!currentRoot) {
      throw new Error(`Could not build the tree from the given term.`);
    }

    return currentRoot;
  }

  /**
   * Inserts a new subtree into this tree using the `currentRoot` as current root.
   *
   * This might generate a new root, which is returned. If no new root is generated the old one is returned.
   *
   * @param index Index of the current '*' symbol (moving from high to low).
   * @param currentRoot Current root of the tree.
   * @private
   */
  private adjustNodesForIndex(index: number, currentRoot: CalcNode): CalcNode {
    const subList = this.getSubterms().slice(index + 1, this.currentRightIndex);
    this.currentRightIndex = index;

    if (!currentRoot.rightChild) {
      currentRoot.rightChild = this.getSubTreeRoot(subList);
    } else if (!currentRoot.leftChild) {
      currentRoot.leftChild = this.getSubTreeRoot(subList);
    } else {
      const parentNode: CalcNode = new InnerCalcNode(CalcMethod.MULTIPLICATION);
      parentNode.rightChild = currentRoot;
      parentNode.leftChild = this.getSubTreeRoot(subList);
      currentRoot = parentNode;
    }

    return currentRoot;
  }

  /**
   * Generates a subtree from the given subterms.
   *
   * Subterms must only contain **addition**.
   *
   * @param subTerms Subterms to use to generate the subtree.
   * @returns Root node of the subtree
   * @private
   */
  private getSubTreeRoot(subTerms: string[]): CalcNode {
    let currentRoot: CalcNode = new AdditionFirstTermParser(subTerms[0]).getRootOfTerm();

    // Starting at 1 because the first (0) entry must not be an arithmetic sign.
    for (let i = 1; i < subTerms.length; i = i + 2) {
      const subTerm = subTerms[i];

      switch (subTerm) {
        case '+':
          const node: CalcNode = new InnerCalcNode(CalcMethod.ADDITION);

          node.leftChild = currentRoot;
          node.rightChild = new AdditionFirstTermParser(subTerms[i + 1]).getRootOfTerm();

          currentRoot = node;
          break;

        case '*':
          throw new Error(
            'Within this building step no multiplication signs are allowed, only addition signs.'
          );

        default:
          throw new Error(
            `Subterm is not an arithmetic sign ("${subTerm}"). Maybe you forgot to advance the index by 2?`
          );
      }
    }

    return currentRoot;
  }
}
