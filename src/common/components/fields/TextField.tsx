import React from "react";
import { useId } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, ...props }, ref) => {
    const inputId = useId();

    return (
      <>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          {...props}
          type="text"
          id={inputId}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
      </>
    );
  }
);

export default TextField;
