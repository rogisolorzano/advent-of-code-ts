import { Point, Translation } from '../core';
import { from, getAllLines, window } from '../utils';

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

const directionMap: Record<string, Direction> = {
  U: Direction.Up,
  D: Direction.Down,
  L: Direction.Left,
  R: Direction.Right,
};

const directionTranslation: Record<Direction, Translation> = {
  [Direction.Up]: [0, 1],
  [Direction.Down]: [0, -1],
  [Direction.Left]: [-1, 0],
  [Direction.Right]: [1, 0],
};

const simulateRope = (knotCount: number, directions: Direction[]): number => {
  const tailVisited = new Set<string>();
  const rope = from<Point>(knotCount, (_, i) => new Point(0, 0, i));
  const knotJoints = window(rope, 2);

  for (const direction of directions) {
    rope[0].translate(directionTranslation[direction]);

    for (const [leadingKnot, trailingKnot] of knotJoints) {
      const touching = trailingKnot.isOn(leadingKnot) || trailingKnot.isNeighboring(leadingKnot);

      if (!touching) {
        const [xDiff, yDiff] = leadingKnot.differenceWith(trailingKnot);
        const xTranslation = xDiff > 0 ? 1 : -1;
        const yTranslation = yDiff > 0 ? 1 : -1;

        trailingKnot.translate([xDiff === 0 ? 0 : xTranslation, yDiff === 0 ? 0 : yTranslation]);
      }

      if (trailingKnot.value === knotCount - 1) {
        tailVisited.add(trailingKnot.toString());
      }
    }
  }

  return tailVisited.size;
};

async function start() {
  const directions = (await getAllLines(__dirname, 'input.txt')).reduce((directions, line) => {
    const [direction, steps] = line.split(' ');
    return [...directions, ...from(Number(steps), () => directionMap[direction])];
  }, [] as Direction[]);

  console.log('Part 1', simulateRope(2, directions));
  console.log('Part 2', simulateRope(10, directions));
}

start();
