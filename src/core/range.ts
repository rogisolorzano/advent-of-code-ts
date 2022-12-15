export class Range {
  constructor(public readonly start: number, public readonly end: number) {}

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

  map<T>(handler: (n: number) => T): T[] {
    const mapped = [];
    for (let n = this.start; n <= this.end; n++) {
      mapped.push(handler(n));
    }
    return mapped;
  }

  reduce<T>(handler: (value: T, n: number) => T, value: T): T {
    for (let n = this.start; n <= this.end; n++) {
      value = handler(value, n);
    }
    return value;
  }

  static ascending(n1: number, n2: number): Range {
    return new Range(Math.min(n1, n2), Math.max(n1, n2));
  }

  static from(n1: number, n2: number): Range {
    return new Range(n1, n2);
  }

  [Symbol.iterator]() {
    let position = this.start - 1;
    return {
      next: () => ({
        value: (position += 1),
        done: position > this.end,
      }),
    };
  }
}
