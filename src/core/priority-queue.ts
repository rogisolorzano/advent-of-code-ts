import { IQueue } from './queue';
import { MinHeap } from './min-heap';

export interface PriorityQueueItem {
  key: string;
  priority: number;
}

/**
 * PriorityQueue implementation using a min heap
 *
 * O(log n) dequeues and enqueues, O(n log n) initial sort
 */
export class PriorityQueue implements IQueue<PriorityQueueItem> {
  queue: MinHeap<PriorityQueueItem>;

  constructor(items: PriorityQueueItem[]) {
    this.queue = new MinHeap(items, p => p.priority);
  }

  dequeue() {
    return this.queue.dequeue();
  }

  enqueue({ key, priority }: PriorityQueueItem) {
    this.queue.enqueue({ key, priority });
  }

  length() {
    return this.queue.length();
  }
}
