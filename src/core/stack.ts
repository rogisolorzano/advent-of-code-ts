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

  peek(): T | undefined {
    return this.stack[this.stack.length - 1];
  }
}
