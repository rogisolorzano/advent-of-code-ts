export const sort = <T>(values: T[], by: (v: T) => number) => values.sort((a, b) => by(a) - by(b));
