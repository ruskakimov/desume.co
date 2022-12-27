import PageHeader from "../../common/components/PageHeader";
import WorkHistory from "./WorkHistory";
import NavItem from "./NavItem";
import Card from "../../common/components/Card";
import useLocalState from "../../common/hooks/useLocalState";

interface TabItem {
  key: string;
  name: string;
  element: JSX.Element | null;
}

const navigation: TabItem[] = [
  {
    key: "personal-details",
    name: "Personal details",
    element: <h1>Personal details</h1>,
  },
  {
    key: "work-history",
    name: "Work history",
    element: <WorkHistory />,
  },
  {
    key: "education",
    name: "Education",
    element: <h1>Education</h1>,
  },
  {
    key: "projects",
    name: "Projects",
    element: <h1>Projects</h1>,
  },
  {
    key: "skills",
    name: "Skills",
    element: <h1>Skills</h1>,
  },
];

export default function ContentPage() {
  const [selectedNavKey, setSelectedNavKey] = useLocalState<string>(
    "selected-content-tab",
    navigation[0].key
  );

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
          <Card>
            {navigation.find((item) => item.key === selectedNavKey)?.element}
          </Card>
        </div>
      </div>
    </>
  );
}
