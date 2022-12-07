export class WindowIterator<T> {
  private nextIndex: number = 0;

  constructor(private readonly arr: T[], private readonly windowSize: number) {
    if (windowSize <= 0) {
      throw new Error('Window size cannot be negative');
    }
  }

  /**
   * Whether there is a next window to return.
   */
  hasNext(): boolean {
    return this.nextIndex < this.arr.length - this.windowSize + 1;
  }

  /**
   * Returns the next window.
   */
  next(): T[] {
    if (!this.hasNext()) {
      return [];
    }

    const window = this.arr.slice(this.nextIndex, this.nextIndex + this.windowSize);
    this.nextIndex++;

    return window;
  }

  get nextWindowIndex() {
    return this.nextIndex;
  }

  get currentWindowIndex() {
    return this.nextIndex - 1;
  }
}
