import { Solution } from "../../utilities/solver.ts";

export default class Day10 implements Solution {
  async solvePart1(input: string[]) {
    const g = input.map((i) => Number(i)).sort((a, b) => a - b).reduce(
      (agg, curr) => {
        agg[(curr - agg.j) as 1 | 2 | 3]++;
        agg.j = curr;
        return agg;
      },
      { j: 0, 1: 0, 2: 0, 3: 1 },
    );
    return g[1] * g[3];
  }

  async solvePart2(input: string[]) {
    return [0, ...input.map((i) => Number(i))].sort((a, b) => a - b).reduce(
      (agg, curr, _) => {
        const last = agg.pop() || [];

        if (!last.length || curr - last[last.length - 1] < 3) {
          last.push(curr);
          agg.push(last);
        } else agg.push(last, [curr]);

        return agg;
      },
      [] as number[][],
    ).map((i) => this.getCombinations(i.length - 1)).reduce((a, c) => a * c, 1);
  }

  private cache = [1, 1, 2];

  getCombinations(input: number): number {
    return (this.cache[input] = this.cache[input] ??
      this.getCombinations(input - 1) + this.getCombinations(input - 2) +
        this.getCombinations(input - 3));
  }
}
