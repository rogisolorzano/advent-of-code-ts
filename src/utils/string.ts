/**
 * Capitalize a string.
 *
 * @param str
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const isLowerCase = (str: string) => str === str.toLowerCase() && str !== str.toUpperCase();

export const stringHas = (str: string, substr: string) => str.indexOf(substr) >= 0;

/**
 * Finds the first common character in an array of strings.
 *
 * @param strings
 */
export const findCommonCharacter = (strings: string[]): string | undefined => {
  const occurrences = countCharacterOccurrences(strings.join(''));
  const candidates = Object.entries(occurrences).filter(([_, count]) => count >= strings.length);

  for (const [char] of candidates) {
    if (strings.every(s => stringHas(s, char))) {
      return char;
    }
  }
};

export const countCharacterOccurrences = (str: string): Record<string, number> =>
  [...str].reduce((counts, char) => {
    counts[char] = (counts[char] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
