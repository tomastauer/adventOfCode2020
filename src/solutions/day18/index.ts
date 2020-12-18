import { Solution } from "../../utilities/solver.ts";
import { sum } from "../../utilities/array.ts";

const parensPattern = /\(([\d \+\*]+)\)/;
const plusPattern = /\d+ \+ \d+/;

export default class Day18 implements Solution {
  async solvePart1(input: string[]) {
    return sum(input.map((i) => this.solve(i)));
  }

  async solvePart2(input: string[]) {
    return sum(input.map((i) => this.solve2(i)));
  }

  solve(input: string) {
    let i = input;
    while (parensPattern.test(i)) {
      i = this.solveSomeParentheses(i);
    }

    return this.solveSimpleSubproblem(i);
  }

  solveSimpleSubproblem(input: string) {
    return input.split(" ").reduce(
      (agg, curr) =>
        (["+", "*"].includes(curr))
          ? { ...agg, operator: curr }
          : { ...agg, result: eval(`${agg.result}${agg.operator}${curr}`) },
      { result: 0, operator: "+" },
    ).result;
  }

  solveSomeParentheses(input: string) {
    const match = input.match(parensPattern)![1];
    return input.replace(
      parensPattern,
      this.solveSimpleSubproblem(match).toString(),
    );
  }

  solve2(input: string) {
    let i = input;
    while (parensPattern.test(i)) {
      i = this.solveSomeParentheses2(i);
    }

    return this.solveSimpleSubproblemWithAdditionPrecedence(i);
  }

  solveSimpleSubproblemWithAdditionPrecedence(input: string) {
    return eval(this.solveAdditions(input));
  }

  solveAdditions(input: string) {
    let l = input;
    while (plusPattern.test(l)) {
      const match = l.match(plusPattern)![0];
      l = l.replace(plusPattern, this.solveSimpleSubproblem(match).toString());
    }

    return l;
  }

  solveSomeParentheses2(input: string) {
    const match = input.match(parensPattern)![1];
    return input.replace(
      parensPattern,
      this.solveSimpleSubproblemWithAdditionPrecedence(match).toString(),
    );
  }
}
