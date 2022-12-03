import { CheckCircleIcon, Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Checkbox from "../../common/components/Checkbox";
import PageHeader from "../../common/components/PageHeader";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import MonthYearField from "../../common/components/fields/MonthYearField";

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
                    <TextField name="company-name" label="Company name" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <WebsiteField
                      name="company-website"
                      label="Company website"
                    />
                  </div>

                  <div className="col-span-6">
                    <TextField name="job-title" label="Job title" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <MonthYearField label="Start" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <MonthYearField label="End" />
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
