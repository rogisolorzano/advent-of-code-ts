import { splitOn, getAllLines, sum, max, last, sort, parseNumbers } from '@utils';

async function start() {
  const calories = await getAllLines(__dirname, 'input.txt');

  const totals = splitOn(calories, c => c === '').map(c => sum(parseNumbers(c)));

  const largestSums = sum(last(sort(totals), 3));

  console.log('Part 1', max(totals));
  console.log('Part 2', largestSums);
}

start();
