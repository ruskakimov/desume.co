import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export type ValidationIcon = "success" | "warning" | "failure";

const iconMap: Record<ValidationIcon, React.ReactElement> = {
  success: (
    <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
  ),
  warning: (
    <ExclamationTriangleIcon
      className="h-5 w-5 text-orange-500"
      aria-hidden="true"
    />
  ),
  failure: <XCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />,
};

export interface ValidationItemProps {
  icon: ValidationIcon;
  label: string;
}

export const ValidationItem: React.FC<ValidationItemProps> = ({
  icon,
  label,
}) => {
  return (
    <div className="flex gap-2">
      {iconMap[icon]}
      <span className="text-sm">{label}</span>
    </div>
  );
};
