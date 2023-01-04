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
});
