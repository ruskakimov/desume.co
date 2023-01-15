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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableSectionItem from "./components/SortableSectionItem";
import {
  ResumeSectionId,
  ResumeSectionItem,
} from "../../common/interfaces/resume";
import { useContextResume } from "../../AppShell";
import { withReplacedAt } from "../../common/functions/array";
import ShimmerCards from "../../common/components/ShimmerCards";

function useSectionOrder(): [
  ResumeSectionItem[] | null,
  (experiences: ResumeSectionItem[]) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.sectionOrder ?? null,
    (sectionOrder) => setResume({ ...resume!, sectionOrder }),
  ];
}

const sectionElements: Record<ResumeSectionId, JSX.Element> = {
  personal: <PersonalDetailsSection />,
  work: <WorkHistorySection />,
  education: <EducationSection />,
  projects: <ProjectsSection />,
  skills: <SkillsSection />,
};

const sectionLabels: Record<ResumeSectionId, string> = {
  personal: "Personal details",
  work: "Work experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
};

export default function ContentPage() {
  const [sectionOrder, setSectionOrder] = useSectionOrder();
  const [selectedTab, setSelectedTab] = useLocalState<ResumeSectionId>(
    "selected-content-tab",
    "personal",
    (parsed) => Object.keys(sectionElements).includes(parsed)
  );

  const isLoading = sectionOrder === null;

  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            {isLoading ? (
              <ShimmerCards count={1} />
            ) : (
              <SectionItemList
                selectedTab={selectedTab}
                sectionOrder={sectionOrder}
                onTabChange={setSelectedTab}
                onOrderChange={setSectionOrder}
              />
            )}
          </nav>
        </aside>

        <div className="space-y-6">
          <Card>{sectionElements[selectedTab]}</Card>
        </div>
      </div>
    </>
  );
}

interface SectionItemListProps {
  selectedTab: ResumeSectionId;
  sectionOrder: ResumeSectionItem[];
  onTabChange: (tab: ResumeSectionId) => void;
  onOrderChange: (order: ResumeSectionItem[]) => void;
}

const SectionItemList: React.FC<SectionItemListProps> = ({
  selectedTab,
  sectionOrder,
  onTabChange,
  onOrderChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const sectionIds = sectionOrder.map((section) => section.id);

  return (
    <>
      <NavItem
        label={sectionLabels.personal}
        isSelected={selectedTab === "personal"}
        isChecked={true}
        isCheckboxDisabled={true}
        isHandleShown={false}
        onClick={() => onTabChange("personal")}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => {
          const { active, over } = e;

          if (active.id !== over?.id) {
            const oldIndex = sectionIds.indexOf(active.id as ResumeSectionId);
            const newIndex = sectionIds.indexOf(over?.id as ResumeSectionId);
            const reorderedSections = arrayMove(
              sectionOrder,
              oldIndex,
              newIndex
            );
            onOrderChange(reorderedSections);
          }
        }}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={sectionIds}
          strategy={verticalListSortingStrategy}
        >
          {sectionOrder.map((section, index) => (
            <SortableSectionItem key={section.id} id={section.id}>
              <NavItem
                label={sectionLabels[section.id]}
                isSelected={selectedTab === section.id}
                isChecked={section.included}
                onClick={() => onTabChange(section.id)}
                onCheck={(checked) => {
                  onOrderChange(
                    withReplacedAt(sectionOrder, index, {
                      ...section,
                      included: checked,
                    })
                  );
                }}
              />
            </SortableSectionItem>
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
