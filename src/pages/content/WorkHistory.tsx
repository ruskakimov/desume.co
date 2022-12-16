import Card from "../../common/components/Card";
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
    "Add experience",
    (newExperience) => {
      onChange([newExperience, ...experiences]);
    }
  );

  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Work history
          </h3>

          <PrimaryButton onClick={() => openAddExperiencePanel()}>
            Add experience
          </PrimaryButton>
        </div>

        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <WorkHistoryCard
              experience={experience}
              onChange={(editedExperience) => {
                if (editedExperience === null) {
                  // Deleted
                  onChange([
                    ...experiences.slice(0, index),
                    ...experiences.slice(index + 1),
                  ]);
                } else {
                  // Edited
                  const slice = experiences.slice();
                  slice[index] = editedExperience;
                  onChange(slice);
                }
              }}
            />
          ))}
        </div>
      </Card>

      {addExperiencePanel}
    </>
  );
};

export default WorkHistory;
