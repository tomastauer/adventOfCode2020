import { numberRange, sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

const rowPattern = /(se)|(sw)|(ne)|(nw)|(e)|(w)/g;

export default class Day24 implements Solution {
  async solvePart1(input: string[]) {
    const grid: boolean[][] = new Array(500).fill(0).map((i) =>
      new Array(500).fill(false)
    );

    input.map((i) => i.match(rowPattern)!).forEach((instructions) => {
      let currX = 250;
      let currY = 250;

      instructions.forEach((i) => {
        const [newX, newY] = this.move(currX, currY, i);
        currX = newX;
        currY = newY;
      });

      grid[currY][currX] = !grid[currY][currX];
    });

    return grid.reduce((g, c) => g + c.reduce((a, w) => a + Number(w), 0), 0);
  }

  async solvePart2(input: string[]) {
    let grid: boolean[][] = new Array(500).fill(0).map((i) =>
      new Array(500).fill(false)
    );

    input.map((i) => i.match(rowPattern)!).forEach((instructions) => {
      let currX = 250;
      let currY = 250;

      instructions.forEach((i) => {
        const [newX, newY] = this.move(currX, currY, i);
        currX = newX;
        currY = newY;
      });

      grid[currY][currX] = !grid[currY][currX];
    });


    for(let i =0; i<100; i++) {
      const copy = grid.map(row => row.map(b => b));

      for(let row = 1; row < copy.length-1; row++) {
        for(let col=1; col < copy.length-1; col++) {
          const adjacent = this.getAdjacent(row, col, grid).filter(Boolean);
          const current = grid[row][col];
          copy[row][col] = current;

          if(current && (adjacent.length === 0 || adjacent.length > 2)) {
            copy[row][col] = false;
          } else if (!current && adjacent.length === 2) {
            copy[row][col] = true;
          }
        }
      }

      grid = copy;
    }

    return grid.reduce((g, c) => g + c.reduce((a, w) => a + Number(w), 0), 0);
  }

  getAdjacent(currX: number, currY: number, grid: boolean[][]) {
    return [
      [currX, currY - 1],
      [currX + 1, currY - 1],
      [currX - 1, currY + 1],
      [currX, currY + 1],
      [currX + 1, currY],
      [currX - 1, currY],
    ].map(([x, y]) => grid[x][y]);
  }

  move(currX: number, currY: number, instruction: string) {
    switch (instruction) {
      case "nw":
        return [currX, currY - 1] as const;
      case "ne":
        return [currX + 1, currY - 1] as const;
      case "sw":
        return [currX - 1, currY + 1] as const;
      case "se":
        return [currX, currY + 1] as const;
      case "e":
        return [currX + 1, currY] as const;
      default:
      case "w":
        return [currX - 1, currY] as const;
    }
  }
}
