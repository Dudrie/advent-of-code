import { Tile } from './Tile';
import { BehaviorSubject, Observable } from 'rxjs';
import { Timer } from './Timer';
import { GameField, GenerationMethod } from './GameField';
import { Position } from '../../util/geometrie/Position';

export enum GameProgressState {
  /** Game has not started yet.  */
  STOPPED,
  /** Game is paused and can be resumed */
  PAUSED,
  /** Game is running */
  RUNNING,
  /** Game has run successfully */
  FINISHED,
}

class GameState {
  constructor(readonly field: GameField) {}
}

export class Game {
  /** Pause between two ticks in milliseconds. */
  private tickInterval: number = 0;

  /** Current state of the game. */
  private currentState: BehaviorSubject<GameProgressState>;

  /** Game timer running the ticks of the game.  */
  private gameTimer: Timer;

  /** All previously reached states. */
  private readonly states: GameState[];

  /** Generation method used by the GameField. */
  private readonly generationMethod: GenerationMethod;

  constructor(input: string[], generationMethod: GenerationMethod) {
    this.generationMethod = generationMethod;
    this.currentState = new BehaviorSubject<GameProgressState>(GameProgressState.STOPPED);
    this.states = [this.generateInitialState(input)];
    this.gameTimer = new Timer(() => this.runTick(), this.tickInterval);
  }

  /** Starts the game */
  startGame(): void {
    if (this.currentState.value !== GameProgressState.STOPPED) {
      throw new Error(
        'Can not start a game that either already ran, is paused or is currently running.'
      );
    }
    this.currentState.next(GameProgressState.RUNNING);
    this.gameTimer.start();
  }

  /**
   * @returns The observable state of the game.
   */
  getGameState(): Observable<GameProgressState> {
    return this.currentState.asObservable();
  }

  /**
   * @returns The currently active game field.
   */
  getCurrentField(): GameField {
    return this.states[this.states.length - 1].field;
  }

  /**
   * Run one tick of the game.
   *
   * Each tick generates a completely new
   * @private
   */
  private runTick(): void {
    const gameState: GameState = this.states[this.states.length - 1];
    const nextGameField: GameField = gameState.field.getNextGameField();

    this.states.push(new GameState(nextGameField));

    if (!nextGameField.didChangeFromLast) {
      // We have reached a stable state.
      this.gameTimer.stop();
      this.currentState.next(GameProgressState.FINISHED);
    }
  }

  /**
   * Generates the initial state from the given input.
   * @param input Puzzle input.
   * @returns The generated initial game state.
   */
  private generateInitialState(input: string[]): GameState {
    const field: Tile[][] = [];
    const tiles: Tile[] = [];

    for (let row = 0; row < input.length; row++) {
      const chars: string[] = input[row].split('');
      field[row] = [];

      for (let column = 0; column < chars.length; column++) {
        const newTile: Tile = new Tile(
          Tile.getTypeFromCharacter(chars[column]),
          new Position(column, row)
        );

        tiles.push(newTile);
        field[row][column] = newTile;
      }
    }

    return new GameState(new GameField(tiles, this.generationMethod));
  }
}
