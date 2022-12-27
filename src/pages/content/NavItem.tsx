import { Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Checkbox from "../../common/components/Checkbox";

interface NavItemProps {
  label: string;
  isSelected: boolean;
  isChecked: boolean;
  isCheckboxDisabled?: boolean;
  isHandleShown?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  isSelected,
  isChecked,
  isCheckboxDisabled = false,
  isHandleShown = true,
}) => {
  return (
    <a
      className={classNames(
        isSelected
          ? "bg-white text-gray-900"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
        "group rounded-md px-3 py-2 flex gap-3 items-center text-sm font-medium"
      )}
      aria-current={isSelected ? "page" : undefined}
    >
      <Checkbox checked={isChecked} disabled={isCheckboxDisabled} />

      <span className="truncate">{label}</span>

      {isHandleShown ? (
        <Bars2Icon
          className="text-gray-400 flex-shrink-0 ml-auto mr-1 h-4 w-4"
          aria-hidden="true"
        />
      ) : null}
    </a>
  );
};

export default NavItem;
