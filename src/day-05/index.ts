import { Stack } from '../core';
import { getAllLines, getOrCreate, splitOn } from '../utils';

type StackId = string;
type StackMap = Map<StackId, Stack<string>>;
interface StackInstruction {
  amount: number;
  from: StackId;
  to: StackId;
}

const buildStackMap = (stackGrid: string[][][]): StackMap => {
  const stackMap: StackMap = new Map();

  for (const row of stackGrid) {
    for (let i = 0; i < row.length; i++) {
      const stack = getOrCreate(stackMap, `${i + 1}`, () => new Stack());
      const item = row[i][1];

      if (item !== ' ') {
        stack.add(item);
      }
    }
  }

  return stackMap;
};

const buildStackInstruction = (instructionLine: string): StackInstruction => {
  const matches = instructionLine.matchAll(/move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)/g);
  const groups = matches.next().value.groups;
  return {
    amount: Number(groups.amount),
    from: groups.from,
    to: groups.to,
  };
};

const moveItemsOneByOne = <T>(from: Stack<T>, to: Stack<T>, amount: number) => {
  let moved = 0;
  while (moved < amount) {
    const item = from.pop();
    if (item === undefined) break;
    to.add(item);
    moved++;
  }
};

const moveItemsInGroup = <T>(from: Stack<T>, to: Stack<T>, amount: number) => {
  const toMove = [];
  while (toMove.length < amount) {
    const item = from.pop();
    if (item === undefined) break;
    toMove.push(item);
  }
  toMove.reverse().forEach(item => to.add(item));
};

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const [stackLines, instructionLines] = splitOn(lines, line => line === '');

  const stackGrid = stackLines
    .map(row => splitOn([...row], (_, i) => (i + 1) % 4 === 0))
    .slice(0, -1)
    .reverse();
  const stacks = buildStackMap(stackGrid);
  const stacksTwo = buildStackMap(stackGrid);
  const instructions = instructionLines.map(buildStackInstruction);

  instructions.forEach(({ from, to, amount }) => {
    moveItemsOneByOne(stacks.get(from)!, stacks.get(to)!, amount);
    moveItemsInGroup(stacksTwo.get(from)!, stacksTwo.get(to)!, amount);
  });

  console.log('Part 1', [...stacks.values()].map(s => s.peek()).join(''));
  console.log('Part 2', [...stacksTwo.values()].map(s => s.peek()).join(''));
}

start();
