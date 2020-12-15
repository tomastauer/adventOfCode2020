import { sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";
import { replaceAt } from "../../utilities/string.ts";

const maskPattern = /^mask = ([X01]+)/;
const memoryPattern = /^mem\[(\d+)\] = (\d+)/;

export default class Day14 implements Solution {
  async solvePart1(input: string[]) {
    return sum(
      input.reduce((agg, curr) => {
        if (maskPattern.test(curr)) {
          agg.currentMask = curr.match(maskPattern)![1];
        }

        if (memoryPattern.test(curr)) {
          const m = curr.match(memoryPattern)!;
          agg.memory[Number(m[1])] = this.maskValue(m[2], agg.currentMask);
        }

        return agg;
      }, { currentMask: "", memory: [] as number[] }).memory,
    );
  }

  async solvePart2(input: string[]) {
    return sum(
      Object.values(
        input.reduce((agg, curr) => {
          if (maskPattern.test(curr)) {
            agg.currentMask = curr.match(maskPattern)![1];
          }

          if (memoryPattern.test(curr)) {
            const m = curr.match(memoryPattern)!;
            agg.memory = {
              ...agg.memory,
              ...this.maskFloating(m[1], agg.currentMask, m[2]),
            };
          }

          return agg;
        }, { currentMask: "", memory: {} as Record<number, number> })
      .memory),
    );
  }

  maskValue(value: string, mask: string) {
    return parseInt(
      Number(value).toString(2).padStart(36, "0").split("").map((c, i) =>
        mask[i] === "X" ? c : mask[i]
      ).join(""),
      2,
    );
  }

  maskFloating(memoryValue: string, mask: string, value: string) {
    const memoryValues = [
      Number(memoryValue).toString(2).padStart(36, "0").split("").map((c, i) =>
        mask[i] === "0" ? c : mask[i]
      ).join(""),
    ];

    for (let i = 0; i < memoryValues.length; i++) {
      const idx = memoryValues[i].indexOf("X");
      if (idx === -1) {
        break;
      }

      memoryValues.push(
        replaceAt(memoryValues[i], idx, "0"),
        replaceAt(memoryValues[i], idx, "1"),
      );
    }

    return memoryValues.filter((c) => c.indexOf("X") === -1).map((c) =>
      parseInt(c, 2)
    ).reduce((agg, curr) => {
      agg[curr] = Number(value);
      return agg;
    }, [] as number[]);
  }
}
