import { Solution } from "../../utilities/solver.ts";
import { isBetween } from "../../utilities/number.ts";
import { sum } from "../../utilities/array.ts";

type Point = {
  x: number;
  y: number;
  z: number;
  hash: number;
};

type Point4d = {
  x: number;
  y: number;
  z: number;
  w: number;
  hash: number;
};

export default class Day17 implements Solution {
  async solvePart1(input: string[]) {
    const game = new Game3d(input).iterate();
    for (let i = 0; i < 5; i++) {
      game.next();
    }

    return (game.next().value as Point[]).length;
  }

  async solvePart2(input: string[]) {
    const game = new Game4d(input).iterate();
    for (let i = 0; i < 5; i++) {
      game.next();
    }

    return (game.next().value as Point4d[]).length;
  }
}

class Game3d {
  private cubes: Point[] = [];

  constructor(input: string[]) {
    input.map((row, y) =>
      row.split("").map((col, x) => {
        if (col === "#") {
          this.cubes.push(this.factory(x, y, 0));
        }
      })
    );
  }

  *iterate() {
    while (true) {
      const newLife: Point[] = [];
      this.getAllNeighbors(this.cubes).forEach((c) => {
        const a = this.analyzeNeighbors(c);
        if (
          (this.contains(this.cubes, c) && isBetween(a.active, 2, 3)) ||
          (!this.contains(this.cubes, c) && a.active === 3)
        ) {
          newLife.push(c);
        }
      });
      this.cubes = newLife;
      yield newLife;
    }
  }

  getAllNeighbors(cubes: Point[]) {
    return this.makeUnique(cubes.flatMap((p) => this.getNeighbors(p)));
  }

  getNeighbors(point: Point) {
    const neighbors: Point[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x || y || z) {
            neighbors.push(this.factory(x + point.x, y + point.y, z + point.z));
          }
        }
      }
    }

    return neighbors;
  }

  analyzeNeighbors(point: Point) {
    const toAnalyze = this.getNeighbors(point);
    const active = toAnalyze.filter((a) => this.contains(this.cubes, a)).length;

    return { active, inActive: 26 - active };
  }

  makeUnique(points: Point[]) {
    const hashes: number[] = [];

    return points.filter((p) => {
      if (hashes.includes(p.hash)) {
        return false;
      }
      hashes.push(p.hash);
      return true;
    });
  }

  arePointsSame(one: Point, two: Point) {
    return one.x === two.x && one.y === two.y && one.z === two.z;
  }

  contains(cubes: Point[], cube: Point) {
    return Boolean(cubes.find((c) => this.arePointsSame(c, cube)));
  }

  factory(x: number, y: number, z: number) {
    return { x, y, z, hash: x + 10000 * y + 100000000 * z };
  }
}

class Game4d {
  private cubes: Point4d[] = [];

  constructor(input: string[]) {
    input.map((row, y) =>
      row.split("").map((col, x) => {
        if (col === "#") {
          this.cubes.push(this.factory(x, y, 0, 0));
        }
      })
    );
  }

  *iterate() {
    while (true) {
      const newLife: Point4d[] = [];

      this.getAllNeighbors(this.cubes).forEach((c) => {
        const a = this.analyzeNeighbors(c);
        if (
          (this.contains(this.cubes, c) && isBetween(a.active, 2, 3)) ||
          (!this.contains(this.cubes, c) && a.active === 3)
        ) {
          newLife.push(c);
        }
      });
      this.cubes = newLife;
      yield newLife;
    }
  }

  getAllNeighbors(cubes: Point4d[]) {
    return this.makeUnique(cubes.flatMap((p) => this.getNeighbors(p)));
  }

  getNeighbors(point: Point4d) {
    const neighbors: Point4d[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          for (let w = -1; w <= 1; w++) {
            if (x || y || z || w) {
              neighbors.push(
                this.factory(
                  x + point.x,
                  y + point.y,
                  z + point.z,
                  w + point.w,
                ),
              );
            }
          }
        }
      }
    }

    return neighbors;
  }

  analyzeNeighbors(point: Point4d) {
    const toAnalyze = this.getNeighbors(point);
    const active = toAnalyze.filter((a) => this.contains(this.cubes, a)).length;

    return { active, inActive: 80 - active };
  }

  makeUnique(points: Point4d[]) {
    const hashes: number[] = [];

    return points.filter((p) => {
      if (hashes.includes(p.hash)) {
        return false;
      }
      hashes.push(p.hash);
      return true;
    });
  }

  arePointsSame(one: Point4d, two: Point4d) {
    return one.x === two.x && one.y === two.y && one.z === two.z &&
      one.w === two.w;
  }

  contains(cubes: Point4d[], cube: Point4d) {
    return Boolean(cubes.find((c) => this.arePointsSame(c, cube)));
  }

  factory(x: number, y: number, z: number, w: number) {
    return { x, y, z, w, hash: x + 100 * y + 10000 * z + 1000000 * w };
  }
}
