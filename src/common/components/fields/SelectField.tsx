import React from "react";
import { useId } from "react";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectFieldProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption<string>[];
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, defaultValue, options, ...props }, ref) => {
    const inputId = useId();

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <select
          {...props}
          ref={ref}
          id={inputId}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          defaultValue={defaultValue}
        >
          {options.map(({ value, label }) => (
            <option value={value}>{label}</option>
          ))}
        </select>
      </div>
    );
  }
);

export default SelectField;
