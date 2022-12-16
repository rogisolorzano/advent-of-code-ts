import { Point, Rectangle, Range, Translation } from '../core';
import { getAllLines } from '../utils';

class Beacon {
  constructor(public position: Point) {}
}

class Sensor {
  beaconDistance: number;
  xBound: Range;
  yBound: Range;

  constructor(public position: Point, public nearestBeacon: Beacon) {
    this.beaconDistance = position.manhattanDistanceTo(nearestBeacon.position);
    this.xBound = new Range(position.x - this.beaconDistance, position.x + this.beaconDistance);
    this.yBound = new Range(position.y - this.beaconDistance, position.y + this.beaconDistance);
  }

  scanInY(y: number): Point[] {
    if (!this.yBound.containsValue(y)) return [];

    return this.xBound.reduce<Point[]>((positions, x) => {
      const neighbor = new Point(x, y, 0);

      if (
        !neighbor.isOn(this.nearestBeacon.position) &&
        this.position.manhattanDistanceTo(neighbor) <= this.beaconDistance
      ) {
        positions.push(neighbor);
      }

      return positions;
    }, []);
  }

  getBoundaryIn(bounds: Rectangle): Point[] {
    const { x, y } = this.position;
    const top = new Point(x, this.yBound.start - 1, 0);
    const left = new Point(this.xBound.start - 1, y, 0);
    const bottom = new Point(x, this.yBound.end + 1, 0);
    const right = new Point(this.xBound.end + 1, y, 0);
    const boundaryPaths: [Point, Point, Translation][] = [
      [top, left, [-1, 1]],
      [left, bottom, [1, 1]],
      [bottom, right, [1, -1]],
      [right, top, [-1, -1]],
    ];

    return boundaryPaths.reduce((boundary, [from, to, translation]) => {
      let next = from;
      while (!next.isOn(to)) {
        if (bounds.contains(next)) boundary.push(next);
        next = next.copy().translate(translation);
      }
      return boundary;
    }, [] as Point[]);
  }
}

class SensorMap {
  constructor(public sensors: Sensor[]) {}

  findEmptyPositionsInY(y: number): number {
    const emptyX = this.sensors.reduce((xSet, sensor) => {
      sensor.scanInY(y).forEach(position => position.y === y && xSet.add(position.x));
      return xSet;
    }, new Set<number>());

    return emptyX.size;
  }

  isInRangeOfASensor(point: Point): boolean {
    return this.sensors.some(sensor => point.manhattanDistanceTo(sensor.position) <= sensor.beaconDistance);
  }

  findEmptyPositionsInBounds(start: number, end: number): Point | undefined {
    const bounds = new Rectangle(start, end, start, end);

    return this.sensors.flatMap(s => s.getBoundaryIn(bounds)).find(p => !this.isInRangeOfASensor(p));
  }
}

const createSensor = (line: string): Sensor => {
  const matches = line.matchAll(
    /Sensor at x\=(?<sensorX>-?\d+)\, y\=(?<sensorY>-?\d+)\: closest beacon is at x\=(?<beaconX>-?\d+)\, y\=(?<beaconY>-?\d+)/g,
  );
  const { sensorX, sensorY, beaconX, beaconY } = matches.next().value.groups;

  return new Sensor(
    new Point(Number(sensorX), Number(sensorY), 0),
    new Beacon(new Point(Number(beaconX), Number(beaconY), 0)),
  );
};

async function start() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const sensors = lines.map(createSensor);
  const map = new SensorMap(sensors);

  console.log('Part 1', map.findEmptyPositionsInY(2000000));

  const point = map.findEmptyPositionsInBounds(0, 4000000)!;

  console.log('Part 2', point.x * 4000000 + point.y);
}

start();
