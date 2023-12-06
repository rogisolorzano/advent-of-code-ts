import { getAllLines } from '@utils';

type BoardNodeValue = number;

interface BoardNodePosition {
  x: number;
  y: number;
}

interface BoardNode {
  position: BoardNodePosition;
  value: BoardNodeValue;
  isMarked: boolean;
}

class Board {
  winningNode: BoardNode | null = null;
  nodePositionMap: Record<BoardNodeValue, BoardNodePosition> = {};
  xScores: Record<BoardNodePosition['x'], number> = {};
  yScores: Record<BoardNodePosition['y'], number> = {};
  nodeGraph: BoardNode[][] = [];
  unmarkedSum = 0;

  constructor(boardLines: string[], readonly boardSize = 5) {
    this.loadBoard(boardLines);
  }

  markNodeIfExists(value: BoardNodeValue): BoardNode | null {
    const node = this.getNodeByValue(value);

    if (!node) {
      return null;
    }

    if (!node.isMarked) {
      node.isMarked = true;
      this.xScores[node.position.x] = (this.xScores[node.position.x] || 0) + 1;
      this.yScores[node.position.y] = (this.yScores[node.position.y] || 0) + 1;
      this.unmarkedSum -= node.value;
    }

    return node;
  }

  hasWonAtNode(node: BoardNode): boolean {
    const won = this.xScores[node.position.x] === this.boardSize || this.yScores[node.position.y] === this.boardSize;

    if (won) {
      this.winningNode = node;
    }

    return won;
  }

  getScore() {
    return this.unmarkedSum * (this.winningNode?.value ?? 1);
  }

  private getNodeByValue(value: BoardNodeValue): BoardNode | null {
    if (!this.nodePositionMap[value]) return null;

    const { x, y } = this.nodePositionMap[value];

    return this.nodeGraph[y][x];
  }

  private loadBoard(boardLines: string[]) {
    boardLines.forEach((line, y) => {
      const lineNodes = line
        .split(' ')
        .filter(l => l !== '')
        .map(l => Number(l));
      this.nodeGraph.push([]);

      lineNodes.forEach((value, x) => {
        this.nodePositionMap[value] = { x, y };
        this.nodeGraph[y].push({ position: { x, y }, isMarked: false, value });
        this.unmarkedSum += value;
      });
    });
  }
}

const createBoards = (lines: string[]) => {
  const boards = [];

  for (let i = 2; i < lines.length; i += 6) {
    boards.push(new Board(lines.slice(i, i + 5)));
  }

  return boards;
};

const simulateBingo = (numbersCalled: number[], boards: Board[], winningBoardPosition: number) => {
  const boardWins = Array.from({ length: boards.length }, () => false);
  let boardWinsCount = 0;

  for (const number of numbersCalled) {
    for (let boardId = 0; boardId < boards.length; boardId++) {
      const markedNode = boards[boardId].markNodeIfExists(number);
      const boardWon = !!markedNode && boards[boardId].hasWonAtNode(markedNode);

      if (boardWon && !boardWins[boardId]) {
        boardWins[boardId] = true;
        boardWinsCount++;
      }

      if (boardWinsCount === winningBoardPosition) {
        return boards[boardId];
      }
    }
  }
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const numbersCalled = lines[0].split(',').map(n => Number(n));
  const boards = createBoards(lines);

  const firstWinningBoard = simulateBingo(numbersCalled, boards, 1);
  const lastWinningBoard = simulateBingo(numbersCalled, boards, boards.length);

  console.log('Score for first winning board', firstWinningBoard?.getScore());
  console.log('Score for last winning board', lastWinningBoard?.getScore());
}

main();
