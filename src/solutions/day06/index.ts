import { sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

export default class Day06 implements Solution {
  async solvePart1(input: string[]) {
    return sum(
      input
        .join("\n")
        .split("\n\n")
        .map((g) => new Set([...g.replace(/\n/g, "")]).size),
    );
  }

  async solvePart2(input: string[]) {
    return sum(
      input
        .join("\n")
        .split("\n\n")
        .map((g) => g.split("\n").map((r) => [...r]))
        .map(
          (a) =>
            new Set(
              ...a.map((e) => e.filter((u) => a.every((y) => y.includes(u)))),
            ).size,
        ),
    );
  }
}
