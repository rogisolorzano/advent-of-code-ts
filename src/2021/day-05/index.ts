import { count, getAllLines } from '@utils';

enum SegmentOrientation {
  Diagonal,
  Horizontal,
  Vertical,
}

class Point {
  constructor(public x: number, public y: number) {}

  toString() {
    return `${this.x},${this.y}`;
  }

  static from(pointString: string) {
    const p = pointString.split(',');
    return new Point(Number(p[0]), Number(p[1]));
  }
}

class Segment {
  point: Point | null = null;

  constructor(readonly start: Point, readonly end: Point) {}

  next() {
    if (!this.hasNext()) return null;
    this.point = this.peak();
    return this.point;
  }

  hasNext() {
    return this.contains(this.peak());
  }

  contains(point: Point) {
    return (
      (this.start.x < this.end.x
        ? point.x >= this.start.x && point.x <= this.end.x
        : point.x <= this.start.x && point.x >= this.end.x) &&
      (this.start.y < this.end.y
        ? point.y >= this.start.y && point.y <= this.end.y
        : point.y <= this.start.y && point.y >= this.end.y)
    );
  }

  peak() {
    if (!this.point) return new Point(this.start.x, this.start.y);

    const xOffset = this.start.x < this.end.x ? 1 : -1;
    const yOffset = this.start.y < this.end.y ? 1 : -1;

    switch (this.getOrientation()) {
      case SegmentOrientation.Horizontal:
        return new Point(this.point.x, this.point.y + yOffset);
      case SegmentOrientation.Vertical:
        return new Point(this.point.x + xOffset, this.point.y);
      case SegmentOrientation.Diagonal:
        return new Point(this.point.x + xOffset, this.point.y + yOffset);
    }
  }

  clone() {
    return new Segment(this.start, this.end);
  }

  private getOrientation() {
    return this.start.x === this.end.x
      ? SegmentOrientation.Horizontal
      : this.start.y === this.end.y
      ? SegmentOrientation.Vertical
      : SegmentOrientation.Diagonal;
  }
}

const getOverlappingPointCount = (segments: Segment[]) => {
  const counts: Record<string, number> = {};

  for (const segment of segments) {
    while (segment.hasNext()) {
      const c = segment.next()!;
      counts[c.toString()] = (counts[c.toString()] || 0) + 1;
    }
  }

  return count(Object.values(counts), c => c > 1);
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const segments = lines.map<Segment>(l => {
    const points = l.split(' -> ').map(p => Point.from(p));
    return new Segment(points[0], points[1]);
  });
  const verticalAndHorizontalSegments = segments
    .filter(s => s.start.x === s.end.x || s.start.y === s.end.y)
    .map(s => s.clone());

  console.log('Vertical and horizontal overlaps', getOverlappingPointCount(verticalAndHorizontalSegments));
  console.log('All overlaps', getOverlappingPointCount(segments));
}

main();
