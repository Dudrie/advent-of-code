import { PuzzleInputReader } from '../util/utils';

interface PasswordPolicy {
  readonly symbol: string;
  readonly minCount: number;
  readonly maxCount: number;
}

class Password {
  private readonly policy: PasswordPolicy;
  private readonly password: string;

  readonly isValidA: boolean;
  readonly isValidB: boolean;

  constructor(savedPassword: string) {
    const [policy, password] = savedPassword.split(':');
    const [counts, symbol] = policy.split(' ');
    const [minCount, maxCount] = counts.split('-').map((n) => Number.parseInt(n, 10));

    this.policy = { symbol, minCount, maxCount };
    this.password = password.trim();

    this.isValidA = this.checkValidityPartA();
    this.isValidB = this.checkValidityPartB();
  }

  private checkValidityPartA(): boolean {
    const { minCount, maxCount, symbol } = this.policy;
    const count = this.password.split('').filter((c) => c === symbol).length;

    return minCount <= count && count <= maxCount;
  }

  private checkValidityPartB(): boolean {
    const { minCount: pos1, maxCount: pos2, symbol } = this.policy;
    const charsOfPassword: string[] = this.password.split('');

    const left: string = charsOfPassword[pos1 - 1];
    const right: string = charsOfPassword[pos2 - 1];

    return (left === symbol && right !== symbol) || (left !== symbol && right === symbol);
  }
}

const lines: string[] = new PuzzleInputReader(2).getPuzzleInputSplitByLines();

const passwords: Password[] = lines.map((l) => new Password(l));
const validPasswords: Password[] = passwords.filter((p) => p.isValidA);

console.log(`Solution A: ${validPasswords.length}`);
console.log(`Solution B: ${passwords.filter((p) => p.isValidB).length}`);
