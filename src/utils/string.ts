/**
 * Capitalize a string.
 *
 * @param str
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const isLowerCase = (str: string) => str === str.toLowerCase() && str !== str.toUpperCase();