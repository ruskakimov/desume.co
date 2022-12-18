import React from "react";
import { useId } from "react";
import Checkbox from "../Checkbox";

interface CheckboxFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, ...props }, ref) => {
    const inputId = useId();

    return (
      <div className="flex items-center">
        <Checkbox {...props} ref={ref} id={inputId} />
        <label htmlFor={inputId} className="ml-2 block text-sm text-gray-900">
          {label}
        </label>
      </div>
    );
  }
);

export default CheckboxField;
