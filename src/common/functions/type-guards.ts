export function isObject(data: unknown): data is object {
  return typeof data === "object" && data !== null;
}

export function isString(data: unknown): data is string {
  return typeof data === "string";
}
