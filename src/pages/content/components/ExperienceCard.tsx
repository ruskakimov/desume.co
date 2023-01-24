import Checkbox from "../../../common/components/Checkbox";
import { Experience } from "../../../common/interfaces/resume";
import { monthYearToString } from "../../../common/functions/time";
import SortableBulletList from "./SortableBulletList";
import { PencilIcon } from "@heroicons/react/24/outline";

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  experience: Experience;
  onChange: (experience: Experience) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  subtitle,
  experience,
  onChange,
  onEdit,
}) => {
  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Present";

  return (
    <>
      <div className="w-full border sm:rounded-md shadow-sm">
        <div className="sm:rounded-t-md px-2 h-14 flex flex-row items-center gap-2 border-b bg-gray-50">
          <div className="mx-2 h-6 flex items-center">
            <Checkbox
              checked={experience.included}
              onChange={(e) => {
                onChange({ ...experience, included: e.target.checked });
              }}
            />
          </div>

          <span className="font-medium text-gray-900">{title}</span>

          <span className="font-normal text-gray-700">{subtitle}</span>

          <span className="ml-auto font-normal text-gray-500">{`${start} – ${end}`}</span>

          <button
            type="button"
            className="mx-2 flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring"
            onClick={onEdit}
          >
            <span className="sr-only">Edit {title}</span>
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>

        {experience.bulletPoints.length === 0 ? (
          <div className="my-2 h-9 flex items-center justify-center">
            <span className="text-sm text-gray-400">No bullet points</span>
          </div>
        ) : (
          <SortableBulletList
            bullets={experience.bulletPoints}
            onChange={(bulletPoints) =>
              onChange({ ...experience, bulletPoints })
            }
          />
        )}
      </div>
    </>
  );
};

export default ExperienceCard;
