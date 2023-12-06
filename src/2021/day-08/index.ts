import { getAllLines, sort } from '@utils';

interface SignalData {
  patterns: string[];
  outputs: string[];
}

type Length = number;
type Digit = number;

const validSegments: Record<Digit, string[]> = {
  1: ['c', 'f'],
  7: ['a', 'c', 'f'],
  4: ['b', 'c', 'd', 'f'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  2: ['a', 'c', 'd', 'e', 'g'],
  5: ['a', 'b', 'd', 'f', 'g'],
  3: ['a', 'c', 'd', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
  0: ['a', 'b', 'c', 'e', 'f', 'g'],
  6: ['a', 'b', 'd', 'e', 'f', 'g'],
};
const validSegmentsReverse: Record<string, Digit> = Object.entries(validSegments).reduce(
  (map, entry) => ({
    ...map,
    [entry[1].join('')]: entry[0],
  }),
  {},
);
const knownLengths: Record<Length, Digit> = { 2: 1, 3: 7, 4: 4, 7: 8 };

class SignalDataDecoder {
  map: Map<string, string[]>;
  sortedPatterns: string[];

  constructor(readonly data: SignalData) {
    this.map = new Map<string, string[]>();
    this.sortedPatterns = this.sort(data.patterns);
    this.decode();
  }

  /**
   * Keep track of viable chars, crossing out what we know from smallest to largest every iteration.
   * This guarantees that we will end up with this result on the right hand side for every row:
   *
   * Map(7) {
   *   'a' => [ 'c', 'f' ],
   *   'b' => [ 'c', 'f' ],
   *   'd' => [ 'a' ],
   *   'e' => [ 'b', 'd' ],
   *   'f' => [ 'b', 'd' ],
   *   'c' => [ 'e', 'g' ],
   *   'g' => [ 'e', 'g' ]
   * }
   *
   * After that we need extra logic to resolve the ambiguous chars, (c,f), (b,d) and (e,g).
   *
   * @param pattern
   */
  add(pattern: string) {
    for (const char of pattern) {
      const inferredMappings = sort([...this.map.entries()], v => v[1].length);
      let viableChars = this.map.get(char) || validSegments[knownLengths[pattern.length] || 6];

      for (const mapping of inferredMappings) {
        const canExclude =
          mapping[1].every(c => viableChars.includes(c)) &&
          mapping.length !== viableChars.length &&
          viableChars.length !== 1;

        viableChars = canExclude ? viableChars.filter(v => !mapping[1].includes(v)) : viableChars;
      }

      if (viableChars.length === 1) {
        this.filterCharFromMap(viableChars[0]);
      }

      this.map.set(char, viableChars);
    }
  }

  decode() {
    for (const pattern of this.sortedPatterns) {
      this.add(pattern);
    }
    this.resolveAmbiguousCharacters();
  }

  resolveAmbiguousCharacters() {
    [
      ['c', 'f'],
      ['b', 'd'],
      ['e', 'g'],
    ].forEach(([char1, char2]) => {
      const possibleDigits = [...this.map.entries()].filter(r => r[1].includes(char1)).map(r => r[0]);
      const result = this.countCharacterDiff(possibleDigits[0], possibleDigits[1]);
      this.map.set(possibleDigits[0], [result > 1 ? char2 : char1]);
      this.map.set(possibleDigits[1], [result > 1 ? char1 : char2]);
    });
  }

  countCharacterDiff(char1: string, char2: string) {
    return this.sortedPatterns.reduce((sum, p) => (p.includes(char1) && !p.includes(char2) ? sum + 1 : sum), 0);
  }

  sort(patterns: SignalData['patterns']) {
    const buckets: Record<number, string[]> = { 2: [], 3: [], 4: [], 7: [] };
    const remaining: string[] = [];
    patterns.forEach(p => buckets[p.length]?.push(p) || remaining.push(p));

    return [...Object.values(buckets).flatMap(ps => ps), ...remaining];
  }

  getUniqueOutputs() {
    const matches = [2, 3, 4, 7];
    return this.data.outputs.reduce((total, output) => total + (matches.includes(output.length) ? 1 : 0), 0);
  }

  getTotalOutput() {
    const outputNumber = this.data.outputs
      .flatMap(
        output =>
          validSegmentsReverse[
            output
              .split('')
              .map(o => this.map.get(o)![0])
              .sort((a, b) => a.localeCompare(b))
              .join('')
          ],
      )
      .join('');

    return parseInt(outputNumber);
  }

  private filterCharFromMap(char: string) {
    for (const [key, chars] of this.map.entries()) {
      const remaining = chars.filter(c => c !== char);
      this.map.set(key, remaining);
    }
  }
}

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const signalData = lines.flatMap(l => {
    const [patterns, outputs] = l.split(' | ').map(s => s.split(' '));
    return { patterns, outputs };
  });
  const [unique, total] = signalData.reduce(
    (sums, data) => {
      const decoder = new SignalDataDecoder(data);
      return [sums[0] + decoder.getUniqueOutputs(), sums[1] + decoder.getTotalOutput()];
    },
    [0, 0],
  );

  console.log('Pt 1. Unique outputs', unique);
  console.log('Pt 2. Output value total', total);
}

main();
