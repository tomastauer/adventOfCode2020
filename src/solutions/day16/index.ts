import { Solution } from "../../utilities/solver.ts";
import { isBetween } from "../../utilities/number.ts";
import { sum } from "../../utilities/array.ts";

type Rule = {
  name: string;
  range1: {
    lower: number;
    upper: number;
  };
  range2: {
    lower: number;
    upper: number;
  };
};

type ParsedTicket = {
  values: number[];
};

export default class Day16 implements Solution {
  async solvePart1(input: string[]) {
    const ticket = new Ticket(input);
    return ticket.validateNearbyTickets();
  }

  async solvePart2(input: string[]) {
    const ticket = new Ticket(input);
    ticket.discardInvalidTickets();
    const myTicket = Object.entries(ticket.determineColumns()).reduce(
      (agg, [name, index]) => {
        agg[name] = ticket.myTicket.values[index];
        return agg;
      },
      {} as Record<string, number>,
    );

    return Object.entries(myTicket).filter(([name]) =>
      name.startsWith("departure")
    ).map((c) => c[1]).reduce((agg, curr) => agg * curr, 1);
  }
}

const rulePattern = /([\s\w]+): (\d+)-(\d+) or (\d+)-(\d+)/;

class Ticket {
  private rules!: Rule[];
  private nearbyTickets!: ParsedTicket[];
  public myTicket: ParsedTicket;

  constructor(input: string[]) {
    const [rules, myTicket, nearbyTickets] = input.join("\n").split("\n\n").map(
      (c) => c.split("\n"),
    );

    this.parseRules(rules);
    this.parseNearbyTickets(nearbyTickets);
    this.myTicket = { values: myTicket[1].split(",").map(Number) };
  }

  parseRules(rules: string[]) {
    this.rules = rules.map((r) => {
      const match = r.match(rulePattern)!;
      return {
        name: match[1],
        range1: {
          lower: Number(match[2]),
          upper: Number(match[3]),
        },
        range2: {
          lower: Number(match[4]),
          upper: Number(match[5]),
        },
      };
    });
  }

  parseNearbyTickets(tickets: string[]) {
    const [, ...tail] = tickets;

    this.nearbyTickets = tail.map((t) => t.split(",").map(Number)).map((c) => ({
      values: c,
    }));
  }

  public validateNearbyTickets() {
    return sum(
      this.nearbyTickets.flatMap((c) => c.values).filter((v) =>
        !this.rules.some((r) => this.matchesRule(r, v))
      ),
    );
  }

  public discardInvalidTickets() {
    this.nearbyTickets = this.nearbyTickets.filter((v) =>
      v.values.every((i) => this.rules.some((r) => this.matchesRule(r, i)))
    );
  }

  matchesRule(rule: Rule, value: number) {
    return isBetween(value, rule.range1.lower, rule.range1.upper) ||
      isBetween(value, rule.range2.lower, rule.range2.upper);
  }

  public determineColumns() {
    const columns = new Array(this.nearbyTickets[0].values.length).fill(0).map((
      _,
      i,
    ) => this.nearbyTickets.map((c) => c.values[i]));

    const result: Record<string, number> = {};
    const candidates = Object.entries(this.rules.reduce((agg, curr) => {
      agg[curr.name] = columns.reduce((a, c, i) => {
        if (c.every((h) => this.matchesRule(curr, h))) {
          a.push(i);
        }
        return a;
      }, [] as number[]);
      return agg;
    }, {} as Record<string, number[]>));

    for (let i = 0; i < candidates.length; i++) {
      const [uName, uNumber] = candidates.find((c) => c[1].length === 1)!;
      const idx = uNumber[0];
      result[uName] = idx;
      candidates.forEach((c) => {
        c[1] = c[1].filter((q) => q !== idx);
      });
    }

    return result;
  }
}
