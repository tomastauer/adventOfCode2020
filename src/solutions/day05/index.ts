import { isBetween } from "../../utilities/number";
import { Solution } from "src/utilities/solver";

export default class Day01 implements Solution {
  async solvePart1(input: string[]) {
    return Math.max(
      ...input
        .map((i) => i.replace(/F|L/g, "0").replace(/B|R/g, "1"))
        .map((i) => parseInt(i, 2))
    );
  }

  async solvePart2(input: string[]) {
    return (
      input
        .map((i) => i.replace(/F|L/g, "0").replace(/B|R/g, "1"))
        .map((i) => parseInt(i, 2))
        .find(
          (value, _, arr) =>
            arr.includes(value) &&
            arr.includes(value + 2) &&
            !arr.includes(value + 1)
        )! + 1
    );
  }
}
