export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns a new array of numbers, where array[i] is a sum of [0:i] range in the original array.
 */
export function cumulative(array: number[]): number[] {
  let total = 0;
  return array.map((value) => {
    total += value;
    return total;
  });
}

/**
 * Returns a new array with a [value] inserted at [index].
 */
export function withInserted<T>(array: T[], index: number, value: T): T[] {
  const copy = array.slice();
  copy.splice(index, 0, value);
  return copy;
}

/**
 * Returns a new matrix with a column inserted at [index] filled with [value].
 */
export function withInsertedColumn<T>(
  matrix: T[][],
  index: number,
  value: T
): T[][] {
  return matrix.map((row) => withInserted(row, index, value));
}
