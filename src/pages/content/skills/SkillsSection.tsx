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
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { PencilIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useContextResume } from "../../../AppShell";
import Checkbox from "../../../common/components/Checkbox";
import EmptyStateAddButton from "../../../common/components/EmptyStateAddButton";
import PrimaryButton from "../../../common/components/PrimaryButton";
import ShimmerCards from "../../../common/components/ShimmerCards";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";
import { SkillGroup } from "../../../common/interfaces/resume";
import SortableBulletList from "../components/SortableBulletList";
import SortableCardItem from "../components/SortableCardItem";
import useSkillGroupPanel, { userCancelReason } from "./useSkillGroupPanel";

const maxSkillGroups = 3;

function useSkillGroups(): [
  SkillGroup[] | null,
  (skillGroups: SkillGroup[]) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.skillGroups ?? null,
    (skillGroups) => setResume({ ...resume!, skillGroups }),
  ];
}

const SkillsSection: React.FC = () => {
  const [skillGroups, setSkillGroups] = useSkillGroups();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [openAddSkillGroupPanel, addSkillGroupPanel] =
    useSkillGroupPanel("Add skill group");

  // TODO: Add loading state
  const isLoading = skillGroups === null;

  const handleAdd = () => {
    openAddSkillGroupPanel(null)
      .then((skillGroup) => {
        if (skillGroups && skillGroup)
          setSkillGroups([...skillGroups, skillGroup]);
      })
      .catch((e) => {
        if (e !== userCancelReason) console.error(e);
      });
  };

  function buildTopAddButton(): React.ReactNode {
    const button = (
      <PrimaryButton onClick={handleAdd}>Add skill group</PrimaryButton>
    );

    if (isLoading) return <ShimmerOverlay>{button}</ShimmerOverlay>;
    if (skillGroups.length === 0 || skillGroups.length >= maxSkillGroups)
      return null;
    return button;
  }

  function buildContent(): React.ReactNode {
    if (isLoading) return <ShimmerCards count={3} />;

    if (skillGroups.length === 0)
      return (
        <div className="col-span-full">
          <EmptyStateAddButton
            Icon={WrenchScrewdriverIcon}
            label="Add skill group"
            onClick={handleAdd}
          />
        </div>
      );

    // TODO: Replace with actual ids
    const groupIds = skillGroups.map((skillGroup) => skillGroup.groupName);

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => {
          const { active, over } = e;

          if (active.id !== over?.id) {
            const oldIndex = groupIds.indexOf(active.id as string);
            const newIndex = groupIds.indexOf(over?.id as string);
            const reorderedSkillGroups = arrayMove(
              skillGroups,
              oldIndex,
              newIndex
            );
            setSkillGroups(reorderedSkillGroups);
          }
        }}
      >
        <SortableContext items={groupIds} strategy={rectSortingStrategy}>
          {skillGroups.map((skillGroup, index) => {
            const updateSkillGroup = (skillGroup: SkillGroup | null) => {
              if (skillGroup) {
                setSkillGroups(withReplacedAt(skillGroups, index, skillGroup));
              } else {
                setSkillGroups(withRemovedAt(skillGroups, index));
              }
            };

            return (
              // TODO: Add ids to skill groups
              <SortableCardItem
                key={skillGroup.groupName}
                id={skillGroup.groupName}
              >
                <SkillGroupCard
                  skillGroup={skillGroup}
                  onChange={updateSkillGroup}
                />
              </SortableCardItem>
            );
          })}
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <div className="pb-4">
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
        {buildTopAddButton()}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">{buildContent()}</div>

      {addSkillGroupPanel}
    </div>
  );
};

interface SkillGroupCardProps {
  skillGroup: SkillGroup;
  onChange: (skillGroup: SkillGroup | null) => void;
}

const SkillGroupCard: React.FC<SkillGroupCardProps> = ({
  skillGroup,
  onChange,
}) => {
  const [openEditSkillGroupPanel, editSkillGroupPanel] =
    useSkillGroupPanel("Edit skill group");

  return (
    <>
      <div className="rounded-t-md h-14 px-2 flex flex-row gap-2 items-center border-b border-gray-300 bg-gray-50">
        <div className="mx-2 h-6 flex items-center">
          <Checkbox
            checked={skillGroup.included}
            onChange={(e) =>
              onChange({
                ...skillGroup,
                included: e.target.checked,
              })
            }
          />
        </div>
        <span className="font-medium text-gray-900 overflow-hidden text-ellipsis">
          {skillGroup.groupName}
        </span>

        <button
          type="button"
          className="ml-auto mr-2 flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring"
          onClick={() => {
            openEditSkillGroupPanel(skillGroup)
              .then(onChange)
              .catch((e) => {
                if (e !== userCancelReason) console.error(e);
              });
          }}
        >
          <span className="sr-only">Edit skill group</span>
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>

      {skillGroup.skills.length === 0 ? (
        <div className="my-2 h-9 flex items-center justify-center">
          <span className="text-sm text-gray-400">No skills</span>
        </div>
      ) : (
        <SortableBulletList
          bullets={skillGroup.skills}
          onChange={(skills) =>
            onChange({
              ...skillGroup,
              skills,
            })
          }
        />
      )}

      {editSkillGroupPanel}
    </>
  );
};

export default SkillsSection;
