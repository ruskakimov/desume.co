import { CheckCircleIcon, Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Checkbox from "../../common/components/Checkbox";
import PageHeader from "../../common/components/PageHeader";

const navigation = [
  {
    name: "Personal Details",
    href: "#",
    icon: CheckCircleIcon,
    current: false,
  },
  { name: "Work History", href: "#", icon: CheckCircleIcon, current: true },
  { name: "Education", href: "#", icon: CheckCircleIcon, current: false },
  { name: "Projects", href: "#", icon: CheckCircleIcon, current: false },
  { name: "Skills", href: "#", icon: CheckCircleIcon, current: false },
];

export default function ContentPage() {
  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-white text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <Checkbox />

                <span className="truncate">{item.name}</span>

                <Bars2Icon
                  className="text-gray-400 flex-shrink-0 ml-auto mr-1 h-4 w-4"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="bg-white px-4 py-3 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Work History
              </h3>

              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Add Experience
              </button>
            </div>
          </div>

          <form action="#" method="POST">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company name
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company website
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        name="company-website"
                        id="username"
                        className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Job title
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start
                    </label>
                    <div className="mt-1 flex -space-x-px">
                      <div className="w-1/2 min-w-0 flex-1">
                        <label htmlFor="month" className="sr-only">
                          Month
                        </label>
                        <select
                          id="month"
                          name="month"
                          className="relative block w-full rounded-none rounded-tl-md rounded-bl-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>January</option>
                          <option>February</option>
                        </select>
                      </div>
                      <div className="min-w-0 flex-1">
                        <label htmlFor="card-cvc" className="sr-only">
                          Year
                        </label>
                        <input
                          type="text"
                          name="card-cvc"
                          id="card-cvc"
                          className="relative block w-full rounded-none rounded-br-md rounded-tr-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Year"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End
                    </label>
                    <div className="mt-1 flex -space-x-px">
                      <div className="w-1/2 min-w-0 flex-1">
                        <label htmlFor="month" className="sr-only">
                          Month
                        </label>
                        <select
                          id="month"
                          name="month"
                          className="relative block w-full rounded-none rounded-tl-md rounded-bl-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>January</option>
                          <option>February</option>
                        </select>
                      </div>
                      <div className="min-w-0 flex-1">
                        <label htmlFor="card-cvc" className="sr-only">
                          Year
                        </label>
                        <input
                          type="text"
                          name="card-cvc"
                          id="card-cvc"
                          className="relative block w-full rounded-none rounded-br-md rounded-tr-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Year"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}