import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className="h-4 w-4 mr-3 rounded border-gray-300 text-gray-600 disabled:text-gray-300 focus:ring-gray-500 no-mouse-focus-ring"
      />
    );
  }
);

export default Checkbox;
