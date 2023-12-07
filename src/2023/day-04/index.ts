import { getAllLines, sum } from '@utils';

type Card = {
  id: number;
  winningNumbers: Set<string>;
  cardNumbers: Set<string>;
  matchCount: number;
};

const getCards = (lines: string[]): Card[] =>
  lines
    .map(line =>
      line
        .split(':')[1]
        .split('|')
        .map(numbers => new Set(numbers.match(/\d+/g))),
    )
    .map(([winningNumbers, cardNumbers], index) => ({
      id: index + 1,
      winningNumbers,
      cardNumbers,
      matchCount: [...cardNumbers].filter(n => winningNumbers.has(n)).length,
    }));

const calculatePointScores = (cards: Card[]): number[] =>
  cards.filter(card => card.matchCount > 0).map(card => Math.pow(2, card.matchCount - 1));

const calculateTotalScratchcards = (cards: Card[]): number => {
  const counts = new Map(cards.map(c => [c.id, 1]));

  for (const card of cards) {
    const nCards = counts.get(card.id)!;

    for (let nextId = card.id + 1; nextId <= card.id + card.matchCount; nextId++) {
      if (!counts.has(nextId)) break;
      counts.set(nextId, counts.get(nextId)! + nCards);
    }
  }

  return sum([...counts.values()]);
};

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const cards = getCards(lines);
  const scores = calculatePointScores(cards);
  const totalCards = calculateTotalScratchcards(cards);

  console.log('Part 1', sum(scores));
  console.log('Part 2', totalCards);
}

start();
