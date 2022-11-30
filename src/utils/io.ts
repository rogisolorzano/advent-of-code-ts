import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { ReadStream } from 'fs';

/**
 * Get file as a stream.
 *
 * @param root
 * @param filename
 */
export const getStream = (root: string, filename: string): ReadStream => fs.createReadStream(path.join(root, filename));

/**
 * Gets an async line iterator.
 *
 * @param root
 * @param filename
 */
export const getLines = (root: string, filename: string): readline.Interface => {
  const stream = getStream(root, filename);

  return readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
};

/**
 * Gets all lines in an array.
 *
 * @param root
 * @param filename
 */
export const getAllLines = async (root: string, filename: string): Promise<string[]> => {
  const lines = getLines(root, filename);
  const allLines = [];

  for await (const line of lines) {
    allLines.push(line);
  }

  return allLines;
};

/**
 * Gets the entire contents of the file with a specified encoding.
 *
 * @param root
 * @param filename
 * @param encoding
 */
export const getContents = (root: string, filename: string, encoding: BufferEncoding = 'utf8') =>
  fs.readFileSync(path.join(root, filename), encoding);
