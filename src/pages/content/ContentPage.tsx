import PageHeader from "../../common/components/PageHeader";
import WorkHistorySection from "./work-history/WorkHistorySection";
import NavItem from "./components/NavItem";
import Card from "../../common/components/Card";
import useLocalState from "../../common/hooks/useLocalState";
import EducationSection from "./education/EducationSection";
import ProjectsSection from "./projects/ProjectsSection";
import PersonalDetailsSection from "./personal-details/PersonalDetailsSection";
import SkillsSection from "./skills/SkillsSection";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableSectionItem from "./components/SortableSectionItem";

interface TabItem {
  key: string;
  name: string;
  element: JSX.Element | null;
}

const navigation: TabItem[] = [
  {
    key: "personal-details",
    name: "Personal details",
    element: <PersonalDetailsSection />,
  },
  {
    key: "work-history",
    name: "Work history",
    element: <WorkHistorySection />,
  },
  {
    key: "education",
    name: "Education",
    element: <EducationSection />,
  },
  {
    key: "projects",
    name: "Projects",
    element: <ProjectsSection />,
  },
  {
    key: "skills",
    name: "Skills",
    element: <SkillsSection />,
  },
];

export default function ContentPage() {
  const [selectedNavKey, setSelectedNavKey] = useLocalState<string>(
    "selected-content-tab",
    navigation[0].key
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sectionIds = navigation.map((section) => section.key);

  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => {
                const { active, over } = e;

                if (active.id !== over?.id) {
                  const oldIndex = sectionIds.indexOf(active.id as string);
                  const newIndex = sectionIds.indexOf(over?.id as string);
                  // const reorderedBullets = arrayMove(
                  //   bullets,
                  //   oldIndex,
                  //   newIndex
                  // );
                  // onChange(reorderedBullets);
                }
              }}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
              >
                {navigation.map((item) => (
                  <SortableSectionItem key={item.key} id={item.key}>
                    <NavItem
                      label={item.name}
                      isSelected={item.key === selectedNavKey}
                      isChecked={true}
                      onClick={() => setSelectedNavKey(item.key)}
                    />
                  </SortableSectionItem>
                ))}
              </SortableContext>
            </DndContext>
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
