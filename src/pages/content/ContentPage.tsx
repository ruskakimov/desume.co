import PageHeader from "../../common/components/PageHeader";
import WorkHistory from "./WorkHistory";
import NavItem from "./NavItem";
import { useState } from "react";

const navigation = [
  {
    key: "personal-details",
    name: "Personal details",
  },
  { key: "work-history", name: "Work history" },
  { key: "education", name: "Education" },
  { key: "projects", name: "Projects" },
  { key: "skills", name: "Skills" },
];

export default function ContentPage() {
  const [selectedNavKey, setSelectedNavKey] = useState("personal-details");

  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            {navigation.map((item) => (
              <NavItem
                key={item.key}
                label={item.name}
                isSelected={item.key === selectedNavKey}
                isChecked={true}
                onClick={() => setSelectedNavKey(item.key)}
              />
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <WorkHistory />
        </div>
      </div>
    </>
  );
}
