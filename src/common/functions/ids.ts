export function generateId(): string {
  const timestamp = new Date().getTime().toString();
  const randomHex = Math.random().toString(16).slice(2);
  return `${timestamp}-${randomHex}`;
}

/**
 * Generates multiple ids at once without collisions.
 */
export function generateIds(count: number): string[] {
  const prefix = generateId();
  return new Array(count)
    .fill(prefix)
    .map((prefix, index) => `${prefix}-${index}`);
}
