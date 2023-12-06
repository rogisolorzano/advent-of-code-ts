import { bitStringToNumber, bitSubstring, getAllLines, hexToPaddedBinary } from '@utils';

abstract class Packet {
  value: number = 0;
  children: Packet[] = [];

  constructor(readonly version: number, readonly typeId: TypeId) {}

  addChild(packet: Packet) {
    this.children.push(packet);
  }

  setValue(value: number) {
    this.value = value;
  }
}

class LiteralPacket extends Packet {
  constructor(version: number, value: number) {
    super(version, TypeId.Literal);
    this.setValue(value);
  }
}

class OperatorPacket extends Packet {
  calculateValue() {
    switch (this.typeId) {
      case TypeId.Sum:
        this.setValue(this.children.reduce((sum, p) => sum + p.value, 0));
        break;
      case TypeId.Product:
        this.setValue(this.children.reduce((product, p) => product * p.value, 1));
        break;
      case TypeId.Minimum:
        this.setValue(Math.min(...this.children.map(p => p.value)));
        break;
      case TypeId.Maximum:
        this.setValue(Math.max(...this.children.map(p => p.value)));
        break;
      case TypeId.GreaterThan:
        this.setValue(this.children[0].value > this.children[1]?.value ? 1 : 0);
        break;
      case TypeId.LessThan:
        this.setValue(this.children[0].value < this.children[1]?.value ? 1 : 0);
        break;
      case TypeId.Equal:
        this.setValue(this.children[0].value === this.children[1]?.value ? 1 : 0);
        break;
      case TypeId.Literal:
      default:
        break;
    }
    return this;
  }
}

enum TypeId {
  Sum = 0,
  Product = 1,
  Minimum = 2,
  Maximum = 3,
  Literal = 4,
  GreaterThan = 5,
  LessThan = 6,
  Equal = 7,
}

interface PacketInfo {
  pointer: number;
  versionTotal: number;
}

/**
 * Builds a Packet tree recursively using a pointer to keep track of the current position
 * in the bit string. Parent packets hold the evaluated totals of all their children.
 */
const parsePacket = (bits: string, info: PacketInfo) => {
  const version = bitSubstring(bits, info.pointer, info.pointer + 3);
  const typeId = bitSubstring(bits, info.pointer + 3, info.pointer + 6);
  info.pointer += 6;
  info.versionTotal += version;

  if (typeId === TypeId.Literal) {
    let valueBits = '';

    while (true) {
      let signalBit = bits[info.pointer];
      info.pointer += 5;
      valueBits += bits.substring(info.pointer - 4, info.pointer);
      if (signalBit === '0') break;
    }

    return new LiteralPacket(version, bitStringToNumber(valueBits));
  }

  const parentPacket = new OperatorPacket(version, typeId);
  const lengthTypeId = bits.substring(info.pointer, info.pointer + 1);
  const nLengthTypeBits = lengthTypeId === '0' ? 15 : 11;
  const lengthTypeValue = bitSubstring(bits, info.pointer + 1, info.pointer + nLengthTypeBits + 1);
  info.pointer += nLengthTypeBits + 1;

  if (lengthTypeId === '0') {
    const target = info.pointer + lengthTypeValue;
    while (info.pointer < target) {
      parentPacket.addChild(parsePacket(bits, info));
    }
  } else {
    for (let n = 0; n < lengthTypeValue; n++) {
      parentPacket.addChild(parsePacket(bits, info));
    }
  }

  return parentPacket.calculateValue();
};

async function main() {
  const lines = await getAllLines(__dirname, 'input.txt');
  const packetInfoReference = { pointer: 0, versionTotal: 0 };
  const packetTreeRoot = parsePacket(hexToPaddedBinary(lines[0]), packetInfoReference);

  console.log('Pt 1.', packetInfoReference.versionTotal);
  console.log('Pt 2.', packetTreeRoot.value);
}

main();
