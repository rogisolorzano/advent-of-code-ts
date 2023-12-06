import { sum, getAllLines } from '@utils';

/**
 * Iterate at window end of n size, calculating the next window sum and comparing with the current.
 *
 * NextWindowSum = CurrentWindowSum - ValueOfCurrentWindowStart + ValueOfNextWindowEnd
 */
const getTotalIncrements = (depths: number[], windowSize: number) => {
  let increments = 0;
  let currentSum = sum(depths.slice(0, windowSize));

  for (let windowEnd = windowSize - 1; windowEnd < depths.length - 1; windowEnd++) {
    const nextSum = currentSum - depths[windowEnd - (windowSize - 1)] + depths[windowEnd + 1];

    if (nextSum > currentSum) {
      increments++;
    }
    currentSum = nextSum;
  }

  return increments;
};

async function main() {
  const depths = (await getAllLines(__dirname, 'input.txt')).map(n => Number(n));

  console.log('Window size 1', getTotalIncrements(depths, 1));
  console.log('Window size 3', getTotalIncrements(depths, 3));
}

main();
