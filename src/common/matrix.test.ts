import { withInsertedColumn, withInsertedRow } from "./matrix";

describe("withInsertedColumn", () => {
  test("can insert a column in last place", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const newMat = withInsertedColumn<number>(mat, 2, 5);
    expect(newMat).toEqual([
      [1, 2, 5],
      [3, 4, 5],
    ]);
  });

  test("can insert a column in first place", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const newMat = withInsertedColumn<number>(mat, 0, 5);
    expect(newMat).toEqual([
      [5, 1, 2],
      [5, 3, 4],
    ]);
  });

  test("can insert a column in the middle", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const newMat = withInsertedColumn<number>(mat, 1, 0);
    expect(newMat).toEqual([
      [1, 0, 2, 3],
      [4, 0, 5, 6],
    ]);
  });
});

describe("withInsertedRow", () => {
  test("can insert a row in last place", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const newMat = withInsertedRow<number>(mat, 2, 0);
    expect(newMat).toEqual([
      [1, 2],
      [3, 4],
      [0, 0],
    ]);
  });

  test("can insert a row in first place", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const newMat = withInsertedRow<number>(mat, 0, 0);
    expect(newMat).toEqual([
      [0, 0],
      [1, 2],
      [3, 4],
    ]);
  });

  test("can insert a row in the middle", () => {
    const mat = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const newMat = withInsertedRow<number>(mat, 1, 0);
    expect(newMat).toEqual([
      [1, 2, 3],
      [0, 0, 0],
      [4, 5, 6],
    ]);
  });
});
