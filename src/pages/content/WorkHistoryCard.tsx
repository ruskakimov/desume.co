import classNames from "classnames";
import { months } from "../../common/constants/months";
import { MonthYear, WorkExperience } from "../../common/interfaces/resume";

interface WorkHistoryCardProps {
  experience: WorkExperience;
}

function makeDateDisplayString(date: MonthYear): string {
  const monthIndex = date.month - 1;
  const month = months[monthIndex];
  return `${month} ${date.year}`;
}

const WorkHistoryCard: React.FC<WorkHistoryCardProps> = ({ experience }) => {
  const startDate = makeDateDisplayString(experience.startDate);
  const endDate = experience.endDate
    ? makeDateDisplayString(experience.endDate)
    : "Current";

  return (
    <div
      className={classNames("w-full border sm:overflow-hidden sm:rounded-md", {
        "opacity-50": !experience.included,
      })}
    >
      <div className="grid grid-cols-3">
        <div className="p-4 flex flex-col border-r bg-gray-50">
          <span className="font-medium text-gray-900">
            {experience.companyName}
          </span>

          <span className="font-normal text-gray-700">
            {experience.jobTitle}
          </span>

          <span className="mt-1 text-sm font-normal text-gray-500">{`${startDate} – ${endDate}`}</span>
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
  );
};

export default WorkHistoryCard;
