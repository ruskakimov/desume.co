export function isObject(data: unknown): data is object {
  return typeof data === "object" && data !== null;
}

export function isString(data: unknown): data is string {
  return typeof data === "string";
}

export function isBoolean(data: unknown): data is boolean {
  return typeof data === "boolean";
}

export function isNumber(data: unknown): data is number {
  return typeof data === "number";
}

export function notNullish<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}
