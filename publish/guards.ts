// export type Guard<T> = (value: unknown) => value is T;
export type NoisyGuard<T> = (value: unknown, noisy?: boolean, path?: string) => value is T;

export function isString(value: unknown, noisy = false, path = ""): value is string {
  const result = typeof value === "string";
  if (!result && noisy) {
    console.warn(`Not a string at ${path}: ${typeof value}`);
  }
  return result;
}

export function guardUndefinedOr<T>(guard: NoisyGuard<T>): NoisyGuard<T | undefined> {
  return (value: unknown, noisy = false, path = ""): value is (T | undefined) => {
    if (value === undefined) {
      return true;
    }
    return guard(value, noisy, path);
  }
}

export const isStringOrUndefined = guardUndefinedOr<string>(isString);

export function hasProperty<T extends { [k in K]: V }, K extends keyof T, V extends T[K]>(
  key: K,
  guard: NoisyGuard<V>,
  value: unknown,
  noisy = false,
  path = "",
): value is T {
  if (value == null) {
    if (noisy) {
      console.warn(`Null value for parent of ${key} at ${path}`);
    }
    return false;
  }
  return guard((value as T)[key], noisy, `${path}.${key}`);
}

export function guardProperty<K extends string, V>(key: K, guard: NoisyGuard<V>): NoisyGuard<{ [k in K]: V }> {
  return (value: unknown, noisy = false, path = ""): value is { [k in K]: V } => hasProperty<{ [k in K]: V }, K, V>(key, guard, value, noisy, path);
}

export const guardStringNamed = <K extends string>(key: K): NoisyGuard<{ [k in K]: string }> => guardProperty(key, isString);

export function isArrayOf<T>(value: unknown, guard: NoisyGuard<T>, noisy = false, path = ""): value is T[] {
  if (!Array.isArray(value)) {
    if (noisy) {
      console.warn(`Not an array at ${path}: ${typeof value}`);
    }
    return false;
  }
  return (value as unknown[]).find((v, n) => !guard(v, noisy, `${path}[${n}]`)) === undefined;
}

export const guardArrayOf = <T>(guard: NoisyGuard<T>): NoisyGuard<T[]> => (
  value: unknown,
  noisy = false,
  path = "",
): value is T[] => isArrayOf(value, guard, noisy, path);

export function guardExactlyOne<T, U>(t: NoisyGuard<T>, u: NoisyGuard<U>): NoisyGuard<T & U>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function guardExactlyOne<T, R>(...guards: NoisyGuard<unknown>[]): NoisyGuard<T> {
  return <T>(value: unknown, noisy = false, path = ""): value is T => {
    const count = guards.filter((g, n) => g(value, false, `${path}[${n}]`)).length;
    if (count === 1) {
      return true;
    }
    if (noisy) {
      console.warn(`Expected 1, found ${count}`);
    }
    return false;
  }
}

export function guardAtMostOne<T, U>(t: NoisyGuard<T>, u: NoisyGuard<U>): NoisyGuard<T & U>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function guardAtMostOne<T, R>(...guards: NoisyGuard<unknown>[]): NoisyGuard<T> {
  return <T>(value: unknown, noisy = false, path = ""): value is T => {
    const count = guards.filter((g) => g(value, false, path)).length;
    if (count <= 1) {
      return true;
    }
    if (noisy) {
      console.warn(`Expected at most 1, found ${count} at ${path}`);
    }
    return false;
  }
}

export type GuardDefs<T> = {
  [K in keyof T]: NoisyGuard<T[K]>
};

export function isAllOf<T>(value: unknown, guards: GuardDefs<T>, noisy = false, path = ""): value is T {
  if (value == null) {
    if (noisy) {
      console.warn(`Missing value for isAllOf at ${path}`);
    }
    return false;
  }
  for (const key of Object.keys(guards)) {
    const guard: NoisyGuard<unknown> = guards[key as keyof T];
    const item = (value as Record<string, unknown>)[key];
    if (!guard(item, noisy, `${path}.${key}`)) {
      return false;
    }
  }
  return true;
}

export function guardAllOf<T>(guards: GuardDefs<T>): NoisyGuard<T> {
  return (value: unknown, noisy = false, path = ""): value is T => isAllOf(value, guards, noisy, path);
}

export function guardAll<T, U>(t: NoisyGuard<T>, u: NoisyGuard<U>): NoisyGuard<T & U>;
export function guardAll<T, U, V>(t: NoisyGuard<T>, u: NoisyGuard<U>, v: NoisyGuard<V>): NoisyGuard<T & U & V>;
export function guardAll<T, U, V, W>(t: NoisyGuard<T>, u: NoisyGuard<U>, v: NoisyGuard<V>, w: NoisyGuard<W>): NoisyGuard<T & U & V & W>;
export function guardAll<T, U, V, W, X>(t: NoisyGuard<T>, u: NoisyGuard<U>, v: NoisyGuard<V>, w: NoisyGuard<W>, x: NoisyGuard<X>): NoisyGuard<T & U & V & W & X>;
export function guardAll<T, U, V, W, X, Y>(t: NoisyGuard<T>, u: NoisyGuard<U>, v: NoisyGuard<V>, w: NoisyGuard<W>, x: NoisyGuard<X>, y: NoisyGuard<Y>): NoisyGuard<T & U & V & W & X & Y>;
export function guardAll<T, U, V, W, X, Y, Z>(t: NoisyGuard<T>, u: NoisyGuard<U>, v: NoisyGuard<V>, w: NoisyGuard<W>, x: NoisyGuard<X>, y: NoisyGuard<Y>, z: NoisyGuard<Z>): NoisyGuard<T & U & V & W & X & Y & Z>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function guardAll<T, R>(...guards: NoisyGuard<unknown>[]): NoisyGuard<T> {
  return <T>(value: unknown, noisy = false, path = ""): value is T => {
    return guards.find((g) => !g(value, noisy, path)) === undefined;
  }
}
