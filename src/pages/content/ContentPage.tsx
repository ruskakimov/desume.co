import { CheckCircleIcon, Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useState } from "react";
import { MonthYear } from "../../common/classes/MonthYear";
import Checkbox from "../../common/components/Checkbox";
import PageHeader from "../../common/components/PageHeader";
import { WorkExperience } from "../../common/interfaces/resume";
import WorkHistory from "./WorkHistory";

const navigation = [
  {
    name: "Personal details",
    href: "#",
    icon: CheckCircleIcon,
    current: false,
  },
  { name: "Work history", href: "#", icon: CheckCircleIcon, current: true },
  { name: "Education", href: "#", icon: CheckCircleIcon, current: false },
  { name: "Projects", href: "#", icon: CheckCircleIcon, current: false },
  { name: "Skills", href: "#", icon: CheckCircleIcon, current: false },
];

export default function ContentPage() {
  const [workHistory, setWorkHistory] = useState<WorkExperience[]>([
    {
      companyName: "TechWings",
      companyWebsiteUrl: "https://techwings.com/",
      jobTitle: "Senior Frontend Engineer",
      startDate: new MonthYear(9, 2022),
      bulletPoints: [
        "Designed and built a cross-platform mobile animation app using Flutter with over 100k downloads on PlayStore and 11k monthly active users.",
        "Managed a large codebase with over 15,000 lines of code and 900 commits.",
        "Have grown and managed a Discord community with over 2000 members.",
      ],
      included: true,
    },
    {
      companyName: "Deriv",
      companyWebsiteUrl: "https://deriv.com/",
      jobTitle: "Frontend Engineer",
      startDate: new MonthYear(2, 2018),
      endDate: new MonthYear(3, 2021),
      bulletPoints: [
        "Initiated and led a charting library project (with a team of 2 engineers) that replaced a third-party charting solution, saving the company 40k USD annually.",
        "Managed a focused team of one engineer and a designer, delivering a complete web app for P2P transactions within 3 months from the start of the project.",
        "Built a trading history explorer using React / Redux that is used by over 150k monthly users.",
        "Created a prototype of an improved interface for a “digits” contract that was later released to production and generated an 82% increase in the number of transactions for that contract in the next term.",
        "Initiated and led a charting library project (with a team of 2 engineers) that replaced a third-party charting solution, saving the company 40k USD annually.",
        "Managed a focused team of one engineer and a designer, delivering a complete web app for P2P transactions within 3 months from the start of the project.",
        "Built a trading history explorer using React / Redux that is used by over 150k monthly users.",
        "Created a prototype of an improved interface for a “digits” contract that was later released to production and generated an 82% increase in the number of transactions for that contract in the next term.",
      ],
      included: true,
    },
  ]);

  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-white text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  "group rounded-md px-3 py-2 flex gap-3 items-center text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <Checkbox checked={true} disabled={index === 0} />

                <span className="truncate">{item.name}</span>

                {index !== 0 ? (
                  <Bars2Icon
                    className="text-gray-400 flex-shrink-0 ml-auto mr-1 h-4 w-4"
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <WorkHistory
            experiences={workHistory}
            onChange={(experiences) => setWorkHistory(experiences)}
          />
        </div>
      </div>
    </>
  );
}
