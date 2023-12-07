import { Grid, Point } from '@core';
import { getAllLines, isNumeric } from '@utils';

type EnginePart = {
  label: string;
  numberId?: string;
};

class EngineNumber {
  id: string;
  value: number;

  constructor(public readonly points: Point<EnginePart>[]) {
    this.id = points[0].value.numberId!;
    this.value = Number(points.map(n => n.value.label).join(''));
  }
}

class EngineGrid extends Grid<EnginePart> {
  private engineNumberMap = new Map<string, EngineNumber>();

  constructor(public readonly points: Point<EnginePart>[][]) {
    super(points);
    this.processNumbers();
  }

  calculatePartNumbersSum(): number {
    const numbers = [...this.engineNumberMap.values()];
    return numbers.reduce((sum, number) => (this.isNearSymbol(number) ? (sum += number.value) : sum), 0);
  }

  calculateGearRatiosSum(): number {
    let totalGearRatio = 0;

    this.forEachPoint(point => {
      if (point.value.label !== '*') {
        return;
      }
      const uniqueNearbyNumberIds = [
        ...new Set(
          this.getNeighbors(point, true)
            .map(p => p.value.numberId)
            .filter((id): id is string => !!id),
        ),
      ];
      if (uniqueNearbyNumberIds.length !== 2) {
        return;
      }
      const [numberOne, numberTwo] = uniqueNearbyNumberIds.map(id => this.engineNumberMap.get(id)!);
      totalGearRatio += numberOne.value * numberTwo.value;
    });

    return totalGearRatio;
  }

  private processNumbers(): void {
    for (const yPoints of this.points) {
      let currentNumber = [];

      for (const point of yPoints) {
        if (isNumeric(point.value.label)) {
          point.value.numberId = (currentNumber[0] ?? point)?.toString();
          currentNumber.push(point);
          continue;
        }
        if (currentNumber.length > 0) {
          const number = new EngineNumber(currentNumber);
          this.engineNumberMap.set(number.id, number);
          currentNumber = [];
        }
      }
    }
  }

  private isNearSymbol(number: EngineNumber): boolean {
    for (const numberPoint of number.points) {
      const isAdjacentToSymbol = this.getNeighbors(numberPoint, true).some(
        p => !isNumeric(p.value.label) && p.value.label !== '.',
      );
      if (isAdjacentToSymbol) {
        return true;
      }
    }
    return false;
  }
}

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const points = lines.map((line, y) => `${line}.`.split('').map((label, x) => new Point<EnginePart>(x, y, { label })));
  const grid = new EngineGrid(points);

  console.log('Part 1', grid.calculatePartNumbersSum());
  console.log('Part 2', grid.calculateGearRatiosSum());
}

start();
