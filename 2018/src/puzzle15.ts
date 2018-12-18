/**
 * Hige thanks to the comment of albertobastos for providing an idea to solve the movement problem (without doing pathfinding >.<).
 * 
 * Reddit: https://www.reddit.com/r/adventofcode/comments/a6chwa/2018_day_15_solutions/ebuaht5
 * GitHub: https://github.com/albertobastos/advent-of-code-2018-nodejs/blob/master/src/d15.js
 */
import { getLinesOfInput, readPuzzleInput } from './util/utils';

type Position = { x: number, y: number };
type Tile = { pos: Position, isWalkable: boolean };
type GameField = { tiles: { [posStr: string]: Tile }, width: number, height: number };
type Entity = { tile: Tile, team: 'Elf' | 'Goblin', power: number, health: number };

enum ActionEndState {
    COMPLETED, END_GAME, ABORTED
}

function initGameField(input: string[], addPowerElfs: number) {
    GAME_FIELD.height = input.length;

    for (let y = 0; y < input.length; y++) {
        if (input[y].length > GAME_FIELD.width) {
            GAME_FIELD.width = input[y].length;
        }

        for (let x = 0; x < input[y].length; x++) {
            let symb: string = input[y].charAt(x).trim();

            if (!symb) {
                continue;
            }

            // Add the tile to the game
            let tile: Tile = { pos: { x, y }, isWalkable: symb !== TILE_WALL };
            GAME_FIELD.tiles[convertPosToString({ x, y })] = tile;

            if (symb === 'G') {
                ENTITIES_ALIVE.push({
                    tile,
                    team: 'Goblin',
                    power: START_POWER,
                    health: START_HEALTH
                });

            } else if (symb === 'E') {
                ENTITIES_ALIVE.push({
                    tile,
                    team: 'Elf',
                    power: START_POWER + addPowerElfs,
                    health: START_HEALTH
                });
            }
        }
    }
}

function takeTurn(entity: Entity): ActionEndState {
    // Find all possible targets (aka 'enemies')
    let posTargets: Entity[] = getPossibleTargets(entity);

    // If there are no possible targets, call for the end game.
    if (posTargets.length === 0) {
        return ActionEndState.END_GAME;
    }

    // Attack one target, if close to it
    let hasAttacked: boolean = (tryToAttackNearbyEnemy(entity) === ActionEndState.COMPLETED);

    if (hasAttacked) {
        return ActionEndState.COMPLETED;
    }

    // Move to a target, if none could be attacked.
    moveToEnemy(entity, posTargets);

    // Now, try to attack again
    tryToAttackNearbyEnemy(entity);

    return ActionEndState.COMPLETED;
}

function tryToAttackNearbyEnemy(entity: Entity): ActionEndState {
    let adjTiles: Tile[] = getAdjacentTiles(entity.tile);
    let enemies: Entity[] = [];

    for (let tile of adjTiles) {
        let enemy: Entity | undefined = getEntityAtPos(tile.pos);

        if (enemy && enemy.team !== entity.team) {
            enemies.push(enemy);
        }
    }

    if (enemies.length > 0) {
        enemies.sort((a, b) => {
            if (a.health === b.health) {
                // If two enemies have the same health, we attack the one who's first in reading order.
                return comparePositions(a.tile.pos, b.tile.pos);
            }

            return a.health - b.health;
        });

        attackEnemy(entity, enemies[0]);
        return ActionEndState.COMPLETED;
    }

    return ActionEndState.ABORTED;
}

function attackEnemy(attacker: Entity, defender: Entity) {
    defender.health -= attacker.power;

    if (defender.health <= 0) {
        // Defender is dead, so remove this entity from the field
        let idx: number = ENTITIES_ALIVE.indexOf(defender);

        if (idx === -1) {
            console.error('AN ENTITY WAS KILLED BUT COULD NOT BE REMOVED?!');
        }

        ENTITIES_ALIVE.splice(idx, 1);
    }
}

function moveToEnemy(entity: Entity, posTargets: Entity[]) {
    let nextMove: Tile | undefined = findNextMove(entity, posTargets);

    if (nextMove) {
        entity.tile = nextMove;
    }
}

function findNextMove(entity: Entity, posTargets: Entity[]): Tile | undefined {
    let paths: Tile[][] = [];
    let targetTiles: Tile[] = posTargets.map((t) => t.tile);
    let visited: Tile[] = [];

    // We start at the position of the entity
    paths.push([entity.tile]);
    visited.push(entity.tile);

    let allTilesCount: number = Object.values(GAME_FIELD.tiles).length;

    // While we have not visited all tiles, try to find a path
    while (visited.length < allTilesCount) {
        let newPaths: Tile[][] = [];
        let targetPaths: Tile[][] = [];

        // We'll extend every path (if possible) by adding the next step to it.
        paths.forEach((path) => {
            let adjTiles: Tile[] = getAdjacentTiles(path[path.length - 1]);
            adjTiles.forEach((tile) => {
                // Is that tile a target tile? If not can we walk on it?
                if (targetTiles.includes(tile)) {
                    targetPaths.push([...path, tile]);

                } else if (!visited.includes(tile) && isWalkableTile(tile)) {
                    newPaths.push([...path, tile]);
                }

                if (!visited.includes(tile)) {
                    visited.push(tile);
                }
            });
        });

        if (targetPaths.length > 0) {
            // In the case we found multiple paths (all have the same length) we have to take the one which would END in reading order.
            targetPaths.sort((pathOne, pathTwo) => {
                let targetPathOne: Tile = pathOne[pathOne.length - 1];
                let targetPathTwo: Tile = pathTwo[pathTwo.length - 1];

                return comparePositions(targetPathOne.pos, targetPathTwo.pos);
            });

            // Return the next step of the first (selected) path.
            return targetPaths[0][1];
        }

        paths = newPaths;
        if (paths.length === 0) {
            // We don't have any paths left which we could extend, so we don't have a path to that target.
            return undefined;
        }
    }

    // We have searched ALL tiles of the GAME_FIELD and found no path, so there is no path. However, this should NEVER happen, the method should bail out and recognice that there's no path way earlier.
    return undefined;
}

