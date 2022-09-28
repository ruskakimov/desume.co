import { clamp, cumulative, withInserted, withInsertedColumn } from "./math";

describe("clamp", () => {
  test("returns the same value if in range", () => {
    expect(clamp(12, 10, 20)).toEqual(12);
  });

  test("clamps smaller value to min", () => {
    expect(clamp(5, 10, 20)).toEqual(10);
  });

  test("clamps larger value to max", () => {
    expect(clamp(21, 10, 20)).toEqual(20);
  });
});

describe("cumulative", () => {
  test("returns an empty array", () => {
    expect(cumulative([])).toEqual([]);
  });

  test("works for positive integers", () => {
    expect(cumulative([1, 2, 3, 4])).toEqual([1, 3, 6, 10]);
  });

  test("works for negative integers", () => {
    expect(cumulative([-1, -4, -2, -10])).toEqual([-1, -5, -7, -17]);
  });

  test("works for mixed positive and negative integers", () => {
    expect(cumulative([10, -40, 15, 0])).toEqual([10, -30, -15, -15]);
  });
});

describe("withInserted", () => {
  test("inserts a value in last place", () => {
    expect(withInserted([1, 2, 3], 3, 4)).toEqual([1, 2, 3, 4]);
  });

  test("inserts a value in first place", () => {
    expect(withInserted([1, 2, 3], 0, 42)).toEqual([42, 1, 2, 3]);
  });

  test("inserts a value in the middle", () => {
    expect(withInserted([1, 2, 3], 1, 42)).toEqual([1, 42, 2, 3]);
  });
});

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
