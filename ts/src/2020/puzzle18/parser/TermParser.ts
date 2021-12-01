import { CalcMethod, CalcNode, LeafNode } from '../tree/CalcNode';

export abstract class TermParser {
  private readonly term: string;
  private readonly subTerms: string[];
  private readonly root: CalcNode;

  private bracketDepth: number;
  private outerLeftBracketPosition: number;
  private lastArithmeticSign: number;

  constructor(term: string) {
    if (!term) {
      throw new Error(`Term is undefined or empty.`);
    }

    this.term = term.replace(/\s/g, '');
    this.subTerms = [];
    this.bracketDepth = 0;
    this.outerLeftBracketPosition = -1;
    this.lastArithmeticSign = -1;
    this.root = this.parseTerm();
  }

  /**
   * @returns Root of the given term.
   */
  getRootOfTerm(): CalcNode {
    return this.root;
  }

  /**
   * Builds the subtree from the subterms loaded inside this parser.
   *
   * The subterms MUST be loaded before building the tree!
   *
   * @protected
   */
  protected abstract buildSubTreeFromSubTerms(): CalcNode;

  /**
   * @returns A copy of the generated subterms.
   * @protected
   */
  protected getSubterms(): string[] {
    return [...this.subTerms];
  }

  /**
   * @param symbol Symbol to get associated method for.
   * @returns Calculation method for the given symbol.
   * @throws `Error` - If the symbol has no associated calculation method.
   * @private
   */
  protected getCalcMethodForSymbol(symbol: string): CalcMethod {
    switch (symbol) {
      case '+':
        return CalcMethod.ADDITION;
      case '*':
        return CalcMethod.MULTIPLICATION;
      default:
        throw new Error(`Symbol "${symbol}" is not supported.`);
    }
  }

  /**
   * Parses the given algebraic term and returns the root node of the sub tree.
   * @private
   */
  private parseTerm(): CalcNode {
    // console.log(`Parsing term: "${term}"`);
    const isNumberCondition: RegExp = /^[0-9]+$/;

    // If "term" is only a single number, we are at a leaf.
    if (isNumberCondition.test(this.term)) {
      return new LeafNode(Number.parseInt(this.term, 10));
    }

    for (let pos = 0; pos < this.term.length; pos++) {
      const symbol: string = this.term.charAt(pos);
      const isNumber: boolean = isNumberCondition.test(symbol);

      // Ignore all number symbols except the last one.
      if (isNumber && pos === this.term.length - 1) {
        this.subTerms.push(symbol);
      } else if (!isNumber) {
        this.handleNonNumberSymbol(symbol, pos);
      }
    }

    return this.buildSubTreeFromSubTerms();
  }

  /**
   * Handles the non number symbol at the given position.
   *
   * If necessary a new subterm is added to the list of subterms of this parser.
   *
   * @param symbol Symbol to handle.
   * @param currentPos Position of the symbol within the term.
   * @private
   */
  private handleNonNumberSymbol(symbol: string, currentPos: number): void {
    switch (symbol) {
      case '+':
      case '*':
        this.handleArithmeticSign(symbol, currentPos);
        break;

      case '(':
        this.handleOpeningBracket(currentPos);
        break;

      case ')':
        this.handleClosingBracket(currentPos);
        break;

      default:
        throw new Error(`Symbol "${symbol}" is not supported.`);
    }
  }

  /**
   * Handles an arithmetic sign ('+' / '*') and adjusts the generated subterms as necessary.
   *
   * @param symbol Arithmetic sign.
   * @param currentPos Position of the given sign inside the term.
   * @private
   */
  private handleArithmeticSign(symbol: string, currentPos: number): void {
    // Only add subterms if we are NOT within brackets and it is NOT the sign directly after a closing bracket.
    if (this.bracketDepth === 0) {
      if (this.term.charAt(currentPos - 1) !== ')') {
        this.subTerms.push(this.term.substring(this.lastArithmeticSign + 1, currentPos));
      }

      this.subTerms.push(symbol);
      this.lastArithmeticSign = currentPos;
    }
  }

  /**
   * Handles all things that must be changed if an opening bracket is encountered inside the term.
   *
   * If it is the first opening bracket encountered (in general or after reaching the last closing bracket) the `outerLeftBracketPosition` tracker is set accordingly.
   *
   * @param currentPos Position of the opening bracket in the term.
   * @private
   */
  private handleOpeningBracket(currentPos: number): void {
    if (this.bracketDepth === 0) {
      this.outerLeftBracketPosition = currentPos;
    }

    this.bracketDepth++;
  }

  /**
   * Handles a closing bracket found in the term.
   *
   * If the closing bracket closes the section of the outer left bracket a corresponding subterm gets added to the list of subterms. Otherwise only the bracket counter decreases.
   *
   * @param currentPos Position of the closing bracket.
   * @throw `Error` - If there are more closing than opening brackets inside the term.
   * @private
   */
  private handleClosingBracket(currentPos: number): void {
    this.bracketDepth--;

    if (this.bracketDepth === 0) {
      const termBetweenBrackets: string = this.term.substring(
        this.outerLeftBracketPosition + 1,
        currentPos
      );
      this.subTerms.push(termBetweenBrackets);
    } else if (this.bracketDepth < 0) {
      throw new Error(`Term has more closing brackets than opening brackets.`);
    }
  }
}
