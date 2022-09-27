import { cumulative } from "./math";

describe("cumulative function", () => {
  test("returns empty array", () => {
    expect(cumulative([])).toStrictEqual([]);
  });

  test("works for positive integers", () => {
    expect(cumulative([1, 2, 3, 4])).toStrictEqual([1, 3, 6, 10]);
  });

  test("works for negative integers", () => {
    expect(cumulative([-1, -4, -2, -10])).toStrictEqual([-1, -5, -7, -17]);
  });

  test("works for mixed positive and negative integers", () => {
    expect(cumulative([10, -40, 15, 0])).toStrictEqual([10, -30, -15, -15]);
  });
});
