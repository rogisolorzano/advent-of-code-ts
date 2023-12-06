import { getAllLines, isLowerCase } from '@utils';

class Node {
  constructor(readonly value: string, private edges: Node[] = []) {}

  addEdge(node: Node) {
    this.edges.push(node);
  }

  getEdges() {
    return this.edges;
  }
}

class CaveSystem {
  constructor(readonly caves: Node[]) {}

  countPaths(withTwoSmallCaves: boolean) {
    const start = this.caves.find(n => n.value === 'start')!;
    return this.search(start, withTwoSmallCaves);
  }

  search(node: Node, withTwoSmallCaves: boolean, counts = new Map<string, number>(), seenSmallCaveTwice = false) {
    if (node.value === 'end') return 1;

    const newCount = (counts.get(node.value) || 0) + 1;
    counts.set(node.value, newCount);

    if (isLowerCase(node.value) && newCount > 1) {
      seenSmallCaveTwice = true;
    }

    let count = 0;

    for (const edge of node.getEdges()) {
      const isSmallCave = isLowerCase(edge.value);
      const neverSeenBefore = !counts.has(edge.value);
      const isValidSmallCave = isSmallCave && !seenSmallCaveTwice && withTwoSmallCaves && edge.value !== 'start';

      if (!isSmallCave || isValidSmallCave || neverSeenBefore) {
        count += this.search(edge, withTwoSmallCaves, new Map(counts), seenSmallCaveTwice);
      }
    }

    return count;
  }
}

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const graph = lines.reduce((nodes, edge) => {
    const [one, two] = edge.split('-');
    if (!nodes[two]) nodes[two] = new Node(two);
    if (!nodes[one]) nodes[one] = new Node(one);
    nodes[one].addEdge(nodes[two]);
    nodes[two].addEdge(nodes[one]);
    return nodes;
  }, {} as Record<string, Node>);
  const caveSystem = new CaveSystem(Object.values(graph));

  console.log('Pt 1.', caveSystem.countPaths(false));
  console.log('Pt 2.', caveSystem.countPaths(true));
}

main();
