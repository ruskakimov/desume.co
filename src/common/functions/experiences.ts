import { Experience } from "../interfaces/resume";
import { compareMonthYearDates } from "./time";

export function sortExperiences<T extends Experience>(experiences: T[]): T[] {
  return experiences.sort((a, b) =>
    compareMonthYearDates(a.startDate, b.startDate)
  );
}
