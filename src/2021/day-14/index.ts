import { getAllLines } from '@utils';

/**
 * --------
 * NN -> 1 (n1)
 * NC -> 1 (n2)
 * CB -> 1 (n3)
 * --
 * NN -> NCN, NC + n1, CN + n1
 * NC -> NBC, NB + n2, BC + n2
 * CB -> CHB, CH + n3, HB + n3
 * --------
 * NC -> 1 (n1)
 * CN -> 1 (n2)
 * NB -> 1 (n3)
 * BC -> 1 (n4)
 * CH -> 1 (n5)
 * HB -> 1 (n6)
 * --
 * NC -> NBC, NB + n1, BC + n1
 * CN -> CCN, CC + n2, CN + n2
 * NB -> NBB, NB + n3, BB + n3
 * BC -> BBC, BB + n4, BC + n4
 * CH -> CBH, CB + n5, BH + n5
 * HB -> HCB, HC + n6, CB + n6
 * --------
 * ... and so on
 */
const growPolymer = (steps: number, pairs: Map<string, number>, rules: Record<string, string>) => {
  let currentStep = 0;

  while (currentStep < steps) {
    const newPairs = new Map<string, number>();

    for (const [pair, count] of pairs.entries()) {
      const match = rules[pair];
      const chars = [...pair];
      const newPairOne = chars[0] + match;
      const newPairTwo = match + chars[1];
      newPairs.set(newPairOne, (newPairs.get(newPairOne) || 0) + count);
      newPairs.set(newPairTwo, (newPairs.get(newPairTwo) || 0) + count);
    }

    pairs = newPairs;
    currentStep++;
  }

  return pairs;
};

/**
 * Sum using the first character in each pair. Since we are summing the first character
 * in every pair, this means the last character in the template will never be counted.
 * We add that in manually initially.
 */
const getCounts = (pairs: Map<string, number>, template: string) => {
  const lastChar = template[template.length - 1];
  const counts: Record<string, number> = {
    [lastChar]: 1,
  };

  for (const [pair, count] of pairs) {
    const chars = [...pair];
    counts[chars[0]] = (counts[chars[0]] || 0) + count;
  }

  return Object.values(counts);
};

/**
 * Gets the initial counts of the pairs in the template.
 */
const getInitialPairCounts = (template: string) => {
  const pairCounts = new Map<string, number>();
  let pointer = 1;

  while (pointer < template.length) {
    const pair = `${template[pointer - 1]}${template[pointer]}`;
    pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
    pointer++;
  }

  return pairCounts;
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const template = lines[0];
  const rules = lines.splice(2).reduce((map, r) => {
    const [pair, char] = r.split(' -> ');
    map[pair] = char;
    return map;
  }, {} as Record<string, string>);

  const pairCounts = getInitialPairCounts(template);

  // Pt 1 - grow 10 steps
  const resultAt10 = growPolymer(10, pairCounts, rules);
  const countsAt10 = getCounts(resultAt10, template);
  const diffAt10 = Math.max(...countsAt10) - Math.min(...countsAt10);

  // Pt 2 - grow 30 more steps
  const resultAt40 = growPolymer(30, resultAt10, rules);
  const countsAt40 = getCounts(resultAt40, template);
  const diffAt40 = Math.max(...countsAt40) - Math.min(...countsAt40);

  console.log('Pt 1', diffAt10);
  console.log('Pt 2', diffAt40);
}

main();
