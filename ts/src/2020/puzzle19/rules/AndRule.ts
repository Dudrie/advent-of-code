/**
 * Tests the given rules in the order they are given within the array.
 */
import { Rule, RuleMatchResult } from './Rule';

export class AndRule extends Rule {
  constructor(id: number, private readonly rules: Rule[]) {
    super(id);

    if (rules.length === 0) {
      throw new Error('At least one rule must be provided for this rule.');
    }
  }

  test(text: string, start: number): RuleMatchResult {
    let currentStart: number = start;

    for (const rule of this.rules) {
      if (currentStart >= text.length) {
        return { isMatching: false };
      }

      const result = rule.test(text, currentStart);

      if (!result.isMatching) {
        return { isMatching: false };
      }

      if (result.endPositions.length > 1) {
        throw new Error('Sub rules must only return one end position.');
      }

      currentStart = result.endPositions[0] + 1;
    }

    return { isMatching: true, endPositions: [currentStart - 1] };
  }
}
