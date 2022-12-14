import { getAllLines, isNumber, splitOn, zip } from '../utils';

type PacketItem = number[] | number;
type Packet = PacketItem[];
enum ComparisonResult {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
  Undetermined = 'Undetermined',
}

const comparePairs = (left: Packet, right: Packet): ComparisonResult => {
  for (const [leftItem, rightItem] of zip(left, right)) {
    if (leftItem === undefined && rightItem === undefined) return ComparisonResult.Undetermined;
    if (leftItem === undefined) return ComparisonResult.Correct;
    if (rightItem === undefined) return ComparisonResult.Incorrect;

    if (isNumber(leftItem) && isNumber(rightItem)) {
      if (leftItem === rightItem) continue;
      return leftItem < rightItem ? ComparisonResult.Correct : ComparisonResult.Incorrect;
    }

    const result = comparePairs(
      Array.isArray(leftItem) ? leftItem : [leftItem],
      Array.isArray(rightItem) ? rightItem : [rightItem],
    );

    if (result !== ComparisonResult.Undetermined) {
      return result;
    }
  }

  return ComparisonResult.Undetermined;
};

const packetSorter = (left: Packet, right: Packet): number => {
  const result = comparePairs(left, right);
  if (result === ComparisonResult.Undetermined) return 0;
  return result === ComparisonResult.Correct ? -1 : 1;
};

const separatorPackets: Packet[] = [[[2]], [[6]]];
const separatorStrings: string[] = separatorPackets.map(p => JSON.stringify(p));

async function start() {
  const lines = (await getAllLines(__dirname, 'input.txt')).map(l => (l === '' ? '' : JSON.parse(l)));
  const pairs = splitOn(lines, l => l === '') as [Packet, Packet][];
  const allPackets = [...pairs.flatMap(p => p), ...separatorPackets];

  const orderedPairsSum = pairs
    .map(([left, right]) => comparePairs(left, right))
    .reduce((sum, result, i) => sum + (result === ComparisonResult.Correct ? i + 1 : 0), 0);

  const decoderKey = allPackets
    .sort(packetSorter)
    .reduce((product, packet, i) => product * (separatorStrings.includes(JSON.stringify(packet)) ? i + 1 : 1), 1);

  console.log('Part 1', orderedPairsSum);
  console.log('Part 2', decoderKey);
}

start();
