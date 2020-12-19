import { TopologicalSorter } from './TopologicalSorter';

export class GraphNode<T> {
  private readonly value: T;
  private readonly edges: GraphNode<T>[];
  private _hasParent: boolean;

  get hasParent(): boolean {
    return this._hasParent;
  }

  constructor(value: T) {
    this.value = value;
    this.edges = [];
    this._hasParent = false;
  }

  /**
   * Adds an edge from this node to the given node.
   *
   * @param to Node this edge points towards.
   */
  addEdge(to: GraphNode<T>): void {
    this.edges.push(to);
    to.setHasParent(true);
  }

  /**
   * @returns The value of this node.
   */
  getValue(): T {
    return this.value;
  }

  /**
   * @returns A copy of all edges from this node.
   */
  getEdges(): readonly GraphNode<T>[] {
    return [...this.edges];
  }

  /**
   * @param hasParent Does this node have a parent?
   * @private
   */
  private setHasParent(hasParent: boolean): void {
    this._hasParent = hasParent;
  }
}

export class Graph<T> {
  private readonly nodes: GraphNode<T>[];

  constructor() {
    this.nodes = [];
  }

  /**
   * Adds a new node holding the given value to the graph.
   *
   * @param value Value of the node.
   */
  addNode(value: T): GraphNode<T> {
    const node: GraphNode<T> = new GraphNode<T>(value);
    this.nodes.push(node);
    return node;
  }

  /**
   * @param predicate Predicate for the node.
   * @returns The first node which fulfills the predicate.
   * @throws `Error` - If no node could be found.
   */
  getNode(predicate: (node: GraphNode<T>) => boolean): GraphNode<T> {
    const nodes: GraphNode<T>[] = this.nodes.filter(predicate);

    if (nodes.length === 0) {
      throw new Error('Could not find any node which fulfills the given predicate.');
    } else {
      return nodes[0];
    }
  }

  /**
   * Adds an edge from the first to the second node.
   *
   * @param from Starting node of the edge.
   * @param to Ending node of the edge.
   */
  addEdge(from: GraphNode<T>, to: GraphNode<T>): void {
    from.addEdge(to);
  }

  /**
   * @returns All nodes of this graph.
   */
  getAllNodes(): readonly GraphNode<T>[] {
    return [...this.nodes];
  }

  /**
   * @returns Nodes in topologically sorted order.
   */
  getNodesTopologicallySorted(): readonly GraphNode<T>[] {
    return new TopologicalSorter(this).getSortedNodes();
  }
}
