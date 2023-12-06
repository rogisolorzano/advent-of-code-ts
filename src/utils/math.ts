export const sum = (a: number[]) => a.reduce((sum, n) => sum + n, 0);
export const product = (a: number[]) => a.reduce((p, n) => p * n, 1);
export const max = (a: number[]) => Math.max(...a);

export const count = <T>(a: T[], predicate: (v: T) => boolean) =>
  a.reduce((count, n) => (predicate(n) ? count + 1 : count), 0);

export const naturalNumbersSummation = (n: number) => (n * (n + 1)) / 2;

export const isNumber = (n: unknown): n is number => typeof n === 'number';

export const isNumeric = (n: unknown): boolean => !Number.isNaN(Number(n));