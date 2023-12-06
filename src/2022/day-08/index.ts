import { Grid, NeighborDirection, Point, Queue } from '@core';
import { getAllLines, max, sum } from '@utils';

interface TreeSearchResult {
  lastTreePoint: Point;
  treesSeen: number;
}

interface TreeMapAnalysis {
  maxScenicScore: number;
  visibleFromEdge: number;
}

class TreeGrid extends Grid {
  private searchTreesInDirection(treePoint: Point, direction: NeighborDirection): TreeSearchResult {
    const queue = new Queue<Point>([treePoint]);
    let treesSeen = 0;

    while (queue.length() > 0) {
      const point = queue.dequeue()!;
      const neighbor = this.getNeighbor(point, direction);

      if (!neighbor) return { lastTreePoint: point, treesSeen };
      if (neighbor.value < treePoint.value) queue.enqueue(neighbor);

      treesSeen++;
    }

    return { treesSeen, lastTreePoint: treePoint };
  }

  public analyzeTreeMap(): TreeMapAnalysis {
    const scenicScores = [];
    let visibleFromEdge = 0;

    for (const pointsY of this.points) {
      for (const currentPoint of pointsY) {
        const results = Object.values(NeighborDirection).map(d => this.searchTreesInDirection(currentPoint, d));
        const hasTreeOnEdge = results.some(r => this.isOnEdge(r.lastTreePoint));
        const scenicScore = results.reduce((score, r) => score * r.treesSeen, 1);

        visibleFromEdge += hasTreeOnEdge ? 1 : 0;
        scenicScores.push(scenicScore);
      }
    }

    return { visibleFromEdge, maxScenicScore: max(scenicScores) };
  }
}

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const points = lines.map((line, y) => line.split('').map((n, x) => new Point(x, y, Number(n))));
  const grid = new TreeGrid(points);
  const analysisResult = grid.analyzeTreeMap();

  console.log('Part 1', analysisResult.visibleFromEdge);
  console.log('Part 2', analysisResult.maxScenicScore);
}

start();
