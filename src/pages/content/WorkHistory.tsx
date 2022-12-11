import Card from "../../common/components/Card";
import Checkbox from "../../common/components/Checkbox";
import PrimaryButton from "../../common/components/PrimaryButton";
import { WorkExperience } from "../../common/interfaces/resume";
import useWorkExperiencePanel from "./useWorkExperiencePanel";
import WorkHistoryCard from "./WorkHistoryCard";

interface WorkHistoryProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ experiences, onChange }) => {
  const [openAddExperiencePanel, addExperiencePanel] = useWorkExperiencePanel(
    "Add Experience",
    (newExperience) => {
      onChange([newExperience, ...experiences]);
    }
  );

  const [openEditExperiencePanel, editExperiencePanel] = useWorkExperiencePanel(
    "Edit Experience",
    (editedExperience) => {
      // TODO: Find and replace by ID
      // onChange([newExperience, ...experiences]);
    }
  );

  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Work History
          </h3>

          <PrimaryButton onClick={() => openAddExperiencePanel()}>
            Add Experience
          </PrimaryButton>
        </div>

        {experiences.map((experience, index) => (
          <div className="flex">
            <div className="mt-4">
              <Checkbox
                checked={experience.included}
                onChange={(e) => {
                  const slice = experiences.slice();
                  slice[index] = { ...experience, included: e.target.checked };
                  onChange(slice);
                }}
              />
            </div>

            <WorkHistoryCard experience={experience} />
          </div>
        ))}
      </Card>

      {addExperiencePanel}
    </>
  );
};

export default WorkHistory;
