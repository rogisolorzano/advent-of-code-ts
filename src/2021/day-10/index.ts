import { getAllLines } from '@utils';

const openingTags = ['{', '<', '[', '('];
const openCloseMap: Record<string, string> = { '}': '{', '>': '<', ']': '[', ')': '(' };
const closeOpenMap: Record<string, string> = { '{': '}', '<': '>', '[': ']', '(': ')' };
const corruptScoreMap: Record<string, number> = { '}': 1197, '>': 25137, ']': 57, ')': 3 };
const incompleteScoreMap: Record<string, number> = { '}': 3, '>': 4, ']': 2, ')': 1 };

interface Score {
  incomplete: number;
  corrupt: number;
}

const calculateScore = (lines: string[]): Score => {
  const incompleteScores = [];
  let corruptScore = 0;

  for (const line of lines) {
    const tagStack = [];
    let isCorrupted = false;

    for (const tag of line) {
      if (openingTags.includes(tag)) {
        tagStack.push(tag);
      } else {
        const expectedTag = tagStack.pop();

        if (openCloseMap[tag] !== expectedTag) {
          corruptScore += corruptScoreMap[tag];
          isCorrupted = true;
        }
      }
    }

    if (!isCorrupted) {
      let incompleteScore = 0;
      while (tagStack.length > 0) {
        incompleteScore = incompleteScore * 5 + incompleteScoreMap[closeOpenMap[tagStack.pop()!]];
      }
      incompleteScores.push(incompleteScore);
    }
  }

  return {
    incomplete: incompleteScores.sort((a, b) => a - b)[Math.floor(incompleteScores.length / 2)],
    corrupt: corruptScore,
  };
};

async function main() {
  const lines = await getAllLines(__dirname, 'sample-input.txt');
  const score = calculateScore(lines);

  console.log('Pt 1. Corrupt score', score.corrupt);
  console.log('Pt 2. Incomplete score', score.incomplete);
}

main();
