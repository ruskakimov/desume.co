interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export default function Checkbox({ id, ...props }: CheckboxProps) {
  return (
    <input
      id={id}
      {...props}
      type="checkbox"
      className="h-4 w-4 mr-3 rounded border-gray-300 text-gray-600 disabled:text-gray-300 focus:ring-gray-500"
    />
  );
}
