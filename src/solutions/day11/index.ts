import { isBetween } from "../../utilities/number.ts";
import { Solution } from "../../utilities/solver.ts";

export default class Day11 implements Solution {
  async solvePart1(input: string[]) {
    const seats = new Seats(input, 4, "king");
    seats.run();

    return seats.getSeats().filter((c) => c === "#").length;
  }

  async solvePart2(input: string[]) {
    const seats = new Seats(input, 5, "queen");
    seats.run();

    return seats.getSeats().filter((c) => c === "#").length;
  }
}

type PatternMatching = "queen" | "king";

type Place = "L" | "#" | ".";

class Seats {
  private currentState: Place[][];

  private adjacencyMatrix = [
    [-1, -1],
    [-1, 0],
    [-1, +1],
    [0, -1],
    [0, +1],
    [+1, -1],
    [+1, 0],
    [+1, +1],
  ];

  constructor(
    input: string[],
    private tolerance: number,
    private patternMatching: PatternMatching,
  ) {
    this.currentState = input.map((c) => c.split("") as Place[]);
  }

  run() {
    let didChange = true;
    while (didChange) {
      didChange = false;

      const copy = [...this.currentState.map((i) => [...i])];
      for (let y = 0; y < this.currentState.length; y++) {
        for (let x = 0; x < this.currentState[y].length; x++) {
          const currentSeat = this.currentState[y][x];
          let newSeat = currentSeat;
          const occupiedSeats = this.getAdjacentSeats(x, y).filter((s) =>
            s === "#"
          ).length;
          if (currentSeat === "L" && occupiedSeats === 0) {
            didChange = true;
            newSeat = "#";
          }
          if (currentSeat === "#" && occupiedSeats >= this.tolerance) {
            didChange = true;
            newSeat = "L";
          }

          copy[y][x] = newSeat;
        }
      }

      this.currentState = copy;
    }
  }

  getSeats() {
    return this.currentState.reduce((agg, curr) => {
      agg.push(...curr);
      return agg;
    }, [] as Place[]);
  }

  getAdjacentSeats(x: number, y: number) {
    return this.patternMatching === "king"
      ? this.getAdjacentSeatsForKing(x, y)
      : this.getAdjacentSeatsForQueen(x, y);
  }

  getAdjacentSeatsForQueen(x: number, y: number) {
    return this.adjacencyMatrix.map(([deltaX, deltaY]) =>
      this.getAdjacentSeatInDirection(x, y, deltaX, deltaY)
    );
  }

  getAdjacentSeatInDirection(
    x: number,
    y: number,
    deltaX: number,
    deltaY: number,
  ): Place {
    const posX = x + deltaX;
    const posY = y + deltaY;

    if (!this.isInsideBoundaries(posX, posY)) {
      return ".";
    }

    const current = this.currentState[posY][posX];

    return current === "."
      ? this.getAdjacentSeatInDirection(posX, posY, deltaX, deltaY)
      : current;
  }

  getAdjacentSeatsForKing(x: number, y: number) {
    return this.adjacencyMatrix.map((
      [deltaX, deltaY],
    ) => ([x + deltaX, y + deltaY])).map(([posX, posY]) =>
      this.isInsideBoundaries(posX, posY) ? this.currentState[posY][posX] : "."
    );
  }

  isInsideBoundaries(x: number, y: number) {
    return isBetween(x, 0, this.currentState[0].length - 1) &&
      isBetween(y, 0, this.currentState.length - 1);
  }
}
