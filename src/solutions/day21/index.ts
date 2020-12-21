import { Solution } from "../../utilities/solver.ts";

export default class Day21 implements Solution {
  async solvePart1(input: string[]) {
    const allIngredients: string[] = [];

    const allergenMap = input.reduce((agg, curr) => {
      const [ingredients, allergens] = curr.substring(0, curr.length - 1).split(
        " (contains ",
      );

      const ing = ingredients.split(" ");
      allIngredients.push(...ing);

      allergens.split(", ").forEach((a) => {
        (agg[a] = agg[a] ?? []).push(ing);
      });

      return agg;
    }, {} as Record<string, string[][]>);

    const allergenCandidates = Object.entries(
      Object.entries(allergenMap).reduce((agg, [key, value]) => {
        agg[key] = value[0].filter((s) => value.every((v) => v.includes(s)));
        return agg;
      }, {} as Record<string, string[]>),
    );

    const allergens: Record<string, string> = {};
    for (let i = 0; i < allergenCandidates.length; i++) {
      const [a, ing] = allergenCandidates.find(([, v]) => v.length === 1)!;
      const allergen = ing[0];

      allergens[allergen] = a;
      allergenCandidates.forEach(([, aa]) => {
        const al = aa.indexOf(allergen);
        if (al !== -1) {
          aa.splice(al, 1);
        }
      });
    }

    const badIngredients = Object.keys(allergens);
    return allIngredients.filter((i) => !badIngredients.includes(i)).length;
  }

  async solvePart2(input: string[]) {
    const allergenMap = input.reduce((agg, curr) => {
      const [ingredients, allergens] = curr.substring(0, curr.length - 1).split(
        " (contains ",
      );

      const ing = ingredients.split(" ");
      allergens.split(", ").forEach((a) => {
        (agg[a] = agg[a] ?? []).push(ing);
      });

      return agg;
    }, {} as Record<string, string[][]>);

    const allergenCandidates = Object.entries(
      Object.entries(allergenMap).reduce((agg, [key, value]) => {
        agg[key] = value[0].filter((s) => value.every((v) => v.includes(s)));
        return agg;
      }, {} as Record<string, string[]>),
    );

    const allergens: Record<string, string> = {};
    for (let i = 0; i < allergenCandidates.length; i++) {
      const [a, ing] = allergenCandidates.find(([, v]) => v.length === 1)!;
      const allergen = ing[0];

      allergens[allergen] = a;
      allergenCandidates.forEach(([, aa]) => {
        const al = aa.indexOf(allergen);
        if (al !== -1) {
          aa.splice(al, 1);
        }
      });
    }

    return Object.entries(allergens).sort((a, b) => a[1].localeCompare(b[1]))
      .map((a) => a[0]).join(",");
  }
}
