export class Range {
  constructor(private readonly start: number, private readonly end: number) {}

  containsValue(num: number): boolean {
    return this.start <= num && num <= this.end;
  }

  contains(range: Range): boolean {
    return this.start <= range.start && this.end >= range.end;
  }

  overlapsWith(range: Range): boolean {
    return range.start <= this.end && range.end >= this.start;
  }

  forEach(handler: (n: number) => void) {
    for (let n = this.start; n <= this.end; n++) {
      handler(n);
    }
  }

  static from(n1: number, n2: number): Range {
    return new Range(Math.min(n1, n2), Math.max(n1, n2));
  }
}
