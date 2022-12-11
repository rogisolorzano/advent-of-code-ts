import { getAllLines, sort, splitOn, product, times } from '../utils';

type MonkeyId = number;

interface InspectionResult {
  item: Item;
  throwTo: MonkeyId;
}

type WorryReducer = (value: number) => number;

class Monkey {
  inspectedCount = 0;

  constructor(public id: MonkeyId, public items: Item[], public operation: Operation, public decision: Decision) {}

  inspectItems(worryReducer: WorryReducer): InspectionResult[] {
    const results: InspectionResult[] = [];

    for (const item of this.items) {
      item.worryLevel = worryReducer(this.operation.execute(item.worryLevel));

      results.push({
        item,
        throwTo: this.decision.execute(item.worryLevel),
      });
    }

    this.inspectedCount += this.items.length;
    this.items = [];

    return results;
  }

  catch(item: Item) {
    this.items.push(item);
  }
}

class Item {
  constructor(public worryLevel: number) {}
}

class Operation {
  constructor(public lhs: string, public operator: string, public rhs: string) {}

  execute(old: number): number {
    const lhs = this.lhs === 'old' ? old : Number(this.lhs);
    const rhs = this.rhs === 'old' ? old : Number(this.rhs);

    switch (this.operator) {
      case '*':
        return lhs * rhs;
      case '+':
        return lhs + rhs;
      case '-':
        return lhs - rhs;
      default:
        throw new Error('Unsupported operator provided.');
    }
  }
}

class Decision {
  constructor(public divisibleBy: number, public onTrueMonkey: MonkeyId, public onFalseMonkey: MonkeyId) {}

  execute(value: number): MonkeyId {
    return value % this.divisibleBy === 0 ? this.onTrueMonkey : this.onFalseMonkey;
  }
}

class MonkeySimulation {
  currentRound = 0;

  constructor(public monkeys: Monkey[], public worryReducer: WorryReducer) {}

  simulateRound() {
    for (const monkey of this.monkeys.values()) {
      monkey.inspectItems(this.worryReducer).forEach(r => this.throwItemTo(r.throwTo, r.item));
    }
    this.currentRound++;
  }

  throwItemTo(monkeyId: MonkeyId, item: Item) {
    this.getMonkey(monkeyId)?.catch(item);
  }

  getMonkey(id: MonkeyId): Monkey | undefined {
    return this.monkeys.find(m => m.id === id);
  }

  calculateMonkeyBusiness() {
    return product(sort(this.monkeys.map(m => m.inspectedCount)).slice(-2));
  }
}

const createMonkey = (id: number, monkeyInfo: string[]): Monkey => {
  const items = monkeyInfo[1]
    .replace('Starting items: ', '')
    .split(', ')
    .map(w => new Item(Number(w)));
  const [lhs, operator, rhs] = monkeyInfo[2].replace('Operation: new = ', '').split(' ');
  const operation = new Operation(lhs, operator, rhs);
  const divisibleBy = Number(monkeyInfo[3].replace('Test: divisible by ', ''));
  const onTrueMonkey = Number(monkeyInfo[4].replace('If true: throw to monkey ', ''));
  const onFalseMonkey = Number(monkeyInfo[5].replace('If false: throw to monkey ', ''));
  const decision = new Decision(divisibleBy, onTrueMonkey, onFalseMonkey);

  return new Monkey(id, items, operation, decision);
};

const createMonkeys = (lines: string[]): Monkey[] => splitOn(lines, v => v === '').map((m, i) => createMonkey(i, m));

async function start() {
  const lines = (await getAllLines(__dirname, 'input.txt')).map(l => l.trim());

  const simulationOne = new MonkeySimulation(createMonkeys(lines), worry => Math.floor(worry / 3));
  times(20, () => simulationOne.simulateRound());

  console.log('Part 1', simulationOne.calculateMonkeyBusiness());

  const monkeys = createMonkeys(lines);
  const lcmOfDivisors = product(monkeys.map(m => m.decision.divisibleBy));
  const simulationTwo = new MonkeySimulation(monkeys, worry => worry % lcmOfDivisors);
  times(10000, () => simulationTwo.simulateRound());

  console.log('Part 2', simulationTwo.calculateMonkeyBusiness());
}

start();
