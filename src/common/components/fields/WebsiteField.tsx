import { useId } from "react";

interface WebsiteFieldProps {
  name: string;
  label: string;
}

const WebsiteField: React.FC<WebsiteFieldProps> = ({ name, label }) => {
  const inputId = useId();

  return (
    <>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
          https://
        </span>
        <input
          type="text"
          name={name}
          id={inputId}
          autoComplete="url"
          className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
        />
      </div>
    </>
  );
};

export default WebsiteField;
