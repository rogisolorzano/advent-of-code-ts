import { getAllLines } from '../utils';
import { Range } from '../core';

async function start() {
  const ranges = (await getAllLines(__dirname, 'input.txt')).map((line): Range[] => {
    const [rangeOne, rangeTwo] = line.split(',').map(p => p.split('-').map(b => Number(b)));
    return [new Range(rangeOne[0], rangeOne[1]), new Range(rangeTwo[0], rangeTwo[1])];
  });

  const containing = ranges.filter(
    ([rangeOne, rangeTwo]) => rangeOne.contains(rangeTwo) || rangeTwo.contains(rangeOne),
  );

  const overlapping = ranges.filter(([rangeOne, rangeTwo]) => rangeOne.overlapsWith(rangeTwo));

  console.log('Part 1', containing.length);
  console.log('Part 2', overlapping.length);
}

start();
