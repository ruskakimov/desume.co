import { DocumentPlusIcon } from "@heroicons/react/24/outline";

interface EmptyStateAddButtonProps {
  label: string;
  onClick: () => void;
}

const EmptyStateAddButton: React.FC<EmptyStateAddButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <button
      type="button"
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring"
      onClick={onClick}
    >
      <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-300" />
      <span className="mt-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
    </button>
  );
};

export default EmptyStateAddButton;
