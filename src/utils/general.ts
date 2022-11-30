export const isDefined = <T>(v: T | undefined | null): v is T => typeof v !== 'undefined' && v !== null;

export const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
