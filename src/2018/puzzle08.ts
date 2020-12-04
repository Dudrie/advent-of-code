import { readPuzzleInput } from '../util/PuzzleInputReader';

const input = readPuzzleInput(8);
// input = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';

const data: number[] = input.split(/\s/).map((v) => Number.parseInt(v));
const { node: root } = createNodeFromIndex(0, data);

console.log(`Part A -- Sum of metadata: ${calcSumOfMetadata(root)}`);

console.log(`Part B -- Value of root node: ${calcValueOfNode(root)}`);

// ========== HELPERS ==========
type Node = {
  header: { childCount: number; metadataCount: number };
  children: Node[];
  metadata: number[];
};

function createNodeFromIndex(idx: number, data: number[]): { node: Node; nextIdxToUse: number } {
  const childCount: number = data[idx];
  const metadataCount: number = data[idx + 1];

  const children: Node[] = [];
  const metadata: number[] = [];

  let curIdx: number = idx + 2;
  while (children.length < childCount) {
    const { node, nextIdxToUse } = createNodeFromIndex(curIdx, data);

    children.push(node);
    curIdx = nextIdxToUse;
  }

  for (let i = curIdx; i < curIdx + metadataCount; i++) {
    metadata.push(data[i]);
  }

  curIdx += metadataCount;

  return {
    node: {
      header: { childCount, metadataCount },
      children,
      metadata,
    },
    nextIdxToUse: curIdx,
  };
}

function calcSumOfMetadata(curNode: Node): number {
  let sum = 0;

  // Add the sum of all childs
  for (const child of curNode.children) {
    sum += calcSumOfMetadata(child);
  }

  // Add own metadata
  for (const meta of curNode.metadata) {
    sum += meta;
  }

  return sum;
}

function calcValueOfNode(node: Node): number {
  if (node.children.length === 0) {
    return node.metadata.reduce((prev, cur) => prev + cur);
  }

  let value = 0;
  for (const meta of node.metadata) {
    const idx = meta - 1;

    if (meta !== 0 && idx < node.children.length) {
      value += calcValueOfNode(node.children[idx]);
    }
  }

  return value;
}
