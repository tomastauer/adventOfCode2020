import { Solution } from "../../utilities/solver.ts";

export default class Day15 implements Solution {
  async solvePart1(input: string[]) {
    const memGame = this.memoryGame(input);
    for (let i = 0; i < 2019; i++) {
      memGame.next();
    }

    return memGame.next().value as number;
  }

  async solvePart2(input: string[]) {
    const memGame = this.memoryGame(input);
    for (let i = 0; i < 29999999; i++) {
      memGame.next();
    }

    return memGame.next().value as number;
  }

  *memoryGame(input: string[]) {
    const a = input[0].split(",").map((c) => Number(c));
    const mapping: Record<number, number[]> = {};

    for (let i = 0; i < a.length; i++) {
      mapping[a[i]] = [i + 1];
      yield a[i];
    }

    let turn = a.length + 1;
    let last = a[a.length - 1];

    while (true) {
      const indices = mapping[last];
      if (indices.length === 1 && indices[0] === turn - 1) {
        last = 0;
        (mapping[last] = mapping[last] ?? []).push(turn);
      } else {
        last = indices[indices.length - 1] - indices[indices.length - 2];
        if (!mapping[last]) {
          mapping[last] = [turn];
        } else {
          mapping[last] = [mapping[last][mapping[last].length - 1], turn];
        }
      }

      turn++;
      yield last;
    }
  }
}
