export const isDefined = <T>(v: T | undefined | null): v is T => typeof v !== 'undefined' && v !== null;

export const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const invert = <K extends keyof any, V extends keyof any>(map: Record<K, V>): Record<V, K> =>
  Object.entries(map).reduce((inverted, [k, v]) => {
    inverted[v as V] = k as K;
    return inverted;
  }, {} as Record<V, K>);

export const times = <T>(n: number, operation: () => T): T[] => {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(operation());
  }
  return results;
};

type Creator<V> = () => V;

export const getOrCreate = <K, V>(map: Map<K, V>, key: K, creator: Creator<V>): V => {
  if (!map.has(key)) {
    map.set(key, creator());
  }

  return map.get(key)!;
};
