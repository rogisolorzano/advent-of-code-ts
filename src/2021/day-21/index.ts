import { getAllLines } from '@utils';

class Die {
  n = 0;
  rollCount = 0;

  next() {
    if (this.n === 100) this.n = 0;
    this.n++;
    this.rollCount++;
    return this.n;
  }
}

class Player {
  constructor(public position: number, public score: number = 0) {}

  copy() {
    return new Player(this.position, this.score);
  }

  toString() {
    return `${this.position},${this.score}`;
  }
}

const warmupGame = (positions: number[]) => {
  const die = new Die();
  const player1 = new Player(positions[0]);
  const player2 = new Player(positions[1]);
  let playerTurn = 1;

  while (player1.score < 1000 && player2.score < 1000) {
    const toMove = die.next() + die.next() + die.next();
    const player = playerTurn === 1 ? player1 : player2;
    let position = (player.position + toMove) % 10;
    position = position === 0 ? 10 : position;
    player.position = position;
    player.score += position;
    playerTurn = playerTurn === 1 ? 2 : 1;
  }

  return Math.min(player1.score, player2.score) * die.rollCount;
};

// [player1Wins, player2Wins]
type WinCounts = [number, number];

// Cache of the current position and the win counts of that position
const positionCache = new Map<string, WinCounts>();

/**
 * Recursively simulate positions. Since there are a limited number of game scenarios,
 * caching positions avoids having to simulate trillions of positions.
 */
const simulatePosition = (playerOne: Player, playerTwo: Player, currentPlayer: 1 | 2): WinCounts => {
  // The cache key representing the current state.
  const key = `${playerOne.toString()},${playerTwo.toString()},${currentPlayer}`;

  // Base cases
  if (playerOne.score >= 21) return [1, 0];
  if (playerTwo.score >= 21) return [0, 1];
  // Checks if this position has already been explored.
  if (positionCache.has(key)) return positionCache.get(key)!;

  const wins: WinCounts = [0, 0];

  // Simulate rolls for the 3 possible outcomes of the 3 dice
  for (const roll1 of [1, 2, 3]) {
    for (const roll2 of [1, 2, 3]) {
      for (const roll3 of [1, 2, 3]) {
        const playerOneThisRoll = playerOne.copy();
        const playerTwoThisRoll = playerTwo.copy();
        const player = currentPlayer === 1 ? playerOneThisRoll : playerTwoThisRoll;
        let position = (player.position + roll1 + roll2 + roll3) % 10;
        position = position === 0 ? 10 : position;
        player.position = position;
        player.score += position;

        const result = simulatePosition(playerOneThisRoll, playerTwoThisRoll, currentPlayer === 1 ? 2 : 1);
        wins[0] += result[0];
        wins[1] += result[1];
      }
    }
  }

  positionCache.set(key, wins);

  return wins;
};

/**
 * Starts the quantum game simulation!
 */
const quantumGame = (positions: number[]): WinCounts =>
  simulatePosition(new Player(positions[0]), new Player(positions[1]), 1);

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  let positions = [Number(lines[0].split(': ')[1]), Number(lines[1].split(': ')[1])];

  console.log('Pt 1.', warmupGame(positions));
  console.log('Pt 2.', Math.max(...quantumGame(positions)));
}

main();
