import { withInsertedAt } from "./array";

export interface CellCoord {
  rowIndex: number;
  colIndex: number;
}

/**
 * Returns a new matrix with a column inserted at [index] filled with [fillValue].
 */
export function withInsertedColumn<T>(
  matrix: T[][],
  index: number,
  fillValue: T
): T[][] {
  return matrix.map((row) => withInsertedAt(row, index, fillValue));
}

/**
 * Returns a new matrix with a row inserted at [index] filled with [fillValue].
 */
export function withInsertedRow<T>(
  matrix: T[][],
  index: number,
  fillValue: T
): T[][] {
  const columnCount = matrix[0].length;
  const newRow = Array(columnCount).fill(fillValue);
  return withInsertedAt(matrix, index, newRow);
}

/**
 * Returns a new matrix with a cell at [coord] filled with [content].
 */
export function withChangedCell<T>(
  matrix: T[][],
  coord: CellCoord,
  content: T
): T[][] {
  return matrix.map((row, rowIndex) =>
    rowIndex === coord.rowIndex
      ? row.map((cell, colIndex) =>
          colIndex === coord.colIndex ? content : cell
        )
      : row
  );
}
