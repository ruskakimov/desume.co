import { useId } from "react";
import { months } from "../../constants/months";

interface MonthYearFieldProps {
  label: string;
  startYear?: number;
  endYear?: number;
  monthProps: React.InputHTMLAttributes<HTMLSelectElement>;
  yearProps: React.InputHTMLAttributes<HTMLSelectElement>;
}

const MonthYearField: React.FC<MonthYearFieldProps> = ({
  label,
  startYear = 1970,
  endYear = 2030,
  monthProps,
  yearProps,
}) => {
  const monthInputId = useId();
  const yearInputId = useId();

  const years: number[] = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }

  return (
    <>
      <label
        htmlFor="first-name"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 flex -space-x-px">
        <div className="w-1/2 min-w-0 flex-1">
          <label htmlFor={monthInputId} className="sr-only">
            Month
          </label>
          <select
            {...monthProps}
            id={monthInputId}
            className="relative block w-full rounded-none rounded-tl-md rounded-bl-md border-gray-300 bg-transparent focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-100"
          >
            <option key="month" value="">
              Month
            </option>

            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 flex-1">
          <label htmlFor={yearInputId} className="sr-only">
            Year
          </label>
          <select
            {...yearProps}
            id={yearInputId}
            className="relative block w-full rounded-none rounded-br-md rounded-tr-md border-gray-300 bg-transparent focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-100"
          >
            <option key="year" value="">
              Year
            </option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default MonthYearField;
