/**
 * A range between two indices. The first is inclusive, second is exclusive.
 */
type Range = [number, number];

export function groupIntoStacks(heights: number[], maxHeight: number): Range[] {
  const ranges: Range[] = [];
  let startIndex = 0;
  let stackHeight = 0;

  heights.forEach((h, i) => {
    if (stackHeight + h <= maxHeight) {
      stackHeight += h;
    } else {
      ranges.push([startIndex, i]);
      startIndex = i;
    }
  });

  ranges.push([startIndex, heights.length]);

  return ranges;
}
