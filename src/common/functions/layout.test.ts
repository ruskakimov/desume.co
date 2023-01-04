import { groupIntoStacks } from "./layout";

describe("groupIntoStacks", () => {
  test("can group all", () => {
    expect(groupIntoStacks([100, 150], 300)).toEqual([[0, 2]]);
  });

  test("can group into 2 stacks", () => {
    expect(groupIntoStacks([100, 150, 200], 300)).toEqual([
      [0, 2],
      [2, 3],
    ]);
  });

  test("can group into 3 stacks", () => {
    expect(groupIntoStacks([100, 150, 50, 100, 200, 50, 200], 300)).toEqual([
      [0, 3],
      [3, 5],
      [5, 7],
    ]);
  });

  test("throws an error if some height exceeds max", () => {
    expect(() => groupIntoStacks([100, 150, 200], 160)).toThrow();
  });
});
