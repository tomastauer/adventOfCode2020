import { Solution } from "../../utilities/solver.ts";
import { isBetween } from "../../utilities/number.ts";

export default class Day04 implements Solution {
  async solvePart1(input: string[]) {
    const passports = new Passports(input);
    return passports.withRequiredFields().length;
  }

  async solvePart2(input: string[]) {
    const passports = new Passports(input);
    return passports.valid().length;
  }
}

class Passports {
  passports: Record<string, string>[];

  private validationRules: Record<string, (val: string) => boolean> = {
    byr: (val: string) => isBetween(val, 1920, 2020),
    iyr: (val: string) => isBetween(val, 2010, 2020),
    eyr: (val: string) => isBetween(val, 2020, 2030),
    hgt: (val: string) => {
      const match = val.match(/(\d+)cm|(\d+)in/)!;
      return (
        match && (isBetween(match[1], 150, 193) || isBetween(match[2], 59, 76))
      );
    },
    hcl: (val: string) => /#[0-9a-f]{6}/.test(val),
    ecl: (val: string) =>
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(val),
    pid: (val: string) => val.length === 9 && !isNaN(Number(val)),
  };

  private requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

  constructor(lines: string[]) {
    this.passports = lines
      .join("\n")
      .split("\n\n")
      .map((l) =>
        l
          .replace(/\n/g, " ")
          .split(" ")
          .map((p) => p.match(/(\w{3}):(.*)/)!)
          .reduce((agg, curr) => {
            agg[curr[1]] = curr[2];
            return agg;
          }, {} as Record<string, string>)
      );
  }

  public withRequiredFields() {
    return this.passports.filter((p) => this.requiredFields.every((f) => p[f]));
  }

  public valid() {
    return this.withRequiredFields().filter((p) =>
      this.requiredFields.every((f) => this.validationRules[f](p[f]))
    );
  }
}
