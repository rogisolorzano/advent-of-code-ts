import { getAllLines, isNumeric, lastItem, sum } from '@utils';

const numberMap: Map<string, string> = new Map([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
]);
const numberNames = [...numberMap.keys()];

type NumberParsingResult = {
  numericOnly: string[];
  allNumbers: string[];
};

const parseNumbers = (line: string): NumberParsingResult => {
  const numericOnly = [];
  const allNumbers = [];
  let start = 0;
  let end = 0;

  while (end < line.length) {
    const substring = line.substring(start, end + 1);
    if (numberMap.has(substring)) {
      allNumbers.push(numberMap.get(substring)!);
      start = end;
      continue;
    }
    if (numberNames.find(name => name.startsWith(substring))) {
      end++;
      continue;
    }
    if (isNumeric(substring)) {
      numericOnly.push(substring);
      allNumbers.push(substring);
    }
    start++;
    end = start;
  }

  return { numericOnly, allNumbers };
};

const getCalibrationValue = (numbers: string[]): number => Number(`${numbers[0]}${lastItem(numbers)}`);

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const numbersResults = lines.map(parseNumbers);
  const numericOnly = numbersResults.map(r => getCalibrationValue(r.numericOnly));
  const allNumbers = numbersResults.map(r => getCalibrationValue(r.allNumbers));

  console.log('Part 1', sum(numericOnly));
  console.log('Part 2', sum(allNumbers));
}

start();
