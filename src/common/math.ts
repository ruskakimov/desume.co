export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns a new array of numbers, where array[i] is a sum of [0:i] range in the original array.
 */
export function cumulative(array: number[]): number[] {
  let total = 0;
  return array.map((value) => {
    total += value;
    return total;
  });
}
