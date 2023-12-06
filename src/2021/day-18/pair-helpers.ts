/**
 * These are some helpers for performing snail number operations with string manipulation.
 * Such as getting/inserting/replacing pair at position, finding pair end, getting full
 * number at position, adding n to left or right neighbor, etc.
 */

const inRange = (i: number, length: number) => i >= 0 && i < length;

type Direction = 'left' | 'right';

export const getNumberAt = (num: string, pointer: number, direction: Direction) => {
  let otherPointer = pointer;

  do {
    direction === 'left' ? otherPointer-- : otherPointer++;
  } while (inRange(otherPointer, num.length) && !isNaN(Number(num[otherPointer])));

  const start = direction === 'left' ? otherPointer + 1 : pointer;
  const end = direction === 'left' ? pointer + 1 : otherPointer;

  return {
    n: Number(num.substring(start, end)),
    startsAt: start,
    endsAt: end,
  }
}

export const getNextPairEnd = (num: string, pointer: number) => {
  while (num[pointer] !== ']') pointer++;
  return pointer + 1;
};

export const getNextNumberEnd = (num: string, pointer: number) => {
  while (num[pointer] !== ']' && num[pointer] !== ',') pointer++;
  return pointer + 1;
};

export const isNumberPair = (num: string, pointer: number) =>
  /^\[\d+,\d+]$/.test(num.substring(pointer, getNextPairEnd(num, pointer)));

export const addToNumberInDirection = (num: string, pointer: number, n: number, direction: Direction): [string, number] => {
  do {
    (direction === 'right') ? pointer++ : pointer--;
  } while ((inRange(pointer, num.length)) && isNaN(Number(num[pointer])));

  let pointerOffset = 0;

  if (inRange(pointer, num.length)) {
    const numInfo = getNumberAt(num, pointer, direction);
    pointerOffset = (numInfo.startsAt + `${Number(numInfo.n) + n}`.length) - numInfo.endsAt;
    num = num.substring(0, numInfo.startsAt)
      + (Number(numInfo.n) + n)
      + num.substring(numInfo.endsAt);
  }

  return [num, pointerOffset];
}

export const getPairAt = (num: string, pointer: number) =>
  num.substring(pointer, getNextPairEnd(num, pointer))
    .replace(/[\[\]]/g, '')
    .split(',')
    .map(n => Number(n));

export const replacePairAt = (num: string, pointer: number, withStr: string) =>
  num.substring(0, pointer) + withStr + num.substring(getNextPairEnd(num, pointer));

export const replaceNumberAt = (num: string, pointer: number, withStr: string) =>
  num.substring(0, pointer) + withStr + num.substring(getNextNumberEnd(num, pointer) - 1);