import { getAllLines } from '@utils';
import { Point } from '@core';

interface FoldInstruction {
  axis: string;
  units: number;
}

const isRelevantPoint = (instruction: FoldInstruction) => (p: Point) =>
  (instruction.axis === 'y' && p.y > instruction.units) || (instruction.axis === 'x' && p.x > instruction.units);

const foldWith =
  ({ axis, units }: FoldInstruction) =>
  (p: Point) =>
    p.copyWith({
      ...(axis === 'y' ? { y: units - (p.y - units) } : {}),
      ...(axis === 'x' ? { x: units - (p.x - units) } : {}),
    });

const mergePoints = (pointsOne: Point[], pointsTwo: Point[]) => {
  for (const pointTwo of pointsTwo) {
    if (!pointsOne.find(p => p.x === pointTwo.x && p.y === pointTwo.y)) {
      pointsOne.push(pointTwo);
    }
  }
  return pointsOne;
};

const executeFold = (instruction: FoldInstruction, points: Point[]) => {
  const isRelevant = isRelevantPoint(instruction);
  const foldedPoints = points.filter(isRelevant).map(foldWith(instruction));
  const remainingPoints = points.filter(p => !isRelevant(p));

  return mergePoints(remainingPoints, foldedPoints);
};

const printPoints = (points: Point[]) => {
  const ySize = Math.max(...points.map(p => p.y)) + 1;
  const xSize = Math.max(...points.map(p => p.x)) + 1;
  const grid = Array.from({ length: ySize }, () => ' '.repeat(xSize).split(''));
  points.forEach(p => (grid[p.y][p.x] = '\x1b[31m#\x1b[0m'));
  console.log(grid.reduce((all, line) => (all += line.join(' ') + '\n'), ''));
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  let points = lines
    .filter(l => l.includes(','))
    .map(l => {
      const [x, y] = l.split(',').map(n => Number(n));
      return new Point(x, y, 0);
    });
  const folds = lines
    .filter(l => l.startsWith('fold'))
    .map<FoldInstruction>(l => {
      const [axis, units] = l.replace('fold along ', '').split('=');
      return {
        axis,
        units: Number(units),
      };
    });

  const firstFold = executeFold(folds[0], [...points]);

  points = folds.reduce((all, fold) => executeFold(fold, all), points);

  console.log('Pt 1.', firstFold.length);
  console.log('Pt 2:');
  printPoints(points);
}

main();
