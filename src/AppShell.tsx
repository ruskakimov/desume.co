import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import logo from "./assets/images/logo.svg";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { firebaseAuth } from "./api/firebase-setup";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import useResume from "./api/useResume";
import { useReview } from "./pages/review/review-context";

interface NavItem {
  name: string;
  to: string;
  count: number;
}

export default function AppShell() {
  const [user] = useAuthState(firebaseAuth);
  const resumeContext = useResume(user ?? null);
  const { review } = useReview();

  const navigation: NavItem[] = [
    { name: "Edit", to: "/edit", count: 0 },
    { name: "Review", to: "/review", count: review?.corrections.length ?? 0 },
    { name: "Export", to: "/export", count: 0 },
  ];

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
                        {item.count ? (
                          <span className="ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-semibold md:inline-block bg-sky-500 text-white">
                            {item.count}
                          </span>
                        ) : null}
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
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "w-full text-left block px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={signOut}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring">
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
                  <Disclosure.Button key={item.name} className="block w-full">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-50 border-gray-800 text-gray-700"
                            : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                          "block text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="space-y-1">
                  <Disclosure.Button
                    as="a"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    onClick={signOut}
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-10 overflow-y-scroll flex-1">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Outlet context={resumeContext} />
        </div>
      </div>
    </div>
  );
}

export function useContextResume() {
  return useOutletContext<ReturnType<typeof useResume>>();
}
