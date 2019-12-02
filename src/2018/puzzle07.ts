import { getLinesOfInput, readPuzzleInput } from '../util/utils';

const input: string[] = getLinesOfInput(readPuzzleInput(7));
// input = getLinesOfInput(`
// Step C must be finished before step A can begin.
// Step C must be finished before step F can begin.
// Step A must be finished before step B can begin.
// Step A must be finished before step D can begin.
// Step B must be finished before step E can begin.
// Step D must be finished before step E can begin.
// Step F must be finished before step E can begin.
// `);

let nodesMap: Map<string, Node> = buildGraphMap(input);

// Part A
console.log('Calculating part A');
const order: Node[] = [];
let startingNodes: Node[] = getStartingNodes([...nodesMap.values()]).sort(compareStartingNodes);

while (startingNodes.length !== 0) {
  const currNode: Node = startingNodes.splice(0, 1)[0];

  order.push(currNode);

  currNode.followingNodesIds.forEach(id => {
    const node: Node | undefined = nodesMap.get(id);

    if (node) {
      if (startingNodes.findIndex(n => n.id === id) === -1) {
        // Node exists (safety thing bc of undefined, ...) AND it is NOT in the array of startingNodes
        startingNodes.push(node);
      }

      node.numberOfIncEdges -= 1;
    }
  });

  startingNodes.sort(compareStartingNodes);
}

let result: string = '';

for (const n of order) {
  result += n.id;
}

console.log(`Result part A: ${result}`);

// Part B
console.log('Calculating part B');
const workerCount: number = 5;
const addTime: number = 60;
let currTime: number = 0;
const workingWorkers: Worker[] = [];

// Testing
// workerCount = 2;
// addTime = 0;

// Rebuild graph to start from scratch
nodesMap = buildGraphMap(input);
startingNodes = getStartingNodes([...nodesMap.values()]).sort(compareStartingNodes);

while (startingNodes.length > 0 || workingWorkers.length > 0) {
  const nodesToRemove: Node[] = [];

  // Assign workers to tasks (if there are any left)
  for (const node of startingNodes) {
    if (workingWorkers.length < workerCount) {
      workingWorkers.push({
        idOfTask: node.id,
        startTime: currTime,
        endTime: currTime + addTime + getTimeForCharacter(node.id),
      });

      nodesToRemove.push(node);
    } else {
      break;
    }
  }

  // Remove all assigned nodes from the starting nodes
  for (const node of nodesToRemove) {
    const idx: number = startingNodes.indexOf(node);
    startingNodes.splice(idx, 1);
  }

  // Search the one with the smallest endTime and remove it from the array.
  const finishedWorker: Worker = workingWorkers
    .sort((a, b) => a.endTime - b.endTime)
    .splice(0, 1)[0];

  // Advance the time to the endTime of the finished worker and reduce the incoming edge count for all his 'childs' by 1. If that child's count is 0 then add it to the array of starting nodes -- it can now be worked on.
  currTime = finishedWorker.endTime;

  nodesMap.get(finishedWorker.idOfTask)!.followingNodesIds.forEach(nodeId => {
    const node: Node | undefined = nodesMap.get(nodeId);

    if (node) {
      node.numberOfIncEdges -= 1;

      if (node.numberOfIncEdges === 0) {
        startingNodes.push(node);
      }
    }
  });
}

console.log(`Part B -- Time needed: ${currTime} seconds`);

// ========== HELPERS ==========
type Node = { id: string; numberOfIncEdges: number; followingNodesIds: string[] };
type Worker = { idOfTask: string; startTime: number; endTime: number };

function buildGraphMap(input: string[]): Map<string, Node> {
  const regex: RegExp = /Step ([A-Z]) must be finished before step ([A-Z]) can begin\./;
  const nodesMap: Map<string, Node> = new Map();

  input.forEach(line => {
    const res: string[] | null = regex.exec(line);

    if (res) {
      const [, idStart, idEnd] = res;

      if (nodesMap.has(idStart)) {
        nodesMap.get(idStart)!.followingNodesIds.push(idEnd);
      } else {
        nodesMap.set(idStart, { id: idStart, numberOfIncEdges: 0, followingNodesIds: [idEnd] });
      }

      if (nodesMap.has(idEnd)) {
        nodesMap.get(idEnd)!.numberOfIncEdges += 1;
      } else {
        nodesMap.set(idEnd, { id: idEnd, numberOfIncEdges: 1, followingNodesIds: [] });
      }
    }
  });

  return nodesMap;
}

function getStartingNodes(nodes: Node[]): Node[] {
  const startingNodes: Node[] = [];

  for (const n of nodes) {
    if (n.numberOfIncEdges === 0) {
      startingNodes.push(n);
    }
  }

  return startingNodes;
}

function getTimeForCharacter(char: string): number {
  // 'A' has the charCode 65.
  return char.charCodeAt(0) - 64;
}

function compareStartingNodes(a: Node, b: Node): number {
  if (a.numberOfIncEdges === b.numberOfIncEdges) {
    return a.id.localeCompare(b.id);
  }

  return a.numberOfIncEdges - b.numberOfIncEdges;
}
