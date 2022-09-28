import { clamp, cumulative } from "./math";

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
