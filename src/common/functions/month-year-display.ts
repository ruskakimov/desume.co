import { months } from "../constants/months";
import { MonthYear } from "../interfaces/month-year";

export function getMonthYearDisplayString(date: MonthYear): string {
  const monthIndex = date.month - 1;
  const month = months[monthIndex];
  return `${month} ${date.year}`;
}
