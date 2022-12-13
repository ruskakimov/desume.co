import { Bars2Icon } from "@heroicons/react/24/outline";
import Checkbox from "../../common/components/Checkbox";
import EllipsisMenu from "../../common/components/EllipsisMenu";
import useConfirmationDialog from "../../common/hooks/useConfirmationDialog";
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
    "Edit experience",
    (editedExperience) => onChange(editedExperience)
  );

  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();

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
              {
                label: "Delete",
                onClick: async () => {
                  if (
                    await openConfirmationDialog({
                      title: "Delete experience",
                      body: (
                        <p className="text-sm text-gray-500">
                          Delete{" "}
                          <b>
                            {experience.jobTitle} at {experience.companyName}
                          </b>
                          ? This action cannot be undone.
                        </p>
                      ),
                      action: "Delete",
                    })
                  ) {
                    onChange(null);
                  }
                },
              },
            ]}
          />
        </div>

        <ul className="flex flex-col divide-y">
          {experience.bulletPoints.map((text) => (
            <li className="p-4 flex gap-4 items-center hover:bg-gray-50 cursor-pointer">
              <Checkbox />
              <span className="text-sm text-gray-700">{text}</span>
              <Bars2Icon
                className="text-gray-400 flex-shrink-0 ml-auto h-4 w-8"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </div>

      {editExperiencePanel}
      {confirmationDialog}
    </>
  );
};

export default WorkHistoryCard;
