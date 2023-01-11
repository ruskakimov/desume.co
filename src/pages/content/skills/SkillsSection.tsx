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
import useSkillGroupPanel, { userCancelReason } from "./useSkillGroupPanel";

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
    if (skillGroups.length === 0) return null;
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

    return skillGroups.map((skillGroup, index) => {
      const updateSkillGroup = (skillGroup: SkillGroup | null) => {
        if (skillGroup) {
          setSkillGroups(withReplacedAt(skillGroups, index, skillGroup));
        } else {
          setSkillGroups(withRemovedAt(skillGroups, index));
        }
      };

      return (
        <SkillGroupCard skillGroup={skillGroup} onChange={updateSkillGroup} />
      );
    });
  }

  return (
    <div className="pb-4">
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
        {buildTopAddButton()}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">{buildContent()}</div>

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
      <div className="rounded-md border border-gray-300">
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
          <span className="font-medium text-gray-900">
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
        <SortableBulletList
          bullets={skillGroup.skills}
          onChange={(skills) =>
            onChange({
              ...skillGroup,
              skills,
            })
          }
        />
      </div>
      {editSkillGroupPanel}
    </>
  );
};

export default SkillsSection;
