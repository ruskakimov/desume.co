import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Checkbox from "../../common/components/Checkbox";
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
        <div className="p-4 flex flex-row gap-2 border-b bg-gray-50">
          <div className="mr-2 h-6 flex items-center">
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

          {/* <button
              type="button"
              className="flex-shrink-0 m-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Open options</span>
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </button> */}
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