function getPossibleTargets(entity: Entity): Entity[] {
    return ENTITIES_ALIVE.filter((ent) => ent.team !== entity.team);
}

function getAdjacentPositions(ownPos: Position): Position[] {
    let { x, y } = ownPos;

    return [
        { x, y: y - 1 },
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y + 1 }
    ];
}

function getAdjacentTiles(tile: Tile): Tile[] {
    let adjPos: Position[] = getAdjacentPositions(tile.pos);

    return adjPos.map((pos) => GAME_FIELD.tiles[convertPosToString(pos)]);
}

function getEntityAtPos(pos: Position): Entity | undefined {
    for (let ent of ENTITIES_ALIVE) {
        if (ent.tile.pos.x === pos.x && ent.tile.pos.y === pos.y) {
            return ent;
        }
    }

    return undefined;
}

function isWalkableTile(tile: Tile): boolean {
    return tile.isWalkable && (getEntityAtPos(tile.pos) === undefined);
}

function convertPosToString(pos: Position): string {
    return `${pos.x},${pos.y}`;
}

function comparePositions(a: Position, b: Position): number {
    if (a.y === b.y) {
        return a.x - b.x;
    }

    return a.y - b.y;
}

function printGameField(currRound: number = 0) {
    if (SUPRESS_PRINTING) {
        return;
    }

    console.log(`\nGameField after round ${currRound}:`);
    let lines: string[] = new Array(GAME_FIELD.height);
    let hpInfos: string[] = new Array(GAME_FIELD.height);

    lines.fill('');
    hpInfos.fill('');

    for (let x = 0; x < GAME_FIELD.width; x++) {
        for (let y = 0; y < GAME_FIELD.height; y++) {
            let tile: Tile | undefined = GAME_FIELD.tiles[convertPosToString({ x, y })];

            if (!tile) {
                continue;
            }

            let symb: string = tile.isWalkable ? TILE_WALKABLE : TILE_WALL;
            let ent: Entity | undefined = getEntityAtPos({ x, y });

            if (ent) {
                if (ent.team === 'Elf') {
                    symb = 'E';
                } else if (ent.team === 'Goblin') {
                    symb = 'G';
                }

                hpInfos[y] += `${symb}(${ent.health}) `;
            }

            lines[y] += symb;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        console.log(lines[i] + '  ' + hpInfos[i]);
    }

    return;
}

// #region RUNNING SECTION
let input: string[] = getLinesOfInput(readPuzzleInput(15));

const START_POWER: number = 3;
const START_HEALTH: number = 200;
const TILE_WALL: string = '#';
const TILE_WALKABLE: string = '.';

const SUPRESS_PRINTING: boolean = true;
let GAME_FIELD: GameField = { tiles: {}, width: 0, height: 0 };
let ENTITIES_ALIVE: Entity[] = [];

// RUN THE GAME
function endGame(lastCompletedRound: number, part: string) {
    let result: number = lastCompletedRound * ENTITIES_ALIVE.reduce((sum, ent) => sum + ent.health, 0);

    console.log(`\nPart ${part} -- Outcome of battle: ${result}`);
}

function runGame(addPowerElfs: number = 0): { lastCompletedRound: number, elfsDied: number } {
    resetGame(addPowerElfs);
    let roundNr: number = 0;
    let elfsAliveAtStart: number = ENTITIES_ALIVE.reduce((sum, ent) => {
        if (ent.team === 'Elf') {
            return sum + 1;
        }

        return sum;
    }, 0);

    while (true) {
        let aliveEntitiesAtStart: Entity[] = [...ENTITIES_ALIVE];

        for (let ent of aliveEntitiesAtStart) {
            if (ent.health <= 0) {
                // Skip dead entities.
                continue;
            }

            let endState: ActionEndState = takeTurn(ent);

            if (endState === ActionEndState.END_GAME) {
                let elfsAliveAtEnd: number = ENTITIES_ALIVE.reduce((sum, ent) => {
                    if (ent.team === 'Elf') {
                        return sum + 1;
                    }

                    return sum;
                }, 0);

                return {
                    lastCompletedRound: roundNr,
                    elfsDied: elfsAliveAtEnd - elfsAliveAtStart
                };
            }
        }

        // Adjust the turn order for the entities.
        ENTITIES_ALIVE.sort((a, b) => comparePositions(a.tile.pos, b.tile.pos));

        roundNr++;
        printGameField(roundNr);
    }
}

function resetGame(addPowerElfs: number = 0) {
    // Reset the game state
    GAME_FIELD = { tiles: {}, width: 0, height: 0 };
    ENTITIES_ALIVE = [];

    initGameField(input, addPowerElfs);
    printGameField();
}

// Part A
let { lastCompletedRound } = runGame(0);
endGame(lastCompletedRound, 'A');

// Part B

let addPower: number = -1; // Starting at -1, because we increase first than init the GameField.

while (true) {
    let { elfsDied, lastCompletedRound } = runGame(++addPower);

    if (elfsDied === 0) {
        endGame(lastCompletedRound, 'B');
        break;
    }
}

// #endregion