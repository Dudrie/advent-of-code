// TODO: Redo with a proper and CLEANER approach.
import { getLinesOfInput, readPuzzleInput } from './util/utils';

type GameField = string[][];
type Position = { x: number, y: number };
type Path = Position[];
type Entity = { team: 'Elf' | 'Goblin', power: number, health: number, pos: Position };

type Node = { tile: Position, nodesConnected: Node[] };

class PathfindingGraph {
    private _nodes: Map<string, Node>;
    public get nodes(): Map<string, Node> {
        return this._nodes;
    }

    constructor(field: GameField) {
        this._nodes = new Map();

        for (let x = 0; x < field.length; x++) {
            for (let y = 0; y < field[x].length; y++) {
                if (field[x][y] === TILE_WALKABLE && !getEntityOnPosition({ x, y })) {
                    // Create a node for every walkable tile.
                    this._nodes.set(
                        PathfindingGraph.getStringForPosition({ x, y }),
                        { tile: { x, y }, nodesConnected: [] }
                    );
                }
            }
        }

        // Create edges to the neighbours
        for (let pos of this._nodes.keys()) {
            let node: Node = this._nodes.get(pos)!;
            let { x, y } = node.tile;

            // Search for walkable nodes on the top, left, bottom, right and add edges to these tiles if they exist.
            let posToCheck: string;

            posToCheck = PathfindingGraph.getStringForPosition({ x, y: y - 1 });
            if (this._nodes.has(posToCheck)) {
                node.nodesConnected.push(this._nodes.get(posToCheck)!);
            }

            posToCheck = PathfindingGraph.getStringForPosition({ x: x + 1, y: y });
            if (this._nodes.has(posToCheck)) {
                node.nodesConnected.push(this._nodes.get(posToCheck)!);
            }

            posToCheck = PathfindingGraph.getStringForPosition({ x, y: y + 1 });
            if (this._nodes.has(posToCheck)) {
                node.nodesConnected.push(this._nodes.get(posToCheck)!);
            }

            posToCheck = PathfindingGraph.getStringForPosition({ x: x - 1, y });
            if (this._nodes.has(posToCheck)) {
                node.nodesConnected.push(this._nodes.get(posToCheck)!);
            }
        }
    }

    public static getStringForPosition(pos: Position): string {
        return `${pos.x},${pos.y}`;
    }
}

enum TurnEndState {
    COMPLETED, ABORTED
}

function runGame() {
    let roundNr: number = 0;
    printGameField(roundNr);

    // FIXME Testing!!
    let ent: Entity = entitiesAlive[0]; // Should b the first goblin.

    console.log(ent.team, ent.pos);

    takeTurn(ent);
    printGameField(1);

    return;

    // while (true) { // FIXME: Run the real game (while loop) instead of only the first turn!
    for (let ent of entitiesAlive) {
        if (takeTurn(ent) === TurnEndState.ABORTED) {
            endGame(roundNr);
            return;
        }
    }

    roundNr++;
    printGameField(roundNr);
    // }
}

function endGame(lastCompletedRound: number) {
    let result: number = lastCompletedRound * entitiesAlive.reduce((prevVal, ent) => prevVal + ent.health, 0);

    console.log(`Part A -- Outcome of battle: ${result}`);
}

function takeTurn(entity: Entity): TurnEndState {
    let posTargets: Entity[] = getPossibleTargets(entity);

    if (posTargets.length === 0) {
        // If we can not find possible targets the game is over
        return TurnEndState.ABORTED;
    }

    // Propagate the rest of the turn down to the next state.
    return determineTarget(entity, posTargets);
}

function determineTarget(entity: Entity, posTargets: Entity[]): TurnEndState {
    let adjacentOpen: Position[] = [];

    for (let target of posTargets) {
        adjacentOpen.push(...getAdjacentOpenTiles(target));
    }

    if (adjacentOpen.length === 0) {
        return TurnEndState.ABORTED;
    }

    // Already adjacent to one/more enemies? If so, attack one of those.
    let adjacentEnemies: Entity[] = getAdjacentEnemies(entity);

    if (adjacentEnemies.length > 0) {
        // We are already adjacent to enemies (prop just one) so we take the one with the lowest hitpoints.
        adjacentEnemies.sort((a, b) => a.health - b.health);
        attackEnemy(entity, adjacentEnemies[0]);

        return TurnEndState.COMPLETED;
    }

    // We are NOT adjacent to an enemy, so we need to find the shortest path to an enemy (if there's one available).
    moveEntityToClosestEnemy(entity, adjacentOpen);

    return TurnEndState.COMPLETED;
}

function moveEntityToClosestEnemy(entity: Entity, adjacentOpen: Position[]) {
    if (adjacentOpen.length === 0) {
        return;
    }

    // Take the first field and calculate the shortest path to it. Take this as a referecen (therefore exclude it from the iteration) to find the REAL shortest path to one of the adjacentOpen fields.
    let shortestPath: Path = [];
    let shortestPathLength: number = Number.MAX_SAFE_INTEGER;

    for (let adj of adjacentOpen) {
        let path = getShortestPath(entity.pos, adj);

        if (path.length === 0) {
            // There's no path to that target, so skip it.
            continue;
        }

        if (path.length < shortestPathLength) {
            shortestPath = path;
            shortestPathLength = path.length;

        } else if (path.length === shortestPathLength) {
            if (comparePositions(path[1], shortestPath[1]) < 0) {
                // The path's end point is the one taken by the reading order
                shortestPath = path;
            }
        }
    }

    // Move one step along this path.
    entity.pos = shortestPath[0];

    // This changes the field, so recreate the pathfinding graph
    pathFindingGraph = buildPathFindingGraph();
}

function attackEnemy(myEntity: Entity, enemy: Entity) {
    enemy.health -= myEntity.power;

    if (enemy.health <= 0) {
        // Enemy is dead, so remove it
        let idx: number = entitiesAlive.indexOf(enemy);

        if (idx === -1) {
            console.warn('Could not find dead entity in list of alive entities.');
        }

        entitiesAlive.splice(idx, 1);

        // This changes the field, so recreate the pathfinding graph
        pathFindingGraph = buildPathFindingGraph();
    }
}

function getPossibleTargets(entity: Entity): Entity[] {
    return entitiesAlive.filter((ent) => ent.team !== entity.team);
}

function getAdjacentEnemies(entity: Entity): Entity[] {
    let { x, y } = entity.pos;
    let { team } = entity;
    let enemies: Entity[] = [];

    let ent: Entity | undefined = getEntityOnPosition({ x, y: y - 1 });

    if (ent && ent.team !== team) {
        enemies.push(ent);
    }

    ent = getEntityOnPosition({ x: x - 1, y });

    if (ent && ent.team !== team) {
        enemies.push(ent);
    }

    ent = getEntityOnPosition({ x: x + 1, y });

    if (ent && ent.team !== team) {
        enemies.push(ent);
    }

    ent = getEntityOnPosition({ x, y: y + 1 });

    if (ent && ent.team !== team) {
        enemies.push(ent);
    }

    return enemies;
}

function getAdjacentOpenTiles(entity: Entity): Position[] {
    let pos: Position[] = [];
    let { x, y } = entity.pos;

    if (gameField[x - 1] && gameField[x - 1][y] !== '#') {
        // Left
        pos.push({ x: x - 1, y });
    }

    if (gameField[x + 1] && gameField[x + 1][y] !== '#') {
        // Right
        pos.push({ x: x + 1, y });
    }

    if (gameField[x][y - 1] && gameField[x][y - 1] !== '#') {
        // Up
        pos.push({ x, y: y - 1 });
    }

    if (gameField[x][y + 1] && gameField[x][y + 1] !== '#') {
        // Down
        pos.push({ x, y: y + 1 });
    }

    // Only return the ones which don't have entites on them.
    return pos.filter((p) => getEntityOnPosition(p) === undefined);
}

function getEntityOnPosition(pos: Position): Entity | undefined {
    for (let ent of entitiesAlive) {
        if (ent.pos.x === pos.x && ent.pos.y === pos.y) {
            return ent;
        }
    }

    return undefined;
}

function comparePositions(posA: Position, posB: Position): number {
    if (posA.y === posB.y) {
        return posA.x - posB.x;
    }

    return posA.y - posB.y;
}

function printGameField(currRound: number) {
    console.log(`GameField after round ${currRound}:`);
    let lines: string[] = new Array(gameField[0].length);
    lines.fill('');

    for (let x = 0; x < gameField.length; x++) {
        for (let y = 0; y < gameField[x].length; y++) {
            let symb: string = gameField[x][y];
            let ent: Entity | undefined = getEntityOnPosition({ x, y });

            if (ent) {
                if (ent.team === 'Goblin') {
                    symb = 'G';
                } else if (ent.team === 'Elf') {
                    symb = 'E';
                }
            }

            lines[y] += symb;
        }
    }

    for (let line of lines) {
        console.log(line);
    }
}

function getShortestPath(start: Position, end: Position): Path {
    let startNode: Node | undefined = pathFindingGraph.nodes.get(
        PathfindingGraph.getStringForPosition(start)
    );
    let endNode: Node | undefined = pathFindingGraph.nodes.get(
        PathfindingGraph.getStringForPosition(end)
    );

    if (!startNode || !endNode) {
        return [];
    }

    let path: Path = [];
    let closed: Node[] = [];
    let open: Node[] = [startNode];
    let cameFrom: Map<Node, Node> = new Map();
    let gScore: Map<Node, number> = new Map();
    let fScore: Map<Node, number> = new Map();

    for (let node of pathFindingGraph.nodes.values()) {
        gScore.set(node, Number.MAX_SAFE_INTEGER);
        fScore.set(node, Number.MAX_SAFE_INTEGER);
    }

    gScore.set(startNode, 0);
    fScore.set(startNode, getHeuristicDistance(startNode, endNode));

    // Does one need a priotiry queue? 
    // Because every edge has the exact same cost of 1 -- so every edge has the same priority as any other in the graph -- that's the reason (btw) why this graph does NOT have dedicated 'edge objects'.

    while (open.length > 0) {
        let current: Node = open.splice(0, 1)![0];

        if (current === endNode) {
            return reconstructPath(cameFrom, current);
        }

        closed.push(current);

        for (let node of current.nodesConnected) {
            if (closed.indexOf(node) !== -1) {
                continue;
            }

            // We're adding one because the distance between two nodes is always 1 step.
            let tentativeGScore = gScore.get(current)! + 1;

            if (open.indexOf(node) === -1) {
                open.push(node);

            } else if (tentativeGScore >= gScore.get(node)!) {
                // Path would be longer, so abort.
                continue;
            }

            // This path is best path found so far.
            cameFrom.set(node, current);
            gScore.set(node, tentativeGScore);
            fScore.set(node, gScore.get(node)! + getHeuristicDistance(node, endNode));
        }

        open.sort((a, b) => (fScore.get(a) || 0) - (fScore.get(b) || 0));
    }

    return path;
}

function getHeuristicDistance(nodeA: Node, nodeB: Node): number {
    return Math.abs(nodeA.tile.x - nodeB.tile.x) + Math.abs(nodeA.tile.y - nodeB.tile.y);
}

function reconstructPath(cameFrom: Map<Node, Node>, lastNodeInPath: Node): Path {
    let path: Path = [lastNodeInPath.tile];
    let prevNode: Node | undefined = cameFrom.get(lastNodeInPath);

    while (prevNode) {
        path.push(prevNode.tile);
        prevNode = cameFrom.get(prevNode);
    }

    return path.reverse();
}

function buildPathFindingGraph(): PathfindingGraph {
    return new PathfindingGraph(gameField);
}

// ========== RUNNING SECTION ==========
let input: string[] = getLinesOfInput(readPuzzleInput(15, 1));

const START_POWER: number = 3;
const START_HEALTH: number = 200;
const TILE_WALL: string = '#';
const TILE_WALKABLE: string = '.';

const gameField: GameField = [];
const entitiesAlive: Entity[] = [];

// Init the gaming field and all entities
for (let x = 0; x < input[0].length; x++) {
    gameField[x] = [];

    for (let y = 0; y < input.length; y++) {
        gameField[x][y] = input[y].charAt(x);

        if (gameField[x][y] === 'G') {
            entitiesAlive.push({
                team: 'Goblin',
                power: START_POWER,
                health: START_HEALTH,
                pos: { x, y }
            });

            gameField[x][y] = TILE_WALKABLE;

        } else if (gameField[x][y] === 'E') {
            entitiesAlive.push({
                team: 'Elf',
                power: START_POWER,
                health: START_HEALTH,
                pos: { x, y }
            });

            gameField[x][y] = TILE_WALKABLE;
        }
    }
}

let pathFindingGraph: PathfindingGraph = buildPathFindingGraph();

// Run the game
runGame();