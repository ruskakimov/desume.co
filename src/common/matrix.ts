import { withInsertedAt } from "./array";

/**
 * Returns a new matrix with a column inserted at [index] filled with [value].
 */
export function withInsertedColumn<T>(
  matrix: T[][],
  index: number,
  value: T
): T[][] {
  return matrix.map((row) => withInsertedAt(row, index, value));
}

/**
 * Returns a new matrix with a row inserted at [index] filled with [value].
 */
export function withInsertedRow<T>(
  matrix: T[][],
  index: number,
  value: T
): T[][] {
  return matrix;
}
