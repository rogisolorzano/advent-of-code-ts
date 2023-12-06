import { getAllLines } from '@utils';
import { Grid, Point, Queue } from '@core';

class HeightMap extends Grid {
  getLowPointRiskLevel() {
    return this.getLowPoints().reduce((riskLevel, point) => riskLevel + point.value + 1, 0);
  }

  getLargestBasinSizes() {
    return this.getLowPoints()
      .map(point => this.searchBasin(point))
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .reduce((total, basin) => total * basin.length, 1);
  }

  searchBasin(startingPoint: Point) {
    const queue = new Queue<Point>();
    queue.enqueueUnique(startingPoint);

    while (queue.length() > 0) {
      this.getNeighbors(queue.dequeue()!)
        .filter(p => p.value !== 9)
        .forEach(p => queue.enqueueUnique(p));
    }

    return queue.history();
  }

  getLowPoints() {
    return this.points.reduce((points, line) => {
      line.forEach(p => this.isLowPoint(p) && points.push(p));
      return points;
    }, []);
  }

  isLowPoint(point: Point) {
    return this.getNeighbors(point).every(n => point.value < n.value);
  }
}

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const points = lines.map((l, y) => l.split('').map((v, x) => new Point(x, y, Number(v))));
  const map = new HeightMap(points);

  console.log('Pt 1. Low point risk level', map.getLowPointRiskLevel());
  console.log('Pt 2. Largest basin sizes', map.getLargestBasinSizes());
}

main();
