import { Rule } from './Rule';
import { AndRule } from './AndRule';
import { OrRule } from './OrRule';
import { CharacterRule } from './CharacterRule';

export class RuleDescriptionForFactory {
  readonly id: number;

  private readonly description: string;
  private readonly subDescriptions: string[];
  private readonly dependsOn: Set<number>;

  private value: string | undefined;

  constructor(input: string) {
    const [id, description] = input.split(':').map((i) => i.trim());

    this.id = Number.parseInt(id, 10);
    this.description = description;
    this.value = undefined;
    this.subDescriptions = [];
    this.dependsOn = new Set();

    this.assertValidInitial();
    this.parseDescription();
  }

  /**
   * @returns A copy of the list of all dependencies of this description.
   */
  getDependencies(): readonly number[] {
    return [...this.dependsOn.values()];
  }

  /**
   * @returns The amount of dependencies this rule description depends on.
   */
  getDependencyCount(): number {
    return this.dependsOn.size;
  }

  /**
   * Generates a rule from this description.
   *
   * @param rules All currently loaded rules.
   * @returns Generated rule of this description.
   */
  generateRule(rules: Map<number, Rule>): Rule {
    if (this.value !== undefined) {
      return new CharacterRule(this.id, this.value);
    }

    if (this.subDescriptions.length === 1) {
      return this.generateAndRuleFromSubDescription(this.subDescriptions[0], rules);
    } else if (this.subDescriptions.length === 2) {
      return new OrRule(
        this.id,
        this.generateAndRuleFromSubDescription(this.subDescriptions[0], rules),
        this.generateAndRuleFromSubDescription(this.subDescriptions[1], rules)
      );
    } else {
      throw new Error(`Sub description count of ${this.subDescriptions.length} is not supported.`);
    }
  }

  /**
   * Generates an `AndRule` based on the given sub description.
   *
   * @param description Sub description of this description.
   * @param rules All currently available rules.
   * @returns Generated `AndRule`.
   * @private
   */
  private generateAndRuleFromSubDescription(
    description: string,
    rules: Map<number, Rule>
  ): AndRule {
    const allRules: Rule[] = [];

    for (const character of description.split(/\s/g)) {
      const id: number = Number.parseInt(character, 10);
      const rule: Rule = this.getParentRule(rules, id);
      allRules.push(rule);
    }

    return new AndRule(this.id, allRules);
  }

  /**
   * @param rules All currently loaded rules.
   * @param parentId ID of the parent rules.
   * @returns Parent rule with the given ID.
   * @throws `Error` - If there is no rule loaded with the given ID.
   * @private
   */
  private getParentRule(rules: Map<number, Rule>, parentId: number): Rule {
    const rule: Rule | undefined = rules.get(parentId);

    if (!rule) {
      throw new Error(
        `This rule (#${this.id}) depends on rule #${parentId} but that rule is not available yet.`
      );
    }

    return rule;
  }

  /**
   * Parses the description of this rule. Adjusts the `subDescription` and `value` property accordingly.
   *
   * **Must only be called once!**
   *
   * @private
   */
  private parseDescription(): void {
    const characters: string[] = this.description.split(/\s/g);
    let lastPipePosition: number = -1;

    for (let i = 0; i < characters.length; i++) {
      const character: string = characters[i];
      if (character.startsWith('"')) {
        this.value = character.replace(/"/g, '');
        return;
      } else if (character === '|') {
        this.subDescriptions.push(characters.slice(lastPipePosition + 1, i).join(' '));
        lastPipePosition = i;
      } else {
        this.handleNumberCharacter(character);
      }
    }

    this.subDescriptions.push(characters.slice(lastPipePosition + 1).join(' '));
  }

  /**
   * Handle a number character in the **initial** description load.
   * @param character Character to handle.
   * @throws `Error` - If the character is not a number.
   * @private
   */
  private handleNumberCharacter(character: string): void {
    const dependency: number = Number.parseInt(character, 10);
    if (Number.isNaN(dependency)) {
      throw new Error(
        `Character "${character}" in "${this.description}" should be number but is not.`
      );
    } else {
      this.dependsOn.add(dependency);
    }
  }

  /**
   * Checks if the initial configuration of this object is valid.
   * @throws `Error` - If any property is not in a valid state.
   * @private
   */
  private assertValidInitial(): void {
    if (Number.isNaN(this.id)) {
      throw new Error(`This id should be a number, but it is not.`);
    }

    if (!this.description) {
      throw new Error('The description is empty.');
    }
  }
}
