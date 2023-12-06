import { Grid, Point, Range } from '@core';
import { getAllLines, max, window } from '@utils';

enum Material {
  Air,
  Rock,
  Sand,
}

const getRockPath = (start: Point, end: Point): Point[] =>
  start.x === end.x
    ? Range.ascending(start.y, end.y).map(y => new Point(start.x, y, Material.Rock))
    : Range.ascending(start.x, end.x).map(x => new Point(x, start.y, Material.Rock));

const getNextSandPoint = (cave: Grid): Point | undefined => {
  let current = new Point(500, -1, Material.Sand);

  while (true) {
    const down = new Point(current.x, current.y + 1, Material.Sand);
    const left = new Point(current.x - 1, current.y + 1, Material.Sand);
    const right = new Point(current.x + 1, current.y + 1, Material.Sand);

    if ([down, left, right].some(p => !cave.hasPoint(p.x, p.y))) {
      return undefined;
    }

    const canFallTo = [down, left, right].find(p => cave.get(p.x, p.y).value === Material.Air);

    if (!canFallTo) {
      return current;
    }

    current = canFallTo;
  }
};

const pourSand = (cave: Grid, until?: (p: Point | undefined) => boolean): number => {
  let sandCount = 0;

  while (true) {
    const point = getNextSandPoint(cave);

    if (until && until(point)) return sandCount + 1;
    if (!point) break;

    cave.updatePoint(point);
    sandCount++;
  }

  return sandCount;
};

const createCave = (xBound: number, yBound: number, pathVertices: Point[][]): Grid =>
  pathVertices.reduce(
    (cave, vertices) => {
      window(vertices, 2)
        .flatMap(([start, end]) => getRockPath(start, end))
        .forEach(pathPoint => cave.updatePoint(pathPoint));
      return cave;
    },
    Grid.ofSize(xBound, yBound, () => Material.Air),
  );

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const pathVertices = lines.map(line =>
    line.split(' -> ').map(p => {
      const [x, y] = p.split(',').map(n => Number(n));
      return new Point(x, y, 0);
    }),
  );

  const xBound = max(pathVertices.flatMap(ps => ps.map(p => p.x)));
  const yBound = max(pathVertices.flatMap(ps => ps.map(p => p.y)));
  const cave = createCave(xBound, yBound, pathVertices);

  console.log('Part 1', pourSand(cave));

  const largerXBound = xBound * 2;
  const largerYBound = yBound + 2;
  const floorPath = [new Point(0, largerYBound, 0), new Point(largerXBound, largerYBound, 0)];
  const hugeCave = createCave(largerXBound, largerYBound, [...pathVertices, floorPath]);
  const untilSourceIsCovered = (p: Point | undefined) => !!p && p.x === 500 && p.y === 0;

  console.log('Part 2', pourSand(hugeCave, untilSourceIsCovered));
}

start();
