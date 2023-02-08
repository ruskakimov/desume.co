import Checkbox from "../../../common/components/Checkbox";
import { Experience } from "../../../common/interfaces/resume";
import { monthYearToString } from "../../../common/functions/time";
import SortableBulletList from "./SortableBulletList";
import { PencilIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import useBulletModal from "./useBulletModal";
import { withRemovedAt, withReplacedAt } from "../../../common/functions/array";
import { userCancelReason } from "../../../common/constants/reject-reasons";

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  experience: Experience;
  onChange: (experience: Experience) => void;
  onEditClick: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  subtitle,
  experience,
  onChange,
  onEditClick,
}) => {
  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Present";

  const [openBulletModal, bulletModal] = useBulletModal();

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
            onClick={onEditClick}
          >
            <span className="sr-only">Edit {title}</span>
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>

        <SortableBulletList
          bullets={experience.bulletPoints}
          onChange={(bulletPoints) => onChange({ ...experience, bulletPoints })}
          onClick={(bullet, index) => {
            openBulletModal(bullet)
              .then((editedBullet) => {
                if (editedBullet) {
                  onChange({
                    ...experience,
                    bulletPoints: withReplacedAt(
                      experience.bulletPoints,
                      index,
                      editedBullet
                    ),
                  });
                } else {
                  onChange({
                    ...experience,
                    bulletPoints: withRemovedAt(experience.bulletPoints, index),
                  });
                }
              })
              .catch((e) => {
                if (e !== userCancelReason) console.error(e);
              });
          }}
        />

        <div className="mx-4 mb-4">
          <button
            className="w-full h-10 rounded bg-gray-50 flex justify-center items-center gap-1 font-medium hover:bg-gray-100"
            onClick={() => {
              openBulletModal(null)
                .then((newBullet) => {
                  if (newBullet) {
                    onChange({
                      ...experience,
                      bulletPoints: [...experience.bulletPoints, newBullet],
                    });
                  }
                })
                .catch((e) => {
                  if (e !== userCancelReason) console.error(e);
                });
            }}
          >
            <PlusSmallIcon className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-600">Add accomplishment</span>
          </button>
        </div>
      </div>

      {bulletModal}
    </>
  );
};

export default ExperienceCard;
