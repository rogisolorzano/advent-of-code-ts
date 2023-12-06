import { getAllLines } from '@utils';

class Point {
  constructor(readonly x: number, readonly y: number, readonly z: number) {}

  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
}

type RotationFn = (p: Point) => Point;

// Some mistakes in these rotation fns caused hours and hours of grief!!!
// Wonder if there's a smarter way to do this than defining all of them manually.
const rotations: RotationFn[] = [
  p => new Point(p.x, p.y, p.z),
  p => new Point(p.x, -p.z, p.y),
  p => new Point(p.x, -p.y, -p.z),
  p => new Point(p.x, p.z, -p.y),
  p => new Point(-p.x, -p.y, p.z),
  p => new Point(-p.x, -p.z, -p.y),
  p => new Point(-p.x, p.y, -p.z),
  p => new Point(-p.x, p.z, p.y),
  p => new Point(p.y, p.x, -p.z),
  p => new Point(p.y, p.z, p.x),
  p => new Point(p.y, -p.x, p.z),
  p => new Point(p.y, -p.z, -p.x),
  p => new Point(-p.y, p.x, p.z),
  p => new Point(-p.y, -p.x, -p.z),
  p => new Point(-p.y, -p.z, p.x),
  p => new Point(-p.y, p.z, -p.x),
  p => new Point(p.z, p.x, p.y),
  p => new Point(p.z, -p.x, -p.y),
  p => new Point(p.z, -p.y, p.x),
  p => new Point(p.z, p.y, -p.x),
  p => new Point(-p.z, p.x, -p.y),
  p => new Point(-p.z, -p.x, p.y),
  p => new Point(-p.z, p.y, p.x),
  p => new Point(-p.z, -p.y, -p.x),
];

interface Translation {
  x: number;
  y: number;
  z: number;
}

const matchThreshold = 12;

/**
 * Applies a translation to a point.
 */
const translate = (p: Point, t: Translation) => new Point(p.x + t.x, p.y + t.y, p.z + t.z);
/**
 * Gets the manhattan distance between two points.
 */
const getDistance = (p: Point, p2: Point) => Math.abs(p.x - p2.x) + Math.abs(p.y - p2.y) + Math.abs(p.z - p2.z);

class Scanner {
  orientations: Point[][] = [];

  constructor(readonly points: Point[]) {
    this.generateOrientations();
  }

  /**
   * Generates the 24 possible orientations of the scanner's points.
   */
  generateOrientations() {
    for (const rotation of rotations) {
      const rotatedPoints = this.points.map(p => rotation(p));
      this.orientations.push(rotatedPoints);
    }
  }
}

class OceanMap {
  /**
   * These beacon points are known to have the correct orientation and are the source of truth of the map.
   */
  private beacons = new Map<string, Point>();
  /**
   * Keeps track of the scanner positions.
   */
  private scanners = new Map<string, Point>();

  /**
   * Gets the possible translations between the known points and other points.
   */
  getTranslations(otherPoints: Point[]): Translation[] {
    const translations = [];

    for (const point of this.beacons.values()) {
      for (const otherPoint of otherPoints) {
        translations.push({
          x: point.x - otherPoint.x,
          y: point.y - otherPoint.y,
          z: point.z - otherPoint.z,
        });
      }
    }

    return translations;
  }

  /**
   * Checks the scanner's 24 possible orientations for overlaps with the known
   * points in the ocean map. If there are at least 12 overlaps, we know that
   * we found a match and that the orientation is in sync with the ocean map.
   */
  matchWith(scanner: Scanner) {
    for (const orientedPoints of scanner.orientations) {
      const translations = this.getTranslations(orientedPoints);

      for (const translation of translations) {
        const translatedPoints = orientedPoints.map(p => translate(p, translation));
        const matchCount = translatedPoints.reduce((mc, p) => mc + (this.has(p) ? 1 : 0), 0);

        if (matchCount >= matchThreshold) {
          this.addScanner(new Point(translation.x, translation.y, translation.z));
          return translatedPoints;
        }
      }
    }

    return null;
  }

  /**
   * Processes a list of scanners. If the current points are empty, we can
   * take the points of the first scanner and use that as the source of truth
   * for orientation of the map.
   */
  processScanners(scanners: Scanner[]) {
    if (this.beacons.size === 0 && scanners.length > 0) {
      this.addBeacons(scanners.shift()!.points);
    }

    while (scanners.length > 0) {
      const scanner = scanners.shift()!;
      const matches = this.matchWith(scanner);

      if (matches !== null) {
        this.addBeacons(matches);
      } else {
        // If it did not match initially, this means that the ocean map
        // doesn't yet contain the region of points that have 12 points
        // overlapping with this scanner. We'll push it back in the queue
        // to be processed again later on.
        scanners.push(scanner);
      }
    }
  }

  /**
   * Gets the largest manhattan distance between scanners.
   */
  getLargestScannerDistance() {
    let maxDistance = -1;

    for (const scanner of this.scanners.values()) {
      for (const neighborScanner of this.scanners.values()) {
        const distance = getDistance(scanner, neighborScanner);
        maxDistance = distance > maxDistance ? distance : maxDistance;
      }
    }

    return maxDistance;
  }

  /**
   * Checks if the map currently has a point.
   */
  has(p: Point): boolean {
    return this.beacons.has(p.toString());
  }

  /**
   * Add a known scanner location.
   */
  addScanner(scanner: Point) {
    this.scanners.set(scanner.toString(), scanner);
  }

  /**
   * Add known beacon points to the map.
   */
  addBeacons(newBeacons: Point[]) {
    newBeacons.forEach(p => this.beacons.set(p.toString(), p));
  }

  /**
   * Gets the current beacons in the map.
   */
  getBeacons() {
    return [...this.beacons.values()];
  }
}

/**
 * Parses the input.
 */
const parseInput = (lines: string[]): Scanner[] => {
  const scanners = [];
  while (lines.length > 0) {
    const points: Point[] = [];
    while (true) {
      const line = lines.shift();
      if (!line || line.length === 0) {
        break;
      }
      if (line.startsWith('---')) {
        continue;
      }
      const coords = line.split(',').map(c => Number(c));
      points.push(new Point(coords[0], coords[1], coords[2]));
    }
    scanners.push(new Scanner(points));
  }
  return scanners;
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const scanners = parseInput(lines);
  const oceanMap = new OceanMap();

  oceanMap.processScanners(scanners);

  console.log('Pt 1.', oceanMap.getBeacons().length);
  console.log('Pt 2.', oceanMap.getLargestScannerDistance());
}

main();
