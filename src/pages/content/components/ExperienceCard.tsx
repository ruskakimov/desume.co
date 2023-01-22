import Checkbox from "../../../common/components/Checkbox";
import EllipsisMenu from "../../../common/components/EllipsisMenu";
import { Experience } from "../../../common/interfaces/resume";
import { monthYearToString } from "../../../common/functions/time";
import SortableBulletList from "./SortableBulletList";

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
  onDelete,
}) => {
  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Present";

  return (
    <>
      <div className="w-full border sm:rounded-md">
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

          <EllipsisMenu
            menuItems={[
              {
                label: "Edit",
                onClick: onEdit,
              },
              {
                label: "Delete",
                onClick: onDelete,
              },
            ]}
          />
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
