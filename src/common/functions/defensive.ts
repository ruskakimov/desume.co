import { isObject, isString } from "./type-guards";

export function extractString(data: unknown, key: string): string | undefined {
  const value = extractProperty(data, key);
  if (isString(value)) return value;
}

export function extractProperty(
  data: unknown,
  key: string
): unknown | undefined {
  if (isObject(data) && key in data) return (data as any)[key];
}

export function safelyParseJSON(serialized: string): any {
  try {
    return JSON.parse(serialized);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
