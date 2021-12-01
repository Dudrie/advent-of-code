import { RuleDescriptionForFactory } from './RuleDescriptionForFactory';
import { Rule } from './Rule';
import { Graph } from '../graph/Graph';

export class RuleFactory {
  /**
   * Sorted list of rule descriptions.
   *
   * @private
   */
  private readonly descriptions: Map<number, RuleDescriptionForFactory>;

  /**
   * Graph indicating the dependencies.
   */
  private readonly descriptionGraph: Graph<RuleDescriptionForFactory>;

  constructor(private readonly lines: string[]) {
    this.descriptions = new Map();
    this.descriptionGraph = new Graph();

    lines.forEach((i) => this.parseInputLine(i));
    this.buildGraphEdges();
  }

  /**
   * @returns Rules generated accordingly to the given lines.
   */
  getRules(): Rule[] {
    const descriptionsSorted = this.descriptionGraph.getNodesTopologicallySorted();
    const rules: Map<number, Rule> = new Map();

    for (const descNode of descriptionsSorted) {
      const rule = descNode.getValue().generateRule(rules);
      rules.set(descNode.getValue().id, rule);
    }

    return [...rules.values()].sort((a, b) => a.id - b.id);
  }

  /**
   * Parses the input line and adds it to the descriptions.
   *
   * @param input Line to parse.
   * @private
   */
  private parseInputLine(input: string): void {
    const description: RuleDescriptionForFactory = new RuleDescriptionForFactory(input);

    this.descriptions.set(description.id, description);
    this.descriptionGraph.addNode(description);
  }

  /**
   * Builds the edges of the graph.
   *
   * Lines need to be parsed **before** calling this function.
   * @private
   */
  private buildGraphEdges(): void {
    for (const description of this.descriptions.values()) {
      const nodeOfDesc = this.descriptionGraph.getNode((n) => n.getValue().id === description.id);

      for (const dependencyId of description.getDependencies()) {
        const nodeOfDependency = this.descriptionGraph.getNode(
          (n) => n.getValue().id === dependencyId
        );
        nodeOfDependency.addEdge(nodeOfDesc);
      }
    }
  }
}
