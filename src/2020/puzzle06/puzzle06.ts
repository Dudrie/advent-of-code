import { PuzzleSolver } from '../../util/PuzzleSolver';

class Group {
  private readonly questionedAnyoneYes: Set<string>;
  private readonly questionedEveryoneYes: Set<string>;

  constructor(answers: string[]) {
    this.questionedAnyoneYes = new Set();
    this.questionedEveryoneYes = new Set();

    this.loadAnswers(answers);
  }

  /**
   * @returns Counts the questions __anyone__ answered with 'yes'.
   */
  public getYesCountAnyone(): number {
    return this.questionedAnyoneYes.size;
  }

  /**
   * @returns Counts the questions __everyone__ anwered with 'yes'.
   */
  public getYesCountEveryone(): number {
    return this.questionedEveryoneYes.size;
  }

  /**
   * Loads the different answers into this groups answer set.
   *
   * Duplicate answers are ignored.
   *
   * @param answers Input data containined the answers of this group.
   */
  private loadAnswers(answers: string[]): void {
    const yesCountPerQuestions = new Map<string, number>();

    for (const answer of answers) {
      for (const questionWithYes of answer.split('')) {
        this.questionedAnyoneYes.add(questionWithYes);
        yesCountPerQuestions.set(
          questionWithYes,
          (yesCountPerQuestions.get(questionWithYes) ?? 0) + 1
        );
      }
    }

    for (const [question, yesCount] of yesCountPerQuestions.entries()) {
      if (yesCount === answers.length) {
        this.questionedEveryoneYes.add(question);
      }
    }
  }
}

class PuzzleSolver06 extends PuzzleSolver {
  private readonly groups: Group[];

  constructor() {
    super(6);
    this.groups = [];

    this.loadGroups();
  }

  solve(): void {
    const sumAnyone: number = this.groups.reduce((sum, cur) => sum + cur.getYesCountAnyone(), 0);
    const sumEveryone: number = this.groups.reduce(
      (sum, cur) => sum + cur.getYesCountEveryone(),
      0
    );

    this.printSolution(sumAnyone, 'A');
    this.printSolution(sumEveryone, 'B');
  }

  private loadGroups(): void {
    const input: string[][] = this.inputReader.getPuzzleInputGroupedByEmptyLines();

    input.forEach((i) => this.groups.push(new Group(i)));
  }
}

new PuzzleSolver06().solve();
