import Checkbox from "../../common/components/Checkbox";
import EllipsisMenu from "../../common/components/EllipsisMenu";
import { WorkExperience } from "../../common/interfaces/resume";
import useWorkExperiencePanel from "./useWorkExperiencePanel";

interface WorkHistoryCardProps {
  experience: WorkExperience;
  onChange: (experience: WorkExperience | null) => void;
}

const WorkHistoryCard: React.FC<WorkHistoryCardProps> = ({
  experience,
  onChange,
}) => {
  const [openEditExperiencePanel, editExperiencePanel] = useWorkExperiencePanel(
    "Edit Experience",
    (editedExperience) => onChange(editedExperience)
  );

  return (
    <>
      <div className="w-full border sm:overflow-hidden sm:rounded-md">
        <div className="px-2 h-14 flex flex-row items-center gap-2 border-b bg-gray-50">
          <div className="mx-2 h-6 flex items-center">
            <Checkbox
              checked={experience.included}
              onChange={(e) => {
                onChange({ ...experience, included: e.target.checked });
              }}
            />
          </div>

          <span className="font-medium text-gray-900">
            {experience.companyName}
          </span>

          <span className="font-normal text-gray-700">
            {experience.jobTitle}
          </span>

          <span className="ml-auto font-normal text-gray-500">{`${
            experience.startDate
          } – ${experience.endDate ?? "Current"}`}</span>

          <EllipsisMenu
            menuItems={[
              {
                label: "Edit",
                onClick: () => openEditExperiencePanel(experience),
              },
              { label: "Delete", onClick: () => onChange(null) },
            ]}
          />
        </div>

        <div className="p-4 pl-8 overflow-hidden">
          <ul className="list-disc list-outside flex flex-col gap-2">
            {experience.bulletPoints.map((text) => (
              <li className="text-sm text-gray-500">{text}</li>
            ))}
          </ul>
        </div>
      </div>

      {editExperiencePanel}
    </>
  );
};

export default WorkHistoryCard;
