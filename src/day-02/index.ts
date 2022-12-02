import { getAllLines, invert, sum } from '../utils';

enum Move {
  Rock,
  Paper,
  Scissors,
}

enum GameResult {
  Win,
  Lose,
  Draw,
}

type LeftStrategyGuideKey = 'A' | 'B' | 'C';
type RightStrategyGuideKey = 'X' | 'Y' | 'Z';

const opponentDecryptedMove: Record<LeftStrategyGuideKey, Move> = {
  A: Move.Rock,
  B: Move.Paper,
  C: Move.Scissors,
};

const playerDecryptedMove: Record<RightStrategyGuideKey, Move> = {
  X: Move.Rock,
  Y: Move.Paper,
  Z: Move.Scissors,
};

const decryptedFixedResult: Record<RightStrategyGuideKey, GameResult> = {
  X: GameResult.Lose,
  Y: GameResult.Draw,
  Z: GameResult.Win,
};

const winningMoves: Record<Move, Move> = {
  [Move.Rock]: Move.Scissors,
  [Move.Paper]: Move.Rock,
  [Move.Scissors]: Move.Paper,
};
const losingMoves = invert(winningMoves);

interface StrategyGuideInstruction {
  left: LeftStrategyGuideKey;
  right: RightStrategyGuideKey;
}

interface Turn {
  playerMove: Move;
  opponentMove: Move;
}

const selectionScore: Record<Move, number> = {
  [Move.Rock]: 1,
  [Move.Paper]: 2,
  [Move.Scissors]: 3,
};

const resultScore: Record<GameResult, number> = {
  [GameResult.Win]: 6,
  [GameResult.Draw]: 3,
  [GameResult.Lose]: 0,
};

const play = ({ playerMove, opponentMove }: Turn): GameResult => {
  if (winningMoves[playerMove] === opponentMove) return GameResult.Win;
  if (winningMoves[opponentMove] === playerMove) return GameResult.Lose;
  return GameResult.Draw;
};

const fixedMove = (goalResult: GameResult, opponentMove: Move): Move => {
  if (GameResult.Draw) return opponentMove;
  return GameResult.Win ? losingMoves[opponentMove] : winningMoves[opponentMove];
};

const calculateScore = (turn: Turn) => selectionScore[turn.playerMove] + resultScore[play(turn)];

const getTurns = (instructions: StrategyGuideInstruction[], fixedGame = false) =>
  instructions.map(
    ({ left, right }): Turn => ({
      playerMove: fixedGame
        ? fixedMove(decryptedFixedResult[right], opponentDecryptedMove[left])
        : playerDecryptedMove[right],
      opponentMove: opponentDecryptedMove[left],
    }),
  );

async function start() {
  const instructions = (await getAllLines(__dirname, 'input.txt'))
    .map(line => line.split(' ') as [LeftStrategyGuideKey, RightStrategyGuideKey])
    .map(([left, right]): StrategyGuideInstruction => ({ left, right }));

  const scoresStrategyOne = getTurns(instructions).map(calculateScore);
  const scoresStrategyTwo = getTurns(instructions, true).map(calculateScore);

  console.log('Part 1', sum(scoresStrategyOne));
  console.log('Part 2', sum(scoresStrategyTwo));
}

start();
