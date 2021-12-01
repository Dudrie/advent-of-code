import * as fs from 'fs';
import * as path from 'path';
import pkg from '../../package.json';

/** Function to generate the TypeScript boilerplate code.
 *
 * @param puzzleNo The number of the puzzle to fill the boilerplate code with.
 */
const TEMPLATE_CODE = (puzzleNo: string | number) => {
  const paddedPuzzleNo: string = puzzleNo.toString(10).padStart(2, '0');
  return `import { PuzzleSolver } from '../../util/PuzzleSolver';

class PuzzleSolver${paddedPuzzleNo} extends PuzzleSolver {
  constructor() {
    super(${puzzleNo});
  }

  solve(): void {
    throw new Error('Method not implemented.');
  }
}

const time = Date.now();
new PuzzleSolver${paddedPuzzleNo}().solve();
const endTime = Date.now();
console.log(\`Solved in: \${endTime - time}ms\`);
`;
};

/**
 * Generates files for a puzzle to solve.
 *
 * Those files are the actual TypeScript file and a text file for the puzzle input.
 */
class PuzzleConstructor {
  private readonly puzzleNo: number;
  private readonly currentYear: number;

  constructor(private readonly args: string[]) {
    this.puzzleNo = this.getPuzzleNo();
    this.currentYear = this.getCurrentYear();
  }

  /**
   * Generates a puzzle and a corresponding input file.
   *
   * The puzzle file already contains the boilerplate code for a `PuzzleSolver`.
   */
  generateFiles(): void {
    const folder = this.getFolderPath();
    const puzzleName = this.getPuzzleName();
    const puzzleFile = path.resolve(folder, `${puzzleName}.ts`);
    const inputFile = path.resolve(folder, `${puzzleName}.txt`);
    const testFile = path.resolve(folder, `${puzzleName}Test01.txt`);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    fs.writeFileSync(puzzleFile, this.getPuzzleFileTemplate(), { encoding: 'utf-8' });
    console.log(`Puzzle file created: ${puzzleFile}.`);

    fs.writeFileSync(inputFile, '', { encoding: 'utf-8' });
    console.log(`Empty input file created: ${inputFile}.`);

    fs.writeFileSync(testFile, '', { encoding: 'utf-8' });
    console.log(`Empty test input file created: ${testFile}.`);
  }

  /**
   * @returns Path to the folder containin the puzzle file and the input (in a subfolder).
   */
  private getFolderPath(): string {
    return path.resolve(__dirname, '..', `${this.currentYear}`, this.getPuzzleName());
  }

  /**
   * @returns Name of this puzzle in the format 'puzzle<number>'.
   */
  private getPuzzleName(): string {
    return `puzzle${this.puzzleNo.toString(10).padStart(2, '0')}`;
  }

  /**
   * @returns Puzzle number from the process arguments.
   * @throws `Error` - If no valid puzzle number is provided.
   */
  private getPuzzleNo(): number {
    const puzzleNo = this.args[this.args.length - 1];

    if (!puzzleNo) {
      throw new Error('No puzzle number was provided as the last argument.');
    }

    if (Number.isNaN(Number.parseInt(puzzleNo))) {
      throw new Error('Provided puzzle number is not a number.');
    }

    return Number.parseInt(puzzleNo);
  }

  /**
   * @returns The current year used in the package.json file.
   * @throws `Error` - If no currentYear is specified in the package.json file.
   */
  private getCurrentYear(): number {
    const { currentYear } = pkg;

    if (currentYear === undefined) {
      throw new Error('No currentYear property is specified in the package.json file.');
    }

    return currentYear;
  }

  /**
   * @returns The file template popluated with the puzzle number.
   */
  private getPuzzleFileTemplate(): string {
    const templateLines: string[] = TEMPLATE_CODE(this.puzzleNo)
      .split(/\r\n|\r|\n/)
      .map((l) => l.replace(/(\r\n|\r|\n)/g, ''));

    // Make sure the generated file matches the EOL of prettier.
    return templateLines.join('\r\n');
  }
}

try {
  new PuzzleConstructor(process.argv).generateFiles();
} catch (err) {
  console.error(`[ERR] ${err.message}`);
}
