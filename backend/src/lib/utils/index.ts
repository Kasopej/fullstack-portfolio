export function omit<
  T extends object,
  K extends keyof Required<T> = keyof Required<T>,
>(obj: T, ...keys: readonly K[]): Omit<T, K> {
  if (!obj) return obj;
  const clone = { ...obj };

  for (const key of keys) {
    delete clone[key];
  }

  return clone;
}

// export function omit<
//   T extends object | undefined,
//   O extends NonNullable<T> = NonNullable<T>,
//   K extends keyof Required<O> = keyof Required<O>,
// >(
//   obj: T,
//   ...keys: readonly K[]
// ): typeof obj extends O ? Omit<O, K> : Partial<O> {
//   if (!obj) return {} as typeof obj extends O ? Omit<O, K> : Partial<O>;
//   const clone = { ...obj };

//   for (const key of keys) {
//     delete (clone as O)[key];
//   }

//   return clone as typeof obj extends O ? Omit<O, K> : Partial<O>;
// }
