import { Grid, Point } from '../core';
import { getAllLines } from '../utils';

const buildGrid = (lines: string[]): [Grid, Point, Point] => {
  let startingPoint: Point;
  let targetPoint: Point;
  const points = lines.map((line, y) =>
    line.split('').map((p, x) => {
      const point = new Point(x, y, 0);
      if (p === 'S') {
        startingPoint = point;
        p = 'a';
      } else if (p === 'E') {
        targetPoint = point;
        p = 'z';
      }
      point.value = p.charCodeAt(0) - 97;
      return point;
    }),
  );
  return [new Grid(points), startingPoint!, targetPoint!];
};

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const [grid, startingPoint, targetPoint] = buildGrid(lines);

  const toSummit = grid.dijkstra(startingPoint, {
    isTargetPoint: point => point.isOn(targetPoint),
    neighborFilter: (neighborPoint, currentPoint) => neighborPoint.value <= currentPoint.value + 1,
  });

  const trailsFromSummit = grid.dijkstra(targetPoint, {
    isTargetPoint: point => point.value === 0,
    neighborFilter: (neighborPoint, currentPoint) => currentPoint.value - neighborPoint.value <= 1,
  });

  const distanceToSummit = toSummit.get(targetPoint.toString())?.distanceFromStart;

  const distanceInScenicRoute = [...trailsFromSummit.values()].find(info => {
    const point = grid.getFromString(info.pointString);
    return point.value === 0 && info.distanceFromStart !== Infinity;
  })?.distanceFromStart;

  console.log('Part 1', distanceToSummit);
  console.log('Part 2', distanceInScenicRoute);
}

start();
