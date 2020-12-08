import { sum } from "../../utilities/array";
import { Solution } from "src/utilities/solver";

type Instruction = {
  instruction: string;
  value: number;
}

export default class Day08 implements Solution {
  async solvePart1(input: string[]) {
    const instructions = input.map((i) => {
      const [instruction, value] = i.split(" ");
      return { instruction, value: Number(value) };
    });
 
    const program = new Program(instructions);
    return program.run()[1];
  }

  async solvePart2(input: string[]) {
    const instructions = input.map((i) => {
      const [instruction, value] = i.split(" ");
      return { instruction, value: Number(value) };
    }).reduce((acc, curr, i, arr) => {
      if(curr.instruction !== 'acc') {
        const nop = [...arr];
        nop[i] = {instruction: 'nop', value: curr.value};

        const jmp = [...arr];
        jmp[i] = {instruction: 'jmp', value: curr.value}
        acc.push(nop, jmp);
      }

      return acc;
    }, [] as Instruction[][]);
 
    return instructions.map((i) => new Program(i).run()).find(p => p[0] === true)![1];
  }
}

class Program {
  constructor(private instructions: Instruction[]) {
  }

  run() {
    const visited: number[] = [];
    let pointer = 0;
    let registry = 0;
    while (pointer < this.instructions.length) {
      if (visited.includes(pointer)) {
        break;
      }
      const current = this.instructions[pointer];
      visited.push(pointer);
      if (current.instruction === "nop") {
        pointer++;
      }
      if (current.instruction === "acc") {
        registry += current.value;
        pointer++;
      }
      if (current.instruction === "jmp") {
        pointer += current.value;
      }
    }
    return [pointer >= this.instructions.length-1, registry] as const;
  }
}
