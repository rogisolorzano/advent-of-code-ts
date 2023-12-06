import { getAllLines, capitalize } from '@utils';

export enum Direction {
  Up,
  Down,
  Forward,
}

export interface MoveCommand {
  direction: Direction;
  units: number;
}

export interface Position {
  x: number;
  y: number;
  aim: number;
}

class Submarine {
  position: Position = { x: 0, y: 0, aim: 0 };

  navigate(commands: MoveCommand[]) {
    for (const command of commands) {
      switch (command.direction) {
        case Direction.Up:
          this.position.y -= command.units;
          break;
        case Direction.Down:
          this.position.y += command.units;
          break;
        case Direction.Forward:
          this.position.x += command.units;
          break;
      }
    }
  }

  navigateWithAim(commands: MoveCommand[]) {
    for (const command of commands) {
      switch (command.direction) {
        case Direction.Up:
          this.position.aim -= command.units;
          break;
        case Direction.Down:
          this.position.aim += command.units;
          break;
        case Direction.Forward:
          this.position.x += command.units;
          this.position.y += this.position.aim * command.units;
          break;
      }
    }
  }
}

async function main() {
  const commands = (await getAllLines(__dirname, 'input.txt'))
    .map(line => line.split(' '))
    .map<MoveCommand>(([direction, distance]) => ({
      direction: Direction[capitalize(direction) as keyof typeof Direction],
      units: Number(distance),
    }));

  const submarine = new Submarine();
  const coolerSubmarine = new Submarine();

  submarine.navigate(commands);
  coolerSubmarine.navigateWithAim(commands);

  console.log('Simple navigation:', submarine.position.x * submarine.position.y);
  console.log('Navigation with aim:', coolerSubmarine.position.x * coolerSubmarine.position.y);
}

main();
