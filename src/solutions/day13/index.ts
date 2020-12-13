import { Solution } from "../../utilities/solver.ts";

export default class Day12 implements Solution {
  async solvePart1(input: string[]) {
    const desiredTime = Number(input[0]);
    const first = input[1].split(",").filter((c) => c !== "x").map((c) => ({
      id: Number(c),
      departsIn: Math.ceil(desiredTime / Number(c)) * Number(c) - desiredTime,
    })).sort((a, b) => a.departsIn - b.departsIn)[0];

    return first.departsIn * first.id;
  }

  async solvePart2(input: string[]) {
    const n = input[1].split(",").map((c, i) => ({ n: Number(c), offset: i }))
      .filter((c) => !isNaN(c.n));
    let o = 0;
    let c = n[0].n;

    for (let i = 1; i < n.length; i++) {
      for (let j = 0; j < n[i].n; j++) {
        if (((o + c * j) + n[i].offset) % n[i].n === 0) {
          if (i === n.length - 1) {
            return o + c * j;
          }
          o = o + c * j;
          c = c * n[i].n;
          break;
        }
      }
    }

    return 0;
  }
}
