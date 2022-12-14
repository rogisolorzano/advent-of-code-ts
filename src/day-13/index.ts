import { getAllLines, isArray, isNumber, splitOn, zip } from '../utils';

type PacketItem = number[] | number;
type Packet = PacketItem[];
enum ComparisonResult {
  Correct = -1,
  Incorrect = 1,
  Equal = 0,
}

const comparePackets = (leftPacket: Packet, rightPacket: Packet): ComparisonResult => {
  for (const [left, right] of zip(leftPacket, rightPacket)) {
    if (left === undefined) return ComparisonResult.Correct;
    if (right === undefined) return ComparisonResult.Incorrect;

    if (isNumber(left) && isNumber(right)) {
      if (left === right) continue;
      return left < right ? ComparisonResult.Correct : ComparisonResult.Incorrect;
    }

    const result = comparePackets(isArray(left) ? left : [left], isArray(right) ? right : [right]);

    if (result !== ComparisonResult.Equal) {
      return result;
    }
  }

  return ComparisonResult.Equal;
};

const separatorPackets: Packet[] = [[[2]], [[6]]];
const separatorStrings: string[] = separatorPackets.map(p => JSON.stringify(p));

async function start() {
  const lines = (await getAllLines(__dirname, 'input.txt')).map(l => (l === '' ? '' : JSON.parse(l)));
  const pairs = splitOn(lines, l => l === '') as [Packet, Packet][];
  const allPackets = [...pairs.flatMap(p => p), ...separatorPackets];

  const orderedPairsSum = pairs
    .map(([left, right]) => comparePackets(left, right))
    .reduce((sum, result, i) => sum + (result === ComparisonResult.Correct ? i + 1 : 0), 0);

  const decoderKey = allPackets
    .sort(comparePackets)
    .reduce((product, packet, i) => product * (separatorStrings.includes(JSON.stringify(packet)) ? i + 1 : 1), 1);

  console.log('Part 1', orderedPairsSum);
  console.log('Part 2', decoderKey);
}

start();
