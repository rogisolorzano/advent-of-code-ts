import { getAllLines, sum } from '@utils';

/**
 * Reads the list of fish and tallies up the number of fish at n days until they spawn more.
 * Array index represents the fish's current internal timer.
 *
 * @param fish
 */
const getInitialFishCounts = (fish: number[]) =>
  fish.reduce(
    (counts, nDaysUntilSpawn) => {
      counts[nDaysUntilSpawn]++;
      return counts;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  );

/**
 * Moves counts over one to the left [index - 1] of current fish's internal timer. Special case
 * when we hit 0, each fish in the [0] index creates a new fish, so add that to [8]. The timer
 * gets reset for those fish as well so add that amount to [6].
 *
 * @param counts
 */
const simulateDay = (counts: number[]) =>
  counts.reduce(
    (newCounts, nFish, nDaysUntilSpawn) => {
      if (nDaysUntilSpawn === 0) {
        newCounts[8] = nFish;
        newCounts[6] += nFish;
      } else {
        newCounts[nDaysUntilSpawn - 1] += nFish;
      }
      return newCounts;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  );

/**
 * Keep track of fish counts at each position.
 */
const simulateFishGrowth = (fish: number[], nDays: number) => {
  let fishCounts = getInitialFishCounts(fish);

  for (let days = 0; days < nDays; days++) {
    fishCounts = simulateDay(fishCounts);
  }

  return sum(fishCounts);
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const fish = lines[0].split(',').map(n => Number(n));

  console.log('Fishys after 80 days', simulateFishGrowth(fish, 80));
  console.log('Fishys after 256 days', simulateFishGrowth(fish, 256));
}

main();
