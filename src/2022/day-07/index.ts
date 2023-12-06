import { getAllLines, getOrCreate, sort, sum } from '@utils';

type Path = string;

abstract class FileSystemNode {
  constructor(
    public name: string,
    public path: Path,
    public parent: DirectoryNode | undefined = undefined,
    public children: FileSystemNode[] = [],
  ) {}

  addChild(node: FileSystemNode) {
    this.children.push(node);
  }
}

class FileNode extends FileSystemNode {
  constructor(public size: number, name: string, path: Path, parent: DirectoryNode) {
    super(name, path, parent);
  }
}

class DirectoryNode extends FileSystemNode {}

class FileSystem {
  currentDirectory: FileSystemNode;
  nodeMap: Map<Path, FileSystemNode>;

  constructor() {
    this.currentDirectory = new DirectoryNode('/', '/');
    this.nodeMap = new Map<string, FileSystemNode>();
    this.nodeMap.set('/', this.currentDirectory);
  }

  changeDirectory(name: string) {
    this.currentDirectory =
      name === '..' && !!this.currentDirectory.parent ? this.currentDirectory.parent : this.getDirectoryNode(name);
  }

  registerDirectory(name: string) {
    this.currentDirectory.addChild(this.getDirectoryNode(name));
  }

  registerFile(name: string, size: number) {
    this.currentDirectory.addChild(this.getFileNode(name, size));
  }

  getRootNode(): DirectoryNode {
    return this.nodeMap.get('/')!;
  }

  private getFileNode = (name: string, size: number) =>
    this.getNode(this.getPath(name), () => new FileNode(size, name, this.getPath(name), this.currentDirectory));

  private getDirectoryNode = (name: string) =>
    this.getNode(this.getPath(name), () => new DirectoryNode(name, this.getPath(name), this.currentDirectory));

  private getNode = (path: string, creator: () => FileSystemNode) => getOrCreate(this.nodeMap, path, creator);

  private getPath = (name: string) => `${this.currentDirectory.path}${name}/`;
}

const buildFileSystem = (logs: string[]): FileSystem => {
  const fileSystem = new FileSystem();

  for (const parts of logs.map(l => l.split(' '))) {
    if (parts[0] === '$' && parts[1] === 'ls') continue;

    switch (parts[0]) {
      case '$':
        fileSystem.changeDirectory(parts[2]);
        break;
      case 'dir':
        fileSystem.registerDirectory(parts[1]);
        break;
      default:
        fileSystem.registerFile(parts[1], Number(parts[0]));
    }
  }

  return fileSystem;
};

const getDirectorySizes = (node: FileSystemNode, sizesHolder: number[]): number => {
  if (node instanceof FileNode) {
    return node.size;
  }

  const size = node.children.reduce((sum, child) => sum + getDirectorySizes(child, sizesHolder), 0);

  sizesHolder.push(size);

  return size;
};

const totalDiskSpace = 70_000_000;
const spaceNeededForUpdate = 30_000_000;

async function start() {
  const logs = (await getAllLines(__dirname, 'input.txt')).slice(1);
  const fileSystem = buildFileSystem(logs);
  const sizes: number[] = [];
  const rootSize = getDirectorySizes(fileSystem.getRootNode(), sizes);
  const freeSpace = totalDiskSpace - rootSize;
  const remainingSpaceNeeded = spaceNeededForUpdate - freeSpace;
  const smallDirectorySums = sum(sizes.filter(s => s <= 100000));
  const sizeOfDirectoryToDelete = sort(sizes).find(s => s >= remainingSpaceNeeded);

  console.log('Part 1', smallDirectorySums);
  console.log('Part 2', sizeOfDirectoryToDelete);
}

start();
