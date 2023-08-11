const createArrayFromFunction = <T>(
  length: number,
  mapfn: (value: unknown, index: number) => T
): T[] => Array.from({ length }, mapfn);

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const generateRandomNumber = (max: number): number =>
  Math.floor(Math.random() * (max + 1));

const delay = async (ms: number): Promise<unknown> => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

export { createArrayFromFunction, deepClone, generateRandomNumber, delay };
