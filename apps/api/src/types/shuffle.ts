export interface ShuffleResult<T> {
  readonly shuffled: readonly T[];
  readonly mapping: readonly number[];
}

export interface RandomGenerator {
  readonly state: number;
  next(): { readonly value: number; readonly nextState: RandomGenerator };
}
