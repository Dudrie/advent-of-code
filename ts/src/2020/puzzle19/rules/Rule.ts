export abstract class Rule {
  constructor(readonly id: number) {}

  /**
   * Tests if the rule applies to the given text (or a portion of it).
   *
   * It starts checking from the given starting position. An object containing the results is returned.
   *
   * @param text Text to test.
   * @param start Position to check the rule from (inclusive).
   * @returns The result of the test (see `RuleMatchResult` documentation for details).
   */
  abstract test(text: string, start: number): RuleMatchResult;
}

export interface RuleNotMatching {
  /**
   * The text matches the rule
   */
  isMatching: false;
}

export interface RuleMatching {
  /**
   * The text matches the rule
   */
  isMatching: true;

  /**
   * End positions of the matching portions. Can include more than one position if multiple sub-rules apply.
   *
   * Is only included if `isMatching` is `true`.
   */
  endPositions: number[];
}

export type RuleMatchResult = RuleMatching | RuleNotMatching;
