import { chunk, findCommonCharacter, getAllLines, isDefined, sum } from '../utils';

type Rucksack = string;
type Compartment = string;

const getPriority = (char: string) => {
  const code = char.charCodeAt(0);
  return code >= 97 ? code - 96 : code - 38;
};

const getCompartments = (rucksack: Rucksack): [Compartment, Compartment] => [
  rucksack.slice(0, rucksack.length / 2),
  rucksack.slice(rucksack.length / 2),
];

const getPriorities = (strings: string[][]) => strings.map(findCommonCharacter).filter(isDefined).map(getPriority);

async function start() {
  const rucksacks = await getAllLines(__dirname, 'input.txt');

  const compartmentPriorities = getPriorities(rucksacks.map(getCompartments));
  const rucksackPriorities = getPriorities(chunk(rucksacks, 3));

  console.log('Part 1', sum(compartmentPriorities));
  console.log('Part 2', sum(rucksackPriorities));
}

start();
