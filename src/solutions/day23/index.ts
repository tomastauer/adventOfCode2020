import { numberRange, sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

type Cup = {
  next: Cup;
  value: number;
}

export default class Day23 implements Solution {
  async solvePart1(input: string[]) {
    const cups = input[0].split("").map((c) => Number(c));

    let currentCup = this.playGame(cups, 100);
    const result = [];

    for(let i = 0; i<cups.length-1;i++) {
      currentCup = currentCup.next;
      result.push(currentCup.value);
    }

    return result.join('');
  }

  async solvePart2(input: string[]) {
    const i = input[0].split("").map((c) => Number(c));
    const cups = numberRange(0, 1000000).map(v => i[v] ?? v+1);
    const firstCup = this.playGame(cups, 10000000);
    
    return firstCup.next.value * firstCup.next.next.value;
  }

  playGame(input: number[], rounds: number) {
    let currentCup!: Cup;
    let firstCup!: Cup;
    const valueCups: Cup[] = [];

    input.forEach((value) => {
      const newCup = {
        next: null,
        value
      } as unknown as Cup;
      valueCups[value] = newCup;

      if(currentCup) {
        currentCup.next = newCup;
      } else {
        firstCup = newCup;
      }

      currentCup = newCup;
    });

    const total = valueCups.length - 1;

    currentCup.next = firstCup;
    currentCup = firstCup;


    for(let round = 0; round < rounds; round ++) {
      const nextThree = [currentCup.next, currentCup.next.next, currentCup.next.next.next];
      const destinationValueCandidates = numberRange(1, 4).map(i => ((currentCup.value + total - i) % total)||total);
      const destinationValue = destinationValueCandidates.find(v => !nextThree.map(c => c.value).includes(v))!;
      const destinationCup = valueCups[destinationValue];

      currentCup.next = nextThree[2].next;

      const tmp = destinationCup.next;
      destinationCup.next = nextThree[0];
      nextThree[2].next = tmp;

      currentCup = currentCup.next;
    }

    return valueCups[1];
  }
}
