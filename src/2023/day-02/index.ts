import { getAllLines, sum } from '@utils';

type GameStat = {
  gameNumber: number;
  red: number;
  green: number;
  blue: number;
};

const trackGameMaxes = (games: string[]): GameStat[] =>
  games.map(game => {
    const [gamePart, countsPart] = game.split(':');
    const gameNumber = Number(gamePart.replace('Game ', ''));
    return countsPart
      .split(/[;,]/)
      .map(turn => turn.trim().split(' ') as [string, keyof GameStat])
      .reduce(
        (stats, [count, color]) => {
          stats[color] = Math.max(stats[color], Number(count));
          return stats;
        },
        { gameNumber, red: 0, green: 0, blue: 0 },
      );
  });

async function start() {
  const games = await getAllLines(__dirname, 'input.txt');
  const gameStats = trackGameMaxes(games);
  const possibleGameNumbers = gameStats
    .filter(g => g.red <= 12 && g.green <= 13 && g.blue <= 14)
    .map(g => g.gameNumber);
  const powers = gameStats.map(g => g.red * g.green * g.blue);

  console.log('Part 1', sum(possibleGameNumbers));
  console.log('Part 2', sum(powers));
}

start();
