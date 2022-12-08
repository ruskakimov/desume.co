import { CheckCircleIcon, Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Checkbox from "../../common/components/Checkbox";
import PageHeader from "../../common/components/PageHeader";
import WorkHistory from "./WorkHistory";

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
          <WorkHistory
            experiences={[
              {
                companyName: "TechWings",
                companyWebsiteUrl: "https://techwings.com/",
                jobTitle: "Senior Frontend Engineer",
                startDate: { month: 9, year: 2022 },
                endDate: null,
                bulletPoints: [],
              },
              {
                companyName: "Deriv",
                companyWebsiteUrl: "https://deriv.com/",
                jobTitle: "Frontend Engineer",
                startDate: { month: 2, year: 2018 },
                endDate: { month: 6, year: 2021 },
                bulletPoints: [],
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
