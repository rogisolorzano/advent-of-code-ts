export type Bit = 1 | 0;
export type BitChar = '1' | '0';

export const hexToPaddedBinary = (hex: string) =>
  [...hex].reduce((binary, c) => binary + parseInt(c, 16).toString(2).padStart(4, '0'), '');

export const bitStringToNumber = (bitString: string): number => parseInt(bitString, 2);

export const bitsToNumber = (bits: Bit[]): number => bitStringToNumber(bits.join(''));

export const bitSubstring = (bitString: string, start: number, end: number): number =>
  bitStringToNumber(bitString.substring(start, end));
