import { months } from "../constants/months";

export class MonthYear {
  constructor(
    /**
     * Month number. January is 1. December is 12.
     */
    public readonly month: number,
    public readonly year: number
  ) {}

  toString(): string {
    const monthIndex = this.month - 1;
    const month = months[monthIndex];
    return `${month} ${this.year}`;
  }
}
