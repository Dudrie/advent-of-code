import { PuzzleSolver } from '../util/PuzzleSolver';

class PasswordField {
  constructor(
    readonly name: string,
    readonly optional: boolean,
    readonly isValid: (data: string) => boolean
  ) {}
}

class Passport {
  private readonly FIELDS: readonly PasswordField[] = [
    new PasswordField('byr', false, (data) => this.betweenNumbers(data, 1920, 2002)),
    new PasswordField('iyr', false, (data) => this.betweenNumbers(data, 2010, 2020)),
    new PasswordField('eyr', false, (data) => this.betweenNumbers(data, 2020, 2030)),
    new PasswordField('hgt', false, (data) => {
      const unit = data.substring(data.length - 2);
      const value = data.substring(0, data.length - 2);

      if (unit === 'cm') {
        return this.betweenNumbers(value, 150, 193);
      } else if (unit === 'in') {
        return this.betweenNumbers(value, 59, 76);
      } else {
        return false;
      }
    }),
    new PasswordField('hcl', false, (data) => data.match(/^#[0-9a-f]{6}$/) !== null),
    new PasswordField('ecl', false, (data) =>
      ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(data)
    ),
    new PasswordField('pid', false, (data) => data.match(/^[0-9]{9}$/) !== null),
    new PasswordField('cid', true, () => true),
  ];

  private readonly data: Record<string, string | undefined>;

  constructor(data: string[]) {
    this.data = {};
    this.loadData(data);
  }

  checkAllFieldsPresent(): boolean {
    const requiredFields = this.FIELDS.filter((f) => !f.optional);
    for (const fields of requiredFields) {
      if (!(fields.name in this.data)) {
        return false;
      }
    }

    return true;
  }

  checkValidityOfFields(): boolean {
    for (const field of this.FIELDS) {
      const value = this.data[field.name] ?? '';

      if (!field.isValid(value)) {
        return false;
      }
    }

    return true;
  }

  private loadData(data: string[]) {
    for (const line of data) {
      const entries = line.split(' ');
      for (const entry of entries) {
        const [key, value] = entry.split(':');
        this.data[key] = value;
      }
    }
  }

  private betweenNumbers(data: string, min: number, max: number): boolean {
    const no = Number.parseInt(data, 10);
    return min <= no && no <= max;
  }
}

class PuzzleSolver04 extends PuzzleSolver {
  private readonly passports: Passport[];

  constructor() {
    super(4);

    this.passports = [];
    this.loadPassports();
  }

  solve(): void {
    const allRequiredPresentCount = this.passports.filter((p) => p.checkAllFieldsPresent()).length;
    const allFieldsValidCount = this.passports.filter(
      (p) => p.checkAllFieldsPresent() && p.checkValidityOfFields()
    ).length;

    this.printSolution(allRequiredPresentCount, 'A');
    this.printSolution(allFieldsValidCount, 'B');
  }

  private loadPassports() {
    const lines: string[] = this.inputReader.getPuzzleInputSplitByLinesWithEmptyLines();
    let data: string[] = [];

    for (const line of lines) {
      if (line === '') {
        // We found a new line so the end of a passport.
        this.passports.push(new Passport(data));
        data = [];
      } else {
        data.push(line);
      }
    }

    // Make sure we add the last passport of the file aswell
    if (data.length > 0) {
      this.passports.push(new Passport(data));
    }
  }
}

new PuzzleSolver04().solve();
