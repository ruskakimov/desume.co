import React from "react";
import { useId } from "react";

interface TextAreaFieldProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, ...props }, ref) => {
    const inputId = useId();

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <textarea
            {...props}
            ref={ref}
            id={inputId}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          />
        </div>
      </div>
    );
  }
);

export default TextAreaField;
