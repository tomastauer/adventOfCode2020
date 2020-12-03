import { sum } from "../../utilities/array";
import { Solution } from "src/utilities/solver";

export default class Day01 implements Solution {
  async solvePart1(input: string[]) {
    const forest = new Forest(input);
    return sum(Array.from(forest.traverse(3, 1)));
  }

  async solvePart2(input: string[]) {
    const forest = new Forest(input);

    return [
      forest.traverse(1, 1),
      forest.traverse(3, 1),
      forest.traverse(5, 1),
      forest.traverse(7, 1),
      forest.traverse(1, 2),
    ]
      .map((g) => Array.from(g))
      .map((a) => sum(a as number[]))
      .reduce((a, c) => a * c, 1);
  }
}

class Forest {
  map: string[][];
  position: [number, number];
  width: number;

  constructor(map: string[]) {
    this.map = map.map((m) => m.split(""));
    this.width = this.map[0].length;
    this.position = [0, 0];
  }

  public reset() {
    this.position = [0, 0];
  }

  public *traverse(x: number, y: number) {
    while (this.position[1] + y < this.map.length) {
      this.position = [this.position[0] + x, this.position[1] + y];
      const [posX, posY] = this.position;

      yield this.map[posY][posX % this.width] === "#" ? 1 : 0;
    }
    this.reset();
  }
}
