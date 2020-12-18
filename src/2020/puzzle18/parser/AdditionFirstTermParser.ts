import { CalcNode } from '../tree/CalcNode';
import { TermParser } from './TermParser';

export class AdditionFirstTermParser extends TermParser {
  protected buildSubTreeFromSubTerms(): CalcNode {
    throw new Error('Not implemented');
  }
}
