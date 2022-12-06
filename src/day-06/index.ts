import { getAllLines, window, countCharacterOccurrences } from '../utils';

const findFirstUniqueWindow = (signal: string, windowSize: number): number | undefined => {
  const windows = window([...signal], windowSize);

  for (let i = 0; i < windows.length; i++) {
    const occurrences = countCharacterOccurrences(windows[i].join(''));

    if (Object.values(occurrences).every(count => count === 1)) {
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
