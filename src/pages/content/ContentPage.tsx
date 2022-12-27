import { CheckCircleIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../common/components/PageHeader";
import WorkHistory from "./WorkHistory";
import { useContextResume } from "../../AppShell";
import NavItem from "./NavItem";

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
  const [resume, setResume] = useContextResume();

  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            {navigation.map((item, index) => (
              <NavItem
                label={item.name}
                isSelected={item.current}
                isChecked={true}
                isCheckboxDisabled={index === 0}
                isHandleShown={index !== 0}
              />
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <WorkHistory
            experiences={resume?.workHistory ?? null}
            onChange={(experiences) =>
              setResume({ ...resume!, workHistory: experiences })
            }
          />
        </div>
      </div>
    </>
  );
}
