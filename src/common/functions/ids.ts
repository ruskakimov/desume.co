export function generateId(): string {
  return new Date().getTime().toString();
}

export function generateIds(count: number): string[] {
  const prefix = generateId();
  return new Array(count).fill(prefix).map((str, index) => `${str}-${index}`);
}
