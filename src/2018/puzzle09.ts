/**
 * Solution was optimized for part B thanks to the helping comment of GeneralYouri in the AOC subreddit. Without the idea of not having to care about the whole list, the script would still be running for part B.
 *
 * Q: https://www.reddit.com/r/adventofcode/comments/a4i97s/2018_day_9_solutions/ebeqw2w
 */
import { readPuzzleInput } from '../util/PuzzleInputReader';

class Marble {
  value: number;
  next: Marble;
  prev: Marble;

  constructor(value: number, next?: Marble, prev?: Marble) {
    this.value = value;
    this.next = next || this;
    this.prev = prev || this;
  }
}

const input = readPuzzleInput(9);
// let testInput: string[] = [
//     '9 players; last marble is worth 25 points', // high score is 32
//     '10 players; last marble is worth 1618 points', // high score is 8317
//     '13 players; last marble is worth 7999 points', // high score is 146373
//     '17 players; last marble is worth 1104 points', // high score is 2764
//     '21 players; last marble is worth 6111 points', //  high score is 54718
//     '30 players; last marble is worth 5807 points', // high score is 37305
// ];

// input = testInput[2]; // Testing

// Get the game data
const [playerCount, lastMarble] = input.match(/\d+/g)!.map(Number);

console.log(`Part A -- Highscore: ${getHighScore(playTheGame(playerCount, lastMarble))}`);

console.log(`Part B -- Highscore: ${getHighScore(playTheGame(playerCount, lastMarble * 100))}`);

// ========== HELPERS ==========
type Score = { [plyId: number]: number };

function playTheGame(playerCount: number, lastMarble: number): Score {
  const scores: Score = {};
  let currMarble: Marble = new Marble(0);
  currMarble.next = currMarble;
  currMarble.prev = currMarble;

  /** Player IDs are offset by 1 (Ply 1 has ID 0, Ply 2 has ID 1, ...) */
  let activePlayer: number = 0;

  for (let currVal = 1; currVal < lastMarble; currVal++) {
    if (currVal % 23 === 0) {
      for (let i = 0; i < 7; i++) {
        currMarble = currMarble.prev;
      }

      scores[activePlayer] = (scores[activePlayer] || 0) + currVal + currMarble.value;
      currMarble.prev.next = currMarble.next;
      currMarble.next.prev = currMarble.prev;
      currMarble = currMarble.next;
    } else {
      currMarble = addToList(currVal, currMarble.next);
    }

    // Advance turn
    activePlayer = (activePlayer + 1) % playerCount;
  }

  return scores;
}

function getHighScore(scores: Score): number {
  let highscore: number = 0;

  for (const plyId in scores) {
    const plyScore = scores[plyId];

    if (plyScore > highscore) {
      highscore = plyScore;
    }
  }

  return highscore;
}

function addToList(value: number, marble: Marble): Marble {
  const toAdd: Marble = { value, next: marble.next, prev: marble };

  marble.next.prev = toAdd;
  marble.next = toAdd;

  return toAdd;
}
