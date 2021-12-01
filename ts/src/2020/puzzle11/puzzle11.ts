import { PuzzleSolver } from '../../util/PuzzleSolver';
import { Game, GameProgressState } from './Game';
import { GenerationMethod } from './GameField';

class PuzzleSolver11 extends PuzzleSolver {
  constructor() {
    super(11);
  }

  solve(): void {
    const gamePartA = new Game(
      this.inputReader.getPuzzleInputSplitByLines(),
      GenerationMethod.GAME_OF_LIFE
    );
    const gamePartB = new Game(
      this.inputReader.getPuzzleInputSplitByLines(),
      GenerationMethod.VISIBILITY
    );

    gamePartA.startGame();
    gamePartA.getGameState().subscribe((state) => {
      if (state === GameProgressState.FINISHED) {
        this.printSolution(gamePartA.getCurrentField().getOccupiedSeatCount(), 'A');
        gamePartB.startGame();
      }
    });

    gamePartB.getGameState().subscribe((state) => {
      if (state === GameProgressState.FINISHED) {
        this.printSolution(gamePartB.getCurrentField().getOccupiedSeatCount(), 'B');
      }
    });
  }
}

new PuzzleSolver11().solve();
