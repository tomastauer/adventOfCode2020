import { sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

export default class Day09 implements Solution {
  async solvePart1(input: string[]) {
    const preamble = 25;
    return input.map((i) => Number(i)).find((v, i, a) =>
      i > preamble &&
      !a.slice(i - preamble, i).some((n, _, r) => r.includes(v - n))
    )!;
  }

  async solvePart2(input: string[]) {
    const n = await this.solvePart1(input);
    const ii = input.map((i) => Number(i));

    const getUpper = (arr: number[], i: number) => {
      let s = 0;
      let j = i+1;
      while (s < n) {
        s = sum(arr.slice(i, j));
        j++;
      }

      return [(s === n), j-1] as const;
    };

    const q = ii.findIndex((_, i, a) => getUpper(a, i)[0]);

    const t = ii.slice(q, getUpper(ii, q)[1]);
    return Math.min(...t) + Math.max(...t);
  }
}
