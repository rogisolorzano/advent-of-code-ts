import { getAllLines, window } from '../utils';

const findFirstUniqueWindow = (signal: string, windowSize: number): number | undefined => {
  const windows = window([...signal], windowSize);

  for (let i = 0; i < windows.length; i++) {
    if ([...new Set(windows[i])].length === windowSize) {
      return i + windowSize;
    }
  }
};

async function start() {
  const signal = (await getAllLines(__dirname, 'input.txt'))[0];

  console.log('Part 1', findFirstUniqueWindow(signal, 4));
  console.log('Part 2', findFirstUniqueWindow(signal, 14));
}

start();
