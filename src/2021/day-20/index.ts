import { getAllLines, isDefined } from '@utils';

type Pixel = '#' | '.';

// # will be a full 9x9 grid of 1's, so 111111111 in binary -> 511
// . will be a full 9x9 grid of 0's, so 000000000 in binary -> 0
const pixelToDecimal: Record<Pixel, number> = {
  '#': 511,
  '.': 0,
};

class PixelRegion {
  constructor(readonly pixels: string[]) {}

  toBinary() {
    return this.pixels.map(p => (p === '#' ? '1' : '0')).join('');
  }

  toDecimal() {
    return parseInt(this.toBinary(), 2);
  }

  static from(image: InfinityImage, x: number, y: number) {
    const pixels = [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ].map(([x, y]) => (isDefined(image.raw[y]?.[x]) ? image.raw[y][x] : image.outOfBoundsPixel));

    return new PixelRegion(pixels);
  }
}

class InfinityImage {
  constructor(public raw: Pixel[][], public outOfBoundsPixel: Pixel = '.') {}

  getPixelRegion(x: number, y: number): PixelRegion {
    return PixelRegion.from(this, x, y);
  }

  setPixel(x: number, y: number, value: Pixel) {
    this.raw[y][x] = value;
  }

  copy() {
    return new InfinityImage([...this.raw.map(p => [...p])], this.outOfBoundsPixel);
  }

  size(): [number, number] {
    return [this.raw[0].length, this.raw.length];
  }

  expand() {
    const emptyRow = this.outOfBoundsPixel.repeat(this.raw[0].length).split('') as Pixel[];
    this.raw.splice(0, 0, [...emptyRow]);
    this.raw.push([...emptyRow]);

    for (const row of this.raw) {
      row.splice(0, 0, this.outOfBoundsPixel);
      row.push(this.outOfBoundsPixel);
    }

    return this;
  }

  getLitPixelCount() {
    return this.raw.reduce((c, y) => c + y.reduce((c2, p) => c2 + (p === '#' ? 1 : 0), 0), 0);
  }
}

class ImageEnhancer {
  constructor(readonly algorithm: Pixel[]) {}

  enhance(image: InfinityImage) {
    const output = image.expand().copy();
    const size = output.size();

    for (let x = 0; x < size[0]; x++) {
      for (let y = 0; y < size[1]; y++) {
        const index = image.getPixelRegion(x, y).toDecimal();
        output.setPixel(x, y, this.algorithm[index]);
      }
    }

    // Also process "out of bound pixel" that represents the infinity area around the image.
    output.outOfBoundsPixel = this.algorithm[pixelToDecimal[output.outOfBoundsPixel]];

    return output;
  }
}

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const algorithm = [...lines[0]] as Pixel[];
  const rawImage = lines.slice(2).map(x => [...x]) as Pixel[][];
  const enhancer = new ImageEnhancer(algorithm);
  let image = new InfinityImage(rawImage);

  for (let n = 0; n < 2; n++) {
    image = enhancer.enhance(image);
  }

  console.log('Pt 1:', image.getLitPixelCount());

  for (let n = 0; n < 48; n++) {
    image = enhancer.enhance(image);
  }

  console.log('Pt 2:', image.getLitPixelCount());
}

main();
