import { Point, Range } from '.';

export class Rectangle {
  constructor(public x1: number, public x2: number, public y1: number, public y2: number) {}

  contains(point: Point) {
    return Range.from(this.x1, this.x2).containsValue(point.x) && Range.from(this.y1, this.y2).containsValue(point.y);
  }

  overlapsWith(rectangle: Rectangle) {
    return this.x1 < rectangle.x2 && rectangle.x1 < this.x2 && this.y1 < rectangle.y2 && rectangle.y1 < this.y2;
  }

  intersection(rectangle: Rectangle): Rectangle {
    return new Rectangle(
      Math.max(this.x1, rectangle.x1),
      Math.min(this.x2, rectangle.x2),
      Math.max(this.y1, rectangle.y1),
      Math.min(this.y2, rectangle.y2),
    );
  }
}
