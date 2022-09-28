/**
 * Returns a new array with a [value] inserted at [index].
 */
export function withInsertedAt<T>(array: T[], index: number, value: T): T[] {
  const copy = array.slice();
  copy.splice(index, 0, value);
  return copy;
}

/**
 * Returns a new array without the element at [index].
 */
export function withRemovedAt<T>(array: T[], index: number): T[] {
  const copy = array.slice();
  copy.splice(index, 1);
  return copy;
}
