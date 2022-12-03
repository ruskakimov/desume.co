import { useId } from "react";

interface TextFieldProps {
  name: string;
  label: string;
  autoComplete?: string;
}

const TextField: React.FC<TextFieldProps> = ({ name, label, autoComplete }) => {
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
        type="text"
        name={name}
        id={inputId}
        autoComplete={autoComplete}
        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
      />
    </>
  );
};

export default TextField;
