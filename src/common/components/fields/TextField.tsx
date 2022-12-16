import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React from "react";
import { useId } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, ...props }, ref) => {
    const inputId = useId();

    const hasError = error !== undefined;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            {...props}
            ref={ref}
            id={inputId}
            type="text"
            className={classNames(
              "block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm",
              {
                "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500":
                  hasError,
              }
            )}
          />
          {hasError && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        {hasError && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default TextField;
