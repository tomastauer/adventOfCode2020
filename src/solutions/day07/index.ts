import { sum } from "../../utilities/array";
import { Solution } from "src/utilities/solver";

export default class Day01 implements Solution {
  async solvePart1(input: string[]) {
    const tree = new Tree(input);
    return tree.traverseAllParents('shiny gold').length;
  }

  async solvePart2(input: string[]) {
    const tree = new Tree(input);
    return tree.countAllChildren('shiny gold') - 1;
  }
}

const bagPattern = /(\d+) (.*) bags?\.?/;

type Node = { type: string; children: ChildNode[]; parents: Node[] };
type ChildNode = { amount: number; node: Node };

class Tree {
  forestNodes: Record<string, Node>;

  constructor(input: string[]) {
    const nodes = input
      .map((i) => {
        const [node, allChildren] = i.split(" bags contain ");
        const children = allChildren
          .split(", ")
          .filter((c) => bagPattern.test(c))
          .map((c) => {
            const [, amount, type] = c.match(bagPattern)!;
            return { amount: Number(amount), type };
          });
        return [node, children] as const;
      })
      .reduce((agg, [node, children]) => {
        agg[node] = children;
        return agg;
      }, {} as Record<string, { amount: number; type: string }[]>);

    const forestNodes: Record<string, Node> = {};

    Object.keys(nodes).forEach((n) => {
      const currNode =
        forestNodes[n] ??
        (forestNodes[n] = { type: n, children: [], parents: [] });
      nodes[n].forEach((child) => {
        const childNode =
          forestNodes[child.type] ??
          (forestNodes[child.type] = {
            type: child.type,
            children: [],
            parents: [],
          });
        currNode.children.push({ amount: child.amount, node: childNode });
        childNode.parents.push(currNode);
      });
    });

    this.forestNodes = forestNodes;
  }

  traverseAllParents(type: string) {
    const toBeProcessed = [];
    const uniqueParents = new Set<string>();

    const node = this.forestNodes[type];
    toBeProcessed.push(...node.parents);
    let parent: Node | undefined;
    while ((parent = toBeProcessed.pop())) {
      if (!uniqueParents.has(parent.type)) {
        toBeProcessed.push(...parent.parents);
      }
      uniqueParents.add(parent.type);
    }

    return [...uniqueParents];
  }

  countAllChildren(type: string): number {
    const node = this.forestNodes[type];
    return sum(node.children.map(c => c.amount * this.countAllChildren(c.node.type))) + 1;
  }
}
