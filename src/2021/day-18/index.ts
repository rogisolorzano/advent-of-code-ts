import { getAllLines, isNumber } from '@utils';
import {
  addToNumberInDirection,
  getNextPairEnd,
  getNumberAt,
  getPairAt,
  isNumberPair,
  replaceNumberAt,
  replacePairAt,
} from './pair-helpers';

/**
 * Whether the pair at pointer position can be exploded.
 */
const canExplode = (depth: number, num: string, pointer: number) => depth >= 4 && isNumberPair(num, pointer);

/**
 * Whether the pair at pointer position can be split.
 */
const canSplit = (num: string, pointer: number) => {
  const numberInfo = getNumberAt(num, pointer, 'right');
  return Number(numberInfo.n) >= 10;
};

/**
 * Explodes the snail number, uses string manipulation.
 */
const explode = (num: string, pointer: number) => {
  const pair = getPairAt(num, pointer);
  const [newNum, leftOffset] = addToNumberInDirection(num, pointer, pair[0], 'left');
  pointer += leftOffset;
  const pairEnd = getNextPairEnd(num, pointer);
  const [newNumRight] = addToNumberInDirection(newNum, pairEnd, pair[1], 'right');
  num = newNumRight;

  return replacePairAt(num, pointer, '0');
};

/**
 * Splits the snail number, uses string manipulation.
 */
const split = (num: string, pointer: number) => {
  const number = getNumberAt(num, pointer, 'right');
  const newNumber = Number(number.n) / 2;
  const newPair = `[${Math.floor(newNumber)},${Math.ceil(newNumber)}]`;
  return replaceNumberAt(num, pointer, newPair);
};

/**
 * Searches for a candidate snail num to explode. Keeps track of current depth
 * by keeping track of '['s and ']'s.
 */
const explodeSearch = (num: string): [boolean, string] => {
  let depth = -1;
  let pointer = 0;
  while (pointer < num.length) {
    depth += num[pointer] === '[' ? 1 : num[pointer] === ']' ? -1 : 0;
    if (canExplode(depth, num, pointer)) {
      return [true, explode(num, pointer)];
    }
    pointer++;
  }
  return [false, num];
};

/**
 * Searches for a candidate snail num to split. If none is found, that means
 * the snail num is completely reduced.
 */
const splitSearch = (num: string): [boolean, string] => {
  let pointer = 0;
  while (pointer < num.length) {
    if (canSplit(num, pointer)) return [true, split(num, pointer)];
    pointer++;
  }
  return [false, num];
};

/**
 * Reduces pairs using string manipulation.
 */
const reduce = (num: string) => {
  while (true) {
    const [exploded, explodedNum] = explodeSearch(num);
    num = explodedNum;

    if (exploded) {
      continue;
    }

    const [split, splitNum] = splitSearch(num);
    num = splitNum;

    if (!split) {
      return num;
    }
  }
};

/**
 * Recursively get the magnitude for pairs.
 */
const getMagnitude = (pair: any): number => {
  const left = isNumber(pair[0]) ? pair[0] : getMagnitude(pair[0]);
  const right = isNumber(pair[1]) ? pair[1] : getMagnitude(pair[1]);
  return left * 3 + right * 2;
};

/**
 * Gets all the magnitudes for the permutations of snail numbers.
 */
const getAllMagnitudes = (snailNumbers: string[]): number[] => {
  const seen = new Set<string>();
  const magnitudes = [];

  for (let i = 0; i < snailNumbers.length; i++) {
    for (let j = 0; j < snailNumbers.length; j++) {
      if (i === j || seen.has(`${i}${j}`) || seen.has(`${j}${i}`)) continue;
      magnitudes.push(getMagnitude(JSON.parse(reduce(`[${snailNumbers[i]},${snailNumbers[j]}]`))));
      magnitudes.push(getMagnitude(JSON.parse(reduce(`[${snailNumbers[j]},${snailNumbers[i]}]`))));
    }
  }

  return magnitudes;
};

async function main() {
  const snailNumbers = await getAllLines(__dirname, 'input.txt');
  let sum = snailNumbers[0];

  for (const snailNum of snailNumbers.slice(1)) {
    sum = reduce(`[${sum},${snailNum}]`);
  }

  console.log('Pt 1.', getMagnitude(JSON.parse(sum)));
  console.log('Pt 2.', Math.max(...getAllMagnitudes(snailNumbers)));
}

main();
