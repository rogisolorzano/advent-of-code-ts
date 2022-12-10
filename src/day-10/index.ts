import { chunk, getAllLines, sum } from '../utils';
import { Range } from '../core';

interface Instruction {
  type: 'noop' | 'addx';
  cyclesNeeded: number;
  value?: number;
}

type Pixel = '.' | '#';

class CPU {
  cycle = 1;
  register = 1;
  signalReadings: number[] = [];
  pixels: Pixel[] = [];

  constructor(public instructions: Instruction[]) {}

  tick() {
    this.readSignal();
    this.writePixel();

    this.cycle++;
    this.instructions[0].cyclesNeeded--;
    const { cyclesNeeded, value, type } = this.instructions[0];

    if (cyclesNeeded > 0) return;
    if (type === 'addx') this.register += value!;
    this.instructions.shift();
  }

  process() {
    while (this.instructions.length > 0) {
      this.tick();
    }
  }

  private writePixel() {
    const registerRange = new Range(this.register - 1, this.register + 1);
    this.pixels.push(registerRange.containsValue((this.cycle % 40) - 1) ? '#' : '.');
  }

  private readSignal() {
    if ((this.cycle - 20) % 40 === 0) {
      this.signalReadings.push(this.cycle * this.register);
    }
  }
}

async function start() {
  const instructions = (await getAllLines(__dirname, 'input.txt')).map((line): Instruction => {
    const [ins, amount] = line.split(' ');
    return {
      type: ins as Instruction['type'],
      cyclesNeeded: ins === 'noop' ? 1 : 2,
      value: ins === 'noop' ? undefined : Number(amount),
    };
  });

  const cpu = new CPU(instructions);
  cpu.process();

  console.log(sum(cpu.signalReadings));
  console.log(
    chunk(cpu.pixels, 40)
      .map(p => p.join(''))
      .join('\n'),
  );
}

start();
