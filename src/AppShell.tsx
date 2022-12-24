import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import logo from "./assets/logo.svg";
import { useSignOut } from "react-firebase-hooks/auth";
import { firebaseAuth } from "./App";
import { NavLink, Outlet } from "react-router-dom";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Edit", to: "/edit" },
  { name: "Export", to: "/export" },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Manage Subscription", href: "#" },
  { name: "Sign out", href: "#" },
];

export default function AppShell() {
  const [signOut] = useSignOut(firebaseAuth);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <Disclosure as="nav" className="bg-white shadow z-10">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src={logo}
                      alt="PDFEGG"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src={logo}
                      alt="PDFEGG"
                    />
                  </div>
                  <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "border-gray-800 text-gray-900"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring">
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                // TODO: Prevent adding hash to URL on logout
                                onClick={
                                  item.name === "Sign out"
                                    ? () => signOut()
                                    : undefined
                                }
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.to}
                    // className={classNames(
                    //   item.current
                    //     ? "bg-gray-50 border-gray-800 text-gray-700"
                    //     : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                    //   "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    // )}
                    // aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-10 overflow-y-scroll">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
