import { withInsertedAt, withRemovedAt } from "./array";

describe("withInsertedAt", () => {
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

describe("withRemovedAt", () => {
  test("removes a value in last place", () => {
    expect(withRemovedAt([1, 2, 3], 2)).toEqual([1, 2]);
  });

  test("removes a value in first place", () => {
    expect(withRemovedAt([1, 2, 3], 0)).toEqual([2, 3]);
  });

  test("removes a value in the middle", () => {
    expect(withRemovedAt([1, 2, 3], 1)).toEqual([1, 3]);
  });
});
