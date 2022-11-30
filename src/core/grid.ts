import { IQueueable } from './queue';
import { isDefined } from '../utils';

export class Point implements IQueueable {
  constructor(public x: number, public y: number, public value: number) {}

  toString() {
    return `${this.x},${this.y}`;
  }

  copyWith(updates: { x?: number; y?: number; value?: number }) {
    return new Point(
      isDefined(updates.x) ? updates.x : this.x,
      isDefined(updates.y) ? updates.y : this.y,
      isDefined(updates.value) ? updates.value : this.value,
    );
  }
}

export class Grid {
  constructor(readonly points: Point[][]) {}

  protected getNeighbors(point: Point, includeDiagonal = false): Point[] {
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

  protected hasPoint(x: number, y: number) {
    return isDefined(this.points[y]) && isDefined(this.points[y][x]);
  }

  protected get(x: number, y: number) {
    return this.points[y][x];
  }

  protected sum() {
    return this.points.reduce((sum, points) => sum + points.reduce((s, p) => (s += p.value), 0), 0);
  }
}
