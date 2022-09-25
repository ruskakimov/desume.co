export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function cumulative(array: number[]): number[] {
  let total = 0;
  return array.map((value) => {
    total += value;
    return total;
  });
}
