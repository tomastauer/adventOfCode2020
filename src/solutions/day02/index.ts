import { Solution } from "src/utilities/solver";

export default class Day02 implements Solution {
  async solvePart1(input: string[]) {
    return input
      .map((t) => {
        const groups = t.match(/(\d+)-(\d+) (\w+): (\w+)/)!;
        return {
          lowerBound: parseInt(groups[1]),
          upperBound: parseInt(groups[2]),
          literal: groups[3],
          password: groups[4],
        };
      })
      .filter((p) => {
        const o = p.password.split("").filter((q) => q === p.literal).length;
        return o >= p.lowerBound && o <= p.upperBound;
      }).length;
  }

  async solvePart2(input: string[]) {
    return input
      .map((t) => {
        const groups = t.match(/(\d+)-(\d+) (\w+): (\w+)/)!;
        return {
          lowerBound: parseInt(groups[1]),
          upperBound: parseInt(groups[2]),
          literal: groups[3],
          password: groups[4],
        };
      })
      .filter(
        (p) =>
          Number(p.password[p.lowerBound - 1] === p.literal) +
            Number(p.password[p.upperBound - 1] === p.literal) ===
          1
      ).length;
  }
}
