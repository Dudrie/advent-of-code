import { Rule, RuleMatching, RuleMatchResult } from './Rule';

/**
 * Test the left and right rule separately
 */
export class OrRule extends Rule {
  constructor(id: number, private readonly left: Rule, private readonly right: Rule) {
    super(id);
  }

  test(text: string, start: number): RuleMatchResult {
    const resultLeft = this.left.test(text, start);
    const resultRight = this.right.test(text, start);

    if (resultLeft.isMatching && resultRight.isMatching) {
      return {
        isMatching: true,
        endPositions: [...new Set([...resultLeft.endPositions, ...resultRight.endPositions])],
      };
    } else if (this.isLeftButNotRightMatching(resultLeft, resultRight)) {
      return { isMatching: true, endPositions: resultLeft.endPositions };
    } else if (this.isRightButNotLeftMatching(resultLeft, resultRight)) {
      return { isMatching: true, endPositions: resultRight.endPositions };
    } else {
      return { isMatching: false };
    }
  }

  private isLeftButNotRightMatching(
    resultLeft: RuleMatchResult,
    resultRight: RuleMatchResult
  ): resultLeft is RuleMatching {
    return resultLeft.isMatching && !resultRight.isMatching;
  }

  private isRightButNotLeftMatching(
    resultLeft: RuleMatchResult,
    resultRight: RuleMatchResult
  ): resultRight is RuleMatching {
    return !resultLeft.isMatching && resultRight.isMatching;
  }
}
