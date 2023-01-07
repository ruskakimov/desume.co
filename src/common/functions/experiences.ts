import { Experience } from "../interfaces/resume";
import { compareMonthYearDates } from "./time";

export function sortExperiencesByStartDate<T extends Experience>(
  experiences: T[]
): T[] {
  return experiences
    .sort((a, b) => compareMonthYearDates(a.startDate, b.startDate))
    .reverse();
}
