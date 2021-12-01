import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Rule } from './rules/Rule';
import { RuleFactory } from './rules/RuleFactory';

class PuzzleSolver19 extends PuzzleSolver {
  constructor() {
    super(19);
  }

  solve(): void {
    const [ruleInput, messages] = this.inputReader.getPuzzleInputGroupedByEmptyLines();
    const allRules: Rule[] = new RuleFactory(ruleInput).getRules();

    const mainRule: Rule = allRules[0];
    const matchingMessages: string[] = messages.filter(this.doesMatchRule(mainRule));

    this.printSolution(matchingMessages.length, 'A');
  }

  private doesMatchRule(rule: Rule): (message: string) => boolean {
    return (message) => {
      const result = rule.test(message, 0);

      if (result.isMatching) {
        return result.endPositions.includes(message.length - 1);
      } else {
        return false;
      }
    };
  }
}

const time = Date.now();
new PuzzleSolver19().solve();
const endTime = Date.now();
console.log(`Solved in: ${endTime - time}ms`);
