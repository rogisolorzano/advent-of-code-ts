import {
  Bit,
  bitsToNumber,
  bitStringToNumber,
  filterByBitAtPosition,
  getAllLines,
  getCommonBitsForPosition,
} from '@utils';

export class DiagnosticsReport {
  constructor(
    readonly gammaRate: number,
    readonly epsilonRate: number,
    readonly oxygenGeneratorRating: number,
    readonly co2ScrubberRating: number,
  ) {}

  getPowerConsumptionLevel() {
    return this.gammaRate * this.epsilonRate;
  }

  getLifeSupportRating() {
    return this.oxygenGeneratorRating * this.co2ScrubberRating;
  }
}

const loadDiagnosticReport = (bits: string[]) => {
  let oxyMatches = bits;
  let co2Matches = bits;
  const gammaBits: Bit[] = Array.from({ length: bits[0].length });
  const epsilonBits: Bit[] = Array.from({ length: bits[0].length });

  for (let x = 0; x < bits[0].length; x++) {
    const allCommon = getCommonBitsForPosition(bits, x);
    const oxyCommon = getCommonBitsForPosition(oxyMatches, x);
    const co2Common = getCommonBitsForPosition(co2Matches, x);

    gammaBits[x] = allCommon.most;
    epsilonBits[x] = allCommon.least;
    oxyMatches = oxyMatches.length > 1 ? filterByBitAtPosition(oxyMatches, x, `${oxyCommon.most}`) : oxyMatches;
    co2Matches = co2Matches.length > 1 ? filterByBitAtPosition(co2Matches, x, `${co2Common.least}`) : co2Matches;
  }

  return new DiagnosticsReport(
    bitsToNumber(gammaBits),
    bitsToNumber(epsilonBits),
    bitStringToNumber(oxyMatches[0]),
    bitStringToNumber(co2Matches[0]),
  );
};

async function main() {
  const reportBits = await getAllLines(__dirname, 'input.txt');
  const report = loadDiagnosticReport(reportBits);

  console.log('Power consumption:', report.getPowerConsumptionLevel());
  console.log('Life support rating:', report.getLifeSupportRating());
}

main();
