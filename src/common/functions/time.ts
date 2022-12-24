import { months } from "../constants/months";
import { MonthYear } from "../interfaces/time";

export function monthYearToString({ month, year }: MonthYear): string {
  const monthIndex = month - 1;
  return `${months[monthIndex]} ${year}`;
}
