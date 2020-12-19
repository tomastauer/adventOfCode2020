import { Solution } from "../../utilities/solver.ts";

export default class Day19 implements Solution {
  async solvePart1(input: string[]) {
    const parts = input.join("\n").split("\n\n").map((c) => c.split("\n"));

    const automata = new Automata(parts[0]);
    return parts[1].filter((p) => automata.accept(p)).length;
  }

  async solvePart2(input: string[]) {
    const parts = input.join("\n").replace("8: 42", "8: 42 | 42 8").replace(
      "11: 42 31",
      "11: 42 31 | 42 11 31",
    ).split("\n\n").map((c) => c.split("\n"));

    const automata = new Automata(parts[0]);
    return parts[1].filter((p) => automata.accept(p)).length;
  }
}

const rulePattern = /(\d+): (.*)/;

class Automata {
  rule: RegExp;

  constructor(input: string[]) {
    const r = this.parseRules(input)["0"].join("");
    this.rule = new RegExp(`^${this.cleanUp(r.substring(1, r.length - 1))}$`);
    console.log(this.rule);
  }

  public accept(input: string) {
    return this.rule.test(input);
  }

  public cleanUp(input: string) {
    let r = input;
    while (r.length !== r.replace(/\((\w+)\)/, "$1").length) {
      r = r.replace(/\((\w+)\)/, "$1");
    }

    return r;
  }

  parseRules(rules: string[]) {
    const r = rules.reduce((agg, curr) => {
      const match = curr.match(rulePattern)!;
      agg[match[1]] = `( ${match[2].replaceAll("|", ")|(")} )`.split(" ");
      return agg;
    }, {} as Record<string, string[]>);

    const memo: Record<string, string[]> = {};
    const result: Record<string, string[]> = {};
    const resolveRule = (rule: string, depth: number) => {
      return r[rule].reduce((agg, curr) => {
        if (memo[curr]) {
          return memo[curr];
        }

        if (["(", ")", ")|("].includes(curr)) {
          agg.push(curr);
        } else if (curr === '"a"') {
          agg.push("a");
        } else if (curr === '"b"') {
          agg.push("b");
        } else if (depth < 15) {
          const resolved = resolveRule(curr, depth + 1);
          agg.push("(", ...resolved, ")");
        }

        return agg;
      }, [] as string[]);
    };

    Object.keys(r).forEach((k) => {
      result[k] = resolveRule(k, 0);
    });

    return result;
  }
}
