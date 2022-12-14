import { IQueueable } from './queue';
import { from, isDefined } from '../utils';
import { PriorityQueue } from '.';

type X = number;
type Y = number;
export type Translation = [X, Y];
export type PointString = string;

export class Point implements IQueueable {
  constructor(public x: number, public y: number, public value: number) {}

  toString(): PointString {
    return `${this.x},${this.y}`;
  }

  copyWith(updates: { x?: number; y?: number; value?: number }) {
    return new Point(
      isDefined(updates.x) ? updates.x : this.x,
      isDefined(updates.y) ? updates.y : this.y,
      isDefined(updates.value) ? updates.value : this.value,
    );
  }

  isOn(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  isNeighboring(point: Point): boolean {
    return [
      [this.x, this.y - 1],
      [this.x + 1, this.y],
      [this.x, this.y + 1],
      [this.x - 1, this.y],
      [this.x - 1, this.y - 1],
      [this.x + 1, this.y - 1],
      [this.x + 1, this.y + 1],
      [this.x - 1, this.y + 1],
    ].some(p => point.x === p[0] && point.y === p[1]);
  }

  translate(translation: Translation) {
    this.x += translation[0];
    this.y += translation[1];
  }

  differenceWith(point: Point): Translation {
    return [this.x - point.x, this.y - point.y];
  }
}

export enum NeighborDirection {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

interface ShortestPathInfo {
  pointString: PointString;
  distanceFromStart: number;
  visitedFrom?: Point;
}

interface DijkstraOptions {
  isTargetPoint?: (point: Point) => boolean;
  getWeight?: (point: Point) => number;
  neighborFilter?: (neighborPoint: Point, currentPoint: Point) => boolean;
}

export class Grid {
  constructor(readonly points: Point[][]) {}

  public getNeighbors(point: Point, includeDiagonal = false): Point[] {
    return [
      [point.x, point.y - 1],
      [point.x + 1, point.y],
      [point.x, point.y + 1],
      [point.x - 1, point.y],
      ...(includeDiagonal
        ? [
            [point.x - 1, point.y - 1],
            [point.x + 1, point.y - 1],
            [point.x + 1, point.y + 1],
            [point.x - 1, point.y + 1],
          ]
        : []),
    ]
      .filter(([x, y]) => this.hasPoint(x, y))
      .map(([x, y]) => this.get(x, y));
  }

  public getNeighbor(point: Point, direction: NeighborDirection): Point | undefined {
    const newPoint = point.copyWith({});

    switch (direction) {
      case NeighborDirection.Top:
        newPoint.y -= 1;
        break;
      case NeighborDirection.Bottom:
        newPoint.y += 1;
        break;
      case NeighborDirection.Left:
        newPoint.x -= 1;
        break;
      case NeighborDirection.Right:
        newPoint.x += 1;
        break;
    }

    return this.hasPoint(newPoint.x, newPoint.y) ? this.get(newPoint.x, newPoint.y) : undefined;
  }

  public hasPoint(x: number, y: number) {
    return isDefined(this.points[y]) && isDefined(this.points[y][x]);
  }

  public get(x: number, y: number) {
    return this.points[y][x];
  }

  public getFromString(str: PointString) {
    const [x, y] = str.split(',').map(n => Number(n));
    return this.get(x, y);
  }

  public sum() {
    return this.points.reduce((sum, points) => sum + points.reduce((s, p) => (s += p.value), 0), 0);
  }

  public isOnEdge(point: Point) {
    return (
      point.y === 0 || point.x === 0 || point.y === this.points.length - 1 || point.x === this.points[0]?.length - 1
    );
  }

  updatePoint(point: Point) {
    const relevantPoint = this.get(point.x, point.y);
    if (!relevantPoint) return;
    relevantPoint.value = point.value;
  }

  static ofSize(xSize: number, ySize: number, valueInit: (x: number, y: number) => number): Grid {
    const points = from<Point[]>(ySize + 1, (_, y) => from(xSize + 1, (_, x) => new Point(x, y, valueInit(x, y))));
    return new Grid(points);
  }

  forEachPoint(operator: (p: Point) => void) {
    this.points.forEach(y => y.forEach(operator));
  }

  dijkstra(
    startingPoint: Point,
    { isTargetPoint, getWeight = () => 1, neighborFilter = () => true }: DijkstraOptions,
  ): Map<PointString, ShortestPathInfo> {
    const queue = new PriorityQueue<string>([]);
    const pathInfoMap = new Map<string, ShortestPathInfo>();
    const visited = new Set<PointString>();

    this.forEachPoint(point => {
      const pointString = point.toString();
      const distanceFromStart = point.isOn(startingPoint) ? 0 : Infinity;

      queue.enqueue({
        value: pointString,
        priority: distanceFromStart,
      });
      pathInfoMap.set(pointString, {
        pointString,
        distanceFromStart,
      });
    });

    while (queue.length() > 0) {
      const item = queue.dequeue()!;
      const point = this.getFromString(item.value);

      if (visited.has(item.value)) {
        continue;
      }

      if (isTargetPoint && isTargetPoint(point)) {
        break;
      }

      visited.add(item.value);

      for (const neighborPoint of this.getNeighbors(point).filter(n => neighborFilter(n, point))) {
        const neighborItem = pathInfoMap.get(neighborPoint.toString());

        if (visited.has(neighborPoint.toString()) || !neighborItem) {
          continue;
        }

        const newPriority = item.priority + getWeight(neighborPoint);

        if (newPriority < neighborItem.distanceFromStart) {
          queue.enqueue({
            value: neighborItem.pointString,
            priority: newPriority,
          });
          neighborItem.distanceFromStart = newPriority;
          neighborItem.visitedFrom = point;
          pathInfoMap.set(neighborItem.pointString, neighborItem);
        }
      }
    }

    return pathInfoMap;
  }
}
