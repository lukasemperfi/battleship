export const createArrayFromFunction = <T>(
  length: number,
  mapfn: (value: unknown, index: number) => T
): T[] => Array.from({ length }, mapfn);
