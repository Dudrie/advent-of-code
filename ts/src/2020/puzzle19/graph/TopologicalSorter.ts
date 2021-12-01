import { Graph, GraphNode } from './Graph';

export class TopologicalSorter<T> {
  private readonly nodesToVisit: GraphNode<T>[];
  private readonly processed: Set<GraphNode<T>>;
  private readonly visited: Set<GraphNode<T>>;
  private readonly sortedNodes: GraphNode<T>[];

  constructor(graph: Graph<T>) {
    this.sortedNodes = [];
    this.visited = new Set();
    this.processed = new Set();
    this.nodesToVisit = graph.getAllNodes().filter((n) => !n.hasParent);

    this.sort();
  }

  /**
   * @returns Nodes of the given graph in topologically sorted order.
   */
  getSortedNodes(): readonly GraphNode<T>[] {
    return this.sortedNodes;
  }

  /**
   * Sorts the graph in topological order.
   *
   * After this operation ran successfully `sortedNodes` contains the nodes in topological order.
   *
   * @private
   */
  private sort(): void {
    while (this.nodesToVisit.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.processNode(this.nodesToVisit.pop()!);
    }
  }

  /**
   * Processes the node for topological sorting.
   *
   * @param node Node to process.
   * @private
   */
  private processNode(node: GraphNode<T>): void {
    if (!this.shouldNodeBeProcessed(node)) {
      return;
    }

    this.visited.add(node);

    for (const target of node.getEdges()) {
      this.processNode(target);
    }

    this.visited.delete(node);
    this.processed.add(node);
    this.sortedNodes.unshift(node);
  }

  /**
   * Checks if the node should be processed.
   *
   * @param node Node to check.
   * @returns True if the node is not already completely processed.
   * @throws `Error` - If a cycle is detected.
   * @private
   */
  private shouldNodeBeProcessed(node: GraphNode<T>): boolean {
    if (this.processed.has(node)) {
      return false;
    }

    if (this.visited.has(node)) {
      throw new Error(
        'Cycle in graph detected. Topological search is only available on acyclic graphs.'
      );
    }

    return true;
  }
}
