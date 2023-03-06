import classNames from "classnames";
import React from "react";
import { twMerge } from "tailwind-merge";

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(({ children, ...props }, ref) => {
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      className={twMerge(
        classNames(
          "inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring disabled:opacity-50 disabled:pointer-events-none",
          props.className
        )
      )}
    >
      {children}
    </button>
  );
});

export default SecondaryButton;
