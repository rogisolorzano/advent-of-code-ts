import { IQueueable } from './queue';
import { isDefined } from '../utils';

type X = number;
type Y = number;
export type Translation = [X, Y];

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

  protected getNeighbor(point: Point, direction: NeighborDirection): Point | undefined {
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

  protected hasPoint(x: number, y: number) {
    return isDefined(this.points[y]) && isDefined(this.points[y][x]);
  }

  protected get(x: number, y: number) {
    return this.points[y][x];
  }

  protected sum() {
    return this.points.reduce((sum, points) => sum + points.reduce((s, p) => (s += p.value), 0), 0);
  }

  protected isOnEdge(point: Point) {
    return (
      point.y === 0 || point.x === 0 || point.y === this.points.length - 1 || point.x === this.points[0]?.length - 1
    );
  }
}
