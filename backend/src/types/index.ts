export type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : K]: T[K];
};

export type DTOFromEntity<T extends object> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
