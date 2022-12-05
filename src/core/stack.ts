export class Stack<T> {
  private stack: T[];

  constructor(private readonly init?: T[]) {
    this.stack = init ?? [];
  }

  add(item: T) {
    this.stack.push(item);
  }

  pop(): T | undefined {
    return this.stack.pop();
  }

  addMany(items: T[]) {
    items.forEach(item => this.add(item));
  }

  popMany(n: number): T[] {
    const items = [];
    while (items.length < n) {
      const item = this.pop();
      if (item === undefined) break;
      items.push(item);
    }
    return items;
  }

  peek(): T | undefined {
    return this.stack[this.stack.length - 1];
  }
}
