import { Rule, RuleMatchResult } from './Rule';

/**
 * Tests if the character at the given position matches the one of the rule.
 */
export class CharacterRule extends Rule {
  constructor(id: number, private readonly character: string) {
    super(id);

    if (character.length !== 1) {
      throw new Error('The given character must have length 1.');
    }
  }

  test(text: string, start: number): RuleMatchResult {
    return text.charAt(start) === this.character
      ? { isMatching: true, endPositions: [start] }
      : { isMatching: false };
  }
}
