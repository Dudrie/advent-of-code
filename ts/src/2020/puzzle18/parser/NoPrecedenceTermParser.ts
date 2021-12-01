import { CalcNode, InnerCalcNode } from '../tree/CalcNode';
import { TermParser } from './TermParser';

export class NoPrecedenceTermParser extends TermParser {
  protected buildSubTreeFromSubTerms(): CalcNode {
    const subTerms: string[] = this.getSubterms();
    let currentRoot: CalcNode = new NoPrecedenceTermParser(subTerms[0]).getRootOfTerm();

    // Starting at 1 because the first (0) entry must not be an arithmetic sign.
    for (let i = 1; i < subTerms.length; i = i + 2) {
      const subTerm = subTerms[i];

      switch (subTerm) {
        case '+':
        case '*':
          const node: CalcNode = new InnerCalcNode(this.getCalcMethodForSymbol(subTerm));

          node.leftChild = currentRoot;
          node.rightChild = new NoPrecedenceTermParser(subTerms[i + 1]).getRootOfTerm();

          currentRoot = node;
          break;

        default:
          throw new Error(
            `Subterm is not an arithmetic sign ("${subTerm}"). Maybe you forgot to advance the index by 2?`
          );
      }
    }

    return currentRoot;
  }
}
