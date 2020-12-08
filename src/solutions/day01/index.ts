import { Solution } from "../../utilities/solver.ts";

export default class Day01 implements Solution {
  async solvePart1(input: string[]) {
    return input
      .map((i) => Number(i))
      .reduce(
        (agg, curr, _, arr) =>
          arr.some((n) => n !== curr && n + curr === 2020)
            ? [...agg, curr]
            : agg,
        [] as number[],
      )
      .reduce((agg, curr) => curr * agg, 1);
  }

  async solvePart2(input: string[]) {
    return input
      .map((i) => Number(i))
      .reduce(
        (agg, curr, _, arr) =>
          arr.some((n) =>
              n !== curr &&
              arr.some(((m) => m !== curr && n + m + curr === 2020))
            )
            ? [...agg, curr]
            : agg,
        [] as number[],
      )
      .reduce((agg, curr) => curr * agg, 1);
  }
}
