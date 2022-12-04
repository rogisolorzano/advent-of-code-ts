export class Range {
  constructor(private readonly start: number, private readonly end: number) {}

  contains(range: Range): boolean {
    return this.start <= range.start && this.end >= range.end;
  }

  overlapsWith(range: Range): boolean {
    return range.start <= this.end && range.end >= this.start;
  }
}
