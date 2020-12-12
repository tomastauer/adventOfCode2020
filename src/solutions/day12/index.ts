import { sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

type Direction = "N" | "E" | "W" | "S";

const directions = ["N", "E", "S", "W"];

export default class Day12 implements Solution {
  async solvePart1(input: string[]) {
    return sum(
      input.map((i) => {
        const [, instruction, value] = i.match(/(\w)(\d+)/)!;
        return { instruction, value: Number(value) };
      }).reduce((agg, curr) => {
        const [x, y] = agg.position;

        const moveInDirection = (direction: Direction, value: number) => {
          if (direction === "N") {
            return { ...agg, position: [x + value, y] };
          }

          if (direction === "E") {
            return { ...agg, position: [x, y + value] };
          }

          if (direction === "S") {
            return { ...agg, position: [x - value, y] };
          }

          if (direction === "W") {
            return { ...agg, position: [x, y - value] };
          }

          return agg;
        };

        if (curr.instruction === "F") {
          return moveInDirection(agg.facing as Direction, curr.value);
        } else if (curr.instruction === "L") {
          return {
            ...agg,
            facing:
              directions[
                (directions.indexOf(agg.facing) - curr.value / 90 + 4) % 4
              ],
          };
        } else if (curr.instruction === "R") {
          return {
            ...agg,
            facing:
              directions[
                (directions.indexOf(agg.facing) + curr.value / 90) % 4
              ],
          };
        } else {
          return moveInDirection(curr.instruction as Direction, curr.value);
        }
      }, { facing: "E", position: [0, 0] }).position.map(Math.abs),
    );
  }

  async solvePart2(input: string[]) {
    return sum(
      input.map((i) => {
        const [, instruction, value] = i.match(/(\w)(\d+)/)!;
        return { instruction, value: Number(value) };
      }).reduce((agg, { instruction, value }) => {
        console.log(agg, instruction, value);
        const [x, y] = agg.position;
        const [wx, wy] = agg.waypoint;

        const rotateWaypoint = ([xx, yy]: number[], times: number) => {
          if (times === 1) {
            return [-yy, xx];
          } else if (times === 2) {
            return [-xx, -yy];
          } else if (times === 3) {
            return [yy, -xx];
          }
          return [xx, yy];
        };

        if (instruction === "N") {
          return { ...agg, waypoint: [wx + value, wy] };
        } else if (instruction === "E") {
          return { ...agg, waypoint: [wx, wy + value] };
        } else if (instruction === "S") {
          return { ...agg, waypoint: [wx - value, wy] };
        } else if (instruction === "W") {
          return { ...agg, waypoint: [wx, wy - value] };
        } else if (instruction === "F") {
          return { ...agg, position: [x + value * wx, y + value * wy] };
        } else if (instruction === "L") {
          return {
            ...agg,
            waypoint: rotateWaypoint(agg.waypoint, ((-value / 90) + 4) % 4),
          };
        } else if (instruction === "R") {
          return {
            ...agg,
            waypoint: rotateWaypoint(agg.waypoint, ((value / 90) + 4) % 4),
          };
        }

        return agg;
      }, { position: [0, 0], waypoint: [1, 10] }).position.map(Math.abs),
    );
  }
}
