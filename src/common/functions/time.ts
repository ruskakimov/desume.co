import { months } from "../constants/months";
import { MonthYear } from "../interfaces/time";

export function monthYearToString({ month, year }: MonthYear): string {
  const monthIndex = month - 1;
  return `${months[monthIndex].slice(0, 3)} ${year}`;
}

export function compareMonthYearDates(a: MonthYear, b: MonthYear): number {
  if (a.year === b.year && a.month === b.month) return 0;

  const aIsBefore = a.year < b.year || (a.year === b.year && a.month < b.month);
  return aIsBefore ? 1 : -1;
}
