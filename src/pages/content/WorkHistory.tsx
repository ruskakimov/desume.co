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
    "Add Experience",
    (newExperience) => {
      onChange([newExperience, ...experiences]);
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
          <WorkHistoryCard
            experience={experience}
            onChange={(editedExperience) => {
              const slice = experiences.slice();
              slice[index] = editedExperience;
              onChange(slice);
            }}
          />
        ))}
      </Card>

      {addExperiencePanel}
    </>
  );
};

export default WorkHistory;
