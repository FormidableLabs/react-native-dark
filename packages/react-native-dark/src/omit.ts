export const omit = <T, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
  const { [key]: _key, ...rest } = obj;
  return rest;
};
