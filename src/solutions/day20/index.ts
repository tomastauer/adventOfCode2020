import { sum } from "../../utilities/array.ts";
import { Solution } from "../../utilities/solver.ts";

export default class Day20 implements Solution {
  async solvePart1(input: string[]) {
    const images = input.join("\n").split("\n\n").map((i) => i.split("\n")).map(
      (i) => new Image(i),
    );
    new ImageArray(images);
    return images.filter((i) => i.potentialNeighbors.length === 2).reduce(
      (agg, curr) => agg * curr.id,
      1,
    );
  }

  async solvePart2(input: string[]) {
    const images = input.join("\n").split("\n\n").map((i) => i.split("\n")).map(
      (i) => new Image(i),
    );

    const array = new ImageArray(images);
    array.arrange();
    array.transform();

    for (let i = 0; i < 8; i++) {
      const image = Image.transform(i, array.getBigImage());
      const monsters = array.findMonsters(image);

      if (monsters > 0) {
        return sum(
          image.map((m) => m.split("").filter((c) => c === "#").length),
        ) - monsters * 15;
      }
    }

    return 0;
  }
}

const monster = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   ",
];

const idPattern = /Tile (\d+):/;

type RawBorder = {
  n: string;
  w: string;
  s: string;
  e: string;
};

type Side = "n" | "w" | "s" | "e";

type Border = {
  n: number;
  w: number;
  s: number;
  e: number;
};

type Neighbor = {
  side: Side;
  id: number;
};

class ImageArray {
  public images: Record<number, Image>;
  public allImages: Image[];
  public array: number[][] = [];

  constructor(images: Image[]) {
    this.allImages = images;

    this.images = images.reduce((agg, curr) => {
      agg[curr.id] = curr;
      return agg;
    }, {} as Record<number, Image>);

    images.forEach((i) => {
      i.setPotentialNeighbors(
        images.filter((m) =>
          m.id !== i.id &&
          m.borders.some((b) => i.borders.map((p) => p.n).includes(b.s))
        ).map((i) => i.id),
      );
    });
  }

  findMonsters(bigImage: string[]) {
    let monsters = 0;

    for (let row = 0; row < bigImage.length - monster.length; row++) {
      for (let col = 0; col < bigImage[row].length - monster[0].length; col++) {
        let isMonster = true;

        for (let y = 0; y < monster.length; y++) {
          for (let x = 0; x < monster[y].length; x++) {
            if (monster[y][x] === "#" && bigImage[row + y][col + x] !== "#") {
              isMonster = false;
            }
          }
        }

        if (isMonster) {
          monsters++;
        }
      }
    }

    return monsters;
  }

  getBigImage() {
    const bigImage: string[] = [];
    for (let row = 0; row < this.array.length; row++) {
      for (let col = 0; col < this.array[row].length; col++) {
        if (col === 0) {
          bigImage.push(...this.images[this.array[row][col]].image);
        } else {
          for (let i = 0; i < 8; i++) {
            bigImage[row * 8 + i] += this.images[this.array[row][col]].image[i];
          }
        }
      }
    }

    return bigImage;
  }

  transform() {
    for (let row = 0; row < this.array.length; row++) {
      for (let col = 0; col < this.array[row].length; col++) {
        const image = this.images[this.array[row][col]];
        const neighbors = this.getNeighbors(row, col);
        const validBorder = image.borders.findIndex((b) =>
          neighbors.every((n) =>
            this.images[n.id].borders.map((b2) => b2[this.getOtherSide(n.side)])
              .includes(b[n.side])
          )
        )!;

        image.image = Image.transform(validBorder, image.image);
      }
    }
  }

  getOtherSide(side: Side) {
    switch (side) {
      case "n":
        return "s";
      case "s":
        return "n";
      case "w":
        return "e";
      case "e":
        return "w";
    }
  }

  getNeighbors(row: number, col: number) {
    const neighbors: Neighbor[] = [];

    if (row > 0) {
      neighbors.push({ side: "n", id: this.array[row - 1][col] });
    }
    if (row < this.array.length - 1) {
      neighbors.push({ side: "s", id: this.array[row + 1][col] });
    }

    if (col > 0) {
      neighbors.push({ side: "w", id: this.array[row][col - 1] });
    }
    if (col < this.array[0].length - 1) {
      neighbors.push({ side: "e", id: this.array[row][col + 1] });
    }

    return neighbors;
  }

  arrange() {
    const edge = this.findEdge();
    this.array.push(edge);

    let lastRow = 0;
    while (this.array.length !== this.allImages.length / edge.length) {
      const currentRow = this.array[lastRow];
      const prevRow = lastRow === 0 ? null : this.array[lastRow - 1];

      const nextRow = [
        this.images[currentRow[0]].potentialNeighbors.find((p) =>
          !prevRow
            ? p !== currentRow[1]
            : p !== currentRow[1] && p !== prevRow[0]
        )!,
      ];

      for (let x = 1; x < edge.length - 1; x++) {
        nextRow.push(
          this.images[currentRow[x]].potentialNeighbors.find((p) =>
            !prevRow
              ? p !== currentRow[x - 1] && p !== currentRow[x + 1]
              : p !== currentRow[x - 1] && p !== currentRow[x + 1] &&
                p !== prevRow[x]
          )!,
        );
      }

      nextRow.push(
        this.images[currentRow[currentRow.length - 1]].potentialNeighbors.find((
          p,
        ) =>
          !prevRow
            ? p !== currentRow[currentRow.length - 2]
            : p !== currentRow[currentRow.length - 2] &&
              p !== prevRow[currentRow.length - 1]
        )!,
      );

      this.array.push(nextRow);
      lastRow++;
    }
  }

  findEdge() {
    const row: number[] = [];

    const fixed = this.allImages.find((i) =>
      i.potentialNeighbors.length === 2
    )!;
    let previous = fixed;
    let current = fixed;
    let next = this.images[fixed.potentialNeighbors[0]];

    row.push(fixed.id, next.id);

    while (next.potentialNeighbors.length !== 2) {
      previous = current;
      current = next;
      next = this.images[
        current.potentialNeighbors.find((i) =>
          i !== previous.id && this.images[i].potentialNeighbors.length <= 3
        )!
      ];

      row.push(next.id);
    }

    return row;
  }
}

type PotentialNeighbor = {
  variant: number;
  neighbors: number[];
};

class Image {
  public id: number;
  public borders: Border[];
  public potentialNeighbors!: number[];
  public image: string[];
  public variant!: number;

  constructor(input: string[]) {
    const [id, ...image] = input;
    this.id = Number(id.match(idPattern)![1]);

    this.borders = this.convertBorders(
      this.combineBorders(this.extractBorders(image)),
    );
    this.image = this.stripBorders(image);
  }

  setVariant(variant: number) {
    this.variant = variant;
  }

  setPotentialNeighbors(p: number[]) {
    this.potentialNeighbors = p;
  }

  stripBorders(input: string[]) {
    return input.filter((_, i) => i !== 0 && i !== input.length - 1).map((c) =>
      c.substring(1, c.length - 1)
    );
  }

  convertBorders(borders: RawBorder[]) {
    return borders.map((b) =>
      Object.entries(b).reduce((agg, [key, value]) => {
        agg[key as Side] = parseInt(
          value.replaceAll(".", "0").replaceAll("#", "1"),
          2,
        );
        return agg;
      }, {} as Border)
    );
  }

  extractBorders(input: string[]) {
    const n = input[0];
    const s = input[input.length - 1];
    const w = input.map((i) => i[0]).join("");
    const e = input.map((i) => i[i.length - 1]).join("");

    return { n, s, w, e };
  }

  combineBorders(input: RawBorder) {
    return [
      ...this.getRotations(input),
      ...this.getRotations(this.flipBorderHorizontal(input)),
    ];
  }

  getRotations(input: RawBorder) {
    return new Array(4).fill(0).reduce((agg, _, i) => {
      i === 0 ? agg.push(input) : agg.push(this.rotateBorder(agg[i - 1]));
      return agg;
    }, [] as RawBorder[]);
  }

  rotateBorder(input: RawBorder) {
    return {
      n: this.reverse(input.w),
      e: input.n,
      s: this.reverse(input.e),
      w: input.s,
    };
  }

  flipBorderHorizontal(input: RawBorder) {
    return {
      n: input.s,
      e: this.reverse(input.e),
      s: input.n,
      w: this.reverse(input.w),
    };
  }

  reverse(input: string) {
    return input.split("").reverse().join("");
  }

  static transform(transformationIndex: number, input: string[]) {
    return [
      [],
      [this.rotate],
      [this.rotate, this.rotate],
      [this.rotate, this.rotate, this.rotate],
      [this.flipHorizontal],
      [this.flipHorizontal, this.rotate],
      [this.flipHorizontal, this.rotate, this.rotate],
      [this.flipHorizontal, this.rotate, this.rotate, this.rotate],
    ][transformationIndex].reduce((agg, curr) => curr(agg), input);
  }

  static rotate(input: string[]) {
    return input.map((_, i) =>
      input.map((__, j) => input[input.length - 1 - j][i]).join("")
    );
  }

  static flipHorizontal(input: string[]) {
    return input.reverse();
  }
}
