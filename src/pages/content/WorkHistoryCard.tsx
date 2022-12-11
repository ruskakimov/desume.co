import classNames from "classnames";
import { WorkExperience } from "../../common/interfaces/resume";
import useWorkExperiencePanel from "./useWorkExperiencePanel";

interface WorkHistoryCardProps {
  experience: WorkExperience;
  onChange: (experience: WorkExperience) => void;
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
      <div
        onClick={() => openEditExperiencePanel(experience)}
        className={classNames(
          "w-full border sm:overflow-hidden sm:rounded-md",
          {
            "opacity-50": !experience.included,
          }
        )}
      >
        <div className="grid grid-cols-3">
          <div className="p-4 flex flex-col border-r bg-gray-50">
            <span className="font-medium text-gray-900">
              {experience.companyName}
            </span>

            <span className="font-normal text-gray-700">
              {experience.jobTitle}
            </span>

            <span className="mt-1 text-sm font-normal text-gray-500">{`${
              experience.startDate
            } – ${experience.endDate ?? "Current"}`}</span>
          </div>

          <div className="col-span-2 p-4 text-sm text-gray-500">
            <ul className="list-disc list-inside">
              {experience.bulletPoints.map((text) => (
                <li className="truncate leading-6">{text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {editExperiencePanel}
    </>
  );
};

export default WorkHistoryCard;
