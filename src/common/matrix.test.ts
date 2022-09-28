import { withInsertedColumnAt } from "./matrix";

describe("withInsertedColumn", () => {
  test("can insert a column in last place", () => {
    const mat = [
      [1, 2],
      [3, 4],
    ];
    const newMat = withInsertedColumnAt<number>(mat, 2, 5);
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
    const newMat = withInsertedColumnAt<number>(mat, 0, 5);
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
    const newMat = withInsertedColumnAt<number>(mat, 1, 0);
    expect(newMat).toEqual([
      [1, 0, 2, 3],
      [4, 0, 5, 6],
    ]);
  });
});
