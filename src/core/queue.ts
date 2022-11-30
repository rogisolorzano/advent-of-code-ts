export interface IQueueable {
  toString(): string;
}
export interface IQueue<T> {
  enqueue(v: T): void;
  dequeue(): T | undefined;
  length(): number;
}

export class Queue<T extends IQueueable> implements IQueue<T> {
  private qMap = new Map<string, T>();
  private q: T[] = [];

  dequeue(): T | undefined {
    return this.q.shift();
  }

  enqueue(v: T) {
    this.q.push(v);
    this.qMap.set(v.toString(), v);
  }

  enqueueUnique(v: T) {
    if (this.qMap.has(v.toString())) return;
    this.enqueue(v);
  }

  history(): T[] {
    return [...this.qMap.values()];
  }

  length() {
    return this.q.length;
  }
}
