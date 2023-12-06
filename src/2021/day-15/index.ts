import { getAllLines } from '@utils';
import { Point, Grid, PriorityQueue, PriorityQueueItem } from '@core';

interface DistanceData {
  key: string;
  distanceFromStart: number;
  visitedFrom: Point | null;
}

class CaveMap extends Grid {
  constructor(points: Point[][], readonly size: number) {
    super(points);
  }

  /**
   * Dijkstra's with a priority queue.
   */
  findExitPathRiskLevel() {
    const target = this.get(this.size, this.size);
    const priorities = this.points.flatMap<PriorityQueueItem<string>>(l =>
      l.map(p => ({
        value: p.toString(),
        priority: p.x === 0 && p.y === 0 ? 0 : Infinity,
      })),
    );
    const queue = new PriorityQueue(priorities);
    const visited = new Set<string>();
    const distanceData = this.points.reduce((all, yRows) => {
      yRows.forEach(p => {
        all.set(p.toString(), {
          key: p.toString(),
          distanceFromStart: p.x === 0 && p.y === 0 ? 0 : Infinity,
          visitedFrom: null,
        });
      });
      return all;
    }, new Map<string, DistanceData>());

    while (queue.length() > 0) {
      const item = queue.dequeue()!;
      const [x, y] = item.value.split(',').map(n => Number(n));
      const point = this.get(x, y);

      if (visited.has(item.value)) {
        continue;
      }

      if (target.x === x && target.y === y) {
        break;
      }

      visited.add(point.toString());

      for (const edge of this.getNeighbors(point)) {
        const edgeItem = distanceData.get(edge.toString());

        if (visited.has(edge.toString()) || !edgeItem) {
          continue;
        }

        const newPriority = item.priority + edge.value;

        if (newPriority < edgeItem.distanceFromStart) {
          queue.enqueue({
            value: edgeItem.key,
            priority: newPriority,
          });
          edgeItem.distanceFromStart = newPriority;
          edgeItem.visitedFrom = point;
          distanceData.set(edgeItem.key, edgeItem);
        }
      }
    }

    return this.backtraceTotalRiskLevelFrom(target, distanceData);
  }

  private backtraceTotalRiskLevelFrom(point: Point, distanceData: Map<string, DistanceData>) {
    let riskLevel = 0;
    while (true) {
      if (distanceData.get(point.toString())?.visitedFrom === null) {
        break;
      }
      riskLevel += point.value;
      point = distanceData.get(point.toString())!.visitedFrom!;
    }
    return riskLevel;
  }
}

// @todo - there has to be a better way to expand the map!
const expandX = (points: Point[][], tileSize: number) => {
  for (let y = 0; y < points.length; y++) {
    let times = 0;
    while (times < 4) {
      const startIndex = times * tileSize;
      for (let x = startIndex; x < startIndex + tileSize; x++) {
        const newValue = points[y][x].value + 1;
        points[y].push(new Point(x + tileSize, y, newValue <= 9 ? newValue : 1));
      }
      times++;
    }
  }
  return points;
};
const expandY = (points: Point[][], tileSize: number) => {
  let times = 0;
  while (times < 4) {
    const startIndex = times * tileSize;
    for (let y = startIndex; y < startIndex + tileSize; y++) {
      const incremented = [];
      for (let x = 0; x < points[y].length; x++) {
        const newValue = points[y][x].value + 1;
        incremented.push(new Point(x, y + tileSize, newValue <= 9 ? newValue : 1));
      }
      points.push(incremented);
    }
    times++;
  }
  return points;
};

const expandMapPoints = (points: Point[][], tileSize: number) => {
  const withXExpanded = expandX(points, tileSize);
  return expandY(withXExpanded, tileSize);
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const points = lines.map((l, y) => [...l].map((n, x) => new Point(x, y, Number(n))));
  const pointsCopy = points.map(l => l.map(p => p.copyWith({})));
  const fullMapPoints = expandMapPoints(pointsCopy, pointsCopy[0].length);

  const smallMap = new CaveMap(points, points[0].length - 1);
  const expandedMap = new CaveMap(fullMapPoints, fullMapPoints[0].length - 1);

  console.log('Pt 1.', smallMap.findExitPathRiskLevel());
  console.log('Pt 2.', expandedMap.findExitPathRiskLevel());
}

main();
