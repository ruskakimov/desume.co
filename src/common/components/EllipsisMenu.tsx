import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment } from "react";

interface EllipsisMenuProps {
  menuItems: {
    label: string;
    onClick: () => void;
  }[];
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({ menuItems }) => {
  return (
    <Menu as="div" className="relative flex-shrink-0 pr-2">
      <Menu.Button
        type="button"
        className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring"
      >
        <span className="sr-only">Open options</span>
        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-8 top-0 z-10 mx-3 mt-1 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems.map(({ label, onClick }) => (
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    key={label}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer select-none"
                    )}
                    onClick={onClick}
                  >
                    {label}
                  </a>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default EllipsisMenu;
