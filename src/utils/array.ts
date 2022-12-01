export const sort = (values: number[]) => values.sort((a, b) => a - b);
export const sortBy = <T>(values: T[], by: (v: T) => number) => values.sort((a, b) => by(a) - by(b));

export const lastIndex = <T>(arr: T[]): number => arr.length - 1;
export const lastItem = <T>(arr: T[]): T => arr[lastIndex(arr)];
export const last = <T>(arr: T[], n: number) => arr.slice(-n);

export const parseNumbers = <T>(arr: T[]): number[] => arr.map(n => Number(n));

/**
 * Split arrays based on a predicate.
 *
 * @param arr The array to split.
 * @param predicate Receives the current item and returns true if the split should happen at that item.
 */
export const splitOn = <T>(arr: T[], predicate: (v: T) => boolean): T[][] =>
  arr
    .reduce(
      (chunks, item) => {
        if (predicate(item)) {
          chunks.push([]);
        } else {
          lastItem(chunks).push(item);
        }

        return chunks;
      },
      [[]] as T[][],
    )
    .filter(a => a.length > 0);
