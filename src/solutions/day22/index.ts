import { sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

export default class Day22 implements Solution {
  async solvePart1(input: string[]) {
    const [player1, player2] = input.join("\n").split("\n\n").map((a) => {
      const [, ...cards] = a.split("\n");
      return cards.map((c) => Number(c));
    });

    while (player1.length && player2.length) {
      const c1 = player1.shift()!;
      const c2 = player2.shift()!;

      if (c1 > c2) {
        player1.push(c1, c2);
      } else {
        player2.push(c2, c1);
      }
    }

    const winner = player1.length ? player1 : player2;
    return sum(winner.map((c, i) => c * (winner.length - i)));
  }

  async solvePart2(input: string[]) {
    const [player1, player2] = input.join("\n").split("\n\n").map((a) => {
      const [, ...cards] = a.split("\n");
      return cards.map((c) => Number(c));
    });

    const [, r1, r2] = this.playRecursively(player1, player2);

    const winner = r1.length ? r1 : r2;

    return sum(winner.map((c, i) => c * (winner.length - i)));
  }

  playRecursively(player1: number[], player2: number[]) {
    const gameMemo = new Set<string>();
    while (player1.length && player2.length) {
      const c1 = player1.shift()!;
      const c2 = player2.shift()!;

      let winner;
      if (player1.length >= c1 && player2.length >= c2) {
        [winner] = this.playRecursively(
          player1.slice(0, c1),
          player2.slice(0, c2),
        );
      } else {
        winner = (c1 > c2) ? 1 : 2;
      }
      if (winner === 1) {
        player1.push(c1, c2);
      } else {
        player2.push(c2, c1);
      }

      if (gameMemo.has(`${player1} ${player2}`)) {
        return [1, player1, player2] as const;
      }

      gameMemo.add(`${player1} ${player2}`);
    }

    return [player1.length ? 1 : 2, player1, player2] as const;
  }
}
