import { useId } from "react";
import { months } from "../../constants/months";

interface MonthYearFieldProps {
  label: string;
}

const MonthYearField: React.FC<MonthYearFieldProps> = ({ label }) => {
  const monthInputId = useId();
  const yearInputId = useId();

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
            id={monthInputId}
            name="month"
            className="relative block w-full rounded-none rounded-tl-md rounded-bl-md border-gray-300 bg-transparent focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            defaultValue="January"
          >
            {months.map((month) => (
              <option>{month}</option>
            ))}
          </select>
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor={yearInputId} className="sr-only">
            Year
          </label>
          <input
            type="text"
            name="year"
            id={yearInputId}
            className="relative block w-full rounded-none rounded-br-md rounded-tr-md border-gray-300 bg-transparent focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            placeholder="Year"
          />
        </div>
      </div>
    </>
  );
};

export default MonthYearField;
