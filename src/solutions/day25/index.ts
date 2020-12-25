import { Solution } from "../../utilities/solver.ts";

export default class Day25 implements Solution {
  async solvePart1(input: string[]) {
    const [cardKey, doorKey] = input.map(c => Number(c));
    return this.determineEncryptionKey(doorKey, this.determineLoopSize(cardKey))
  }

  async solvePart2(input: string[]) {
    return 0;
  }

  determineLoopSize(input: number) {
    let value = 1;
    const subjectValue = 7;
    for(let i = 1; i < 20201227; i++) {
      value *= subjectValue;
      value %= 20201227;
      if(value === input) {
        return i;
      }
    }

    return 0; 
  }

  determineEncryptionKey(publicKey: number, loopSize: number) {
    let value = 1;
    for(let i = 1; i <= loopSize; i++) {
      value *= publicKey;
      value %= 20201227;
    }

    return value; 
  }
}
