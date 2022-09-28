import { withInsertedAt } from "./array";

describe("withInserted", () => {
  test("inserts a value in last place", () => {
    expect(withInsertedAt([1, 2, 3], 3, 4)).toEqual([1, 2, 3, 4]);
  });

  test("inserts a value in first place", () => {
    expect(withInsertedAt([1, 2, 3], 0, 42)).toEqual([42, 1, 2, 3]);
  });

  test("inserts a value in the middle", () => {
    expect(withInsertedAt([1, 2, 3], 1, 42)).toEqual([1, 42, 2, 3]);
  });
});
