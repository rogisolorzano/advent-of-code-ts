import { WindowIterator } from '../core';
import { getAllLines } from '../utils';

const findFirstUniqueWindow = (signal: string, windowSize: number): number | undefined => {
  const windowIterator = new WindowIterator([...signal], windowSize);

  while (windowIterator.hasNext()) {
    const window = windowIterator.next();
    if ([...new Set(window)].length === windowSize) {
      return windowIterator.currentWindowIndex + windowSize;
    }
  }
};

async function start() {
  const signal = (await getAllLines(__dirname, 'input.txt'))[0];

  console.log('Part 1', findFirstUniqueWindow(signal, 4));
  console.log('Part 2', findFirstUniqueWindow(signal, 14));
}

start();
