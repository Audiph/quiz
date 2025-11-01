import { RandomGenerator, ShuffleResult } from '../types/shuffle';

const createSeededRandom = (seed: string): RandomGenerator => {
  const initialHash = seed.split('').reduce((h, char) => {
    const temp = Math.imul(h ^ char.charCodeAt(0), 3432918353);
    return (temp << 13) | (temp >>> 19);
  }, 1779033703 ^ seed.length);

  const createGenerator = (state: number): RandomGenerator => ({
    state,
    next(): { readonly value: number; readonly nextState: RandomGenerator } {
      const hash1 = Math.imul(state ^ (state >>> 16), 2246822507);
      const hash2 = Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
      const finalHash = hash2 ^ (hash2 >>> 16);

      return {
        value: (finalHash >>> 0) / 4294967296,
        nextState: createGenerator(finalHash),
      };
    },
  });

  return createGenerator(initialHash);
};

export const shuffleArray = <T>(
  array: readonly T[],
  seed: string,
  options: { readonly returnMapping?: boolean } = {},
): readonly T[] | ShuffleResult<T> => {
  const { returnMapping = false } = options;

  const swap = <U>(arr: readonly U[], i: number, j: number): readonly U[] => {
    if (i === j) return arr;

    return arr.map((item, idx) => {
      if (idx === i) return arr[j];
      if (idx === j) return arr[i];
      return item;
    });
  };

  const performShuffle = (
    items: readonly T[],
    indices: readonly number[],
    currentIndex: number,
    rng: RandomGenerator,
  ): { readonly shuffled: readonly T[]; readonly mapping: readonly number[] } => {
    if (currentIndex <= 0) {
      return { shuffled: items, mapping: indices };
    }

    const { value, nextState } = rng.next();
    const randomIndex = Math.floor(value * (currentIndex + 1));

    return performShuffle(
      swap(items, currentIndex, randomIndex),
      swap(indices, currentIndex, randomIndex),
      currentIndex - 1,
      nextState,
    );
  };

  const initialIndices = Array.from({ length: array.length }, (_, i) => i);
  const generator = createSeededRandom(seed);
  const result = performShuffle(array, initialIndices, array.length - 1, generator);

  return returnMapping ? result : result.shuffled;
};

export const reverseMapping = (shuffledIndex: number, mapping: readonly number[]): number => {
  return mapping[shuffledIndex] ?? -1;
};

export const unshuffle = <T>(
  shuffledArray: readonly T[],
  mapping: readonly number[],
): readonly T[] => {
  const result = new Array<T>(shuffledArray.length);

  for (let i = 0; i < shuffledArray.length; i++) {
    const originalIndex = mapping[i];
    result[originalIndex] = shuffledArray[i];
  }

  return result;
};
