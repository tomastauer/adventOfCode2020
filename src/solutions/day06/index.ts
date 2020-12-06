import { sum } from "../../utilities/array";
import { Solution } from "src/utilities/solver";

export default class Day01 implements Solution {
  async solvePart1(input: string[]) {
    return sum(
      input
        .join("\n")
        .split("\n\n")
        .map((g) => new Set([...g.replace(/\n/g, "")]).size)
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
              ...a.map((e) => e.filter((u) => a.every((y) => y.includes(u))))
            ).size
        )
    );
  }
}
