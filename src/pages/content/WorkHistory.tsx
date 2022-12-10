import Card from "../../common/components/Card";
import Checkbox from "../../common/components/Checkbox";
import MonthYearField from "../../common/components/fields/MonthYearField";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import PrimaryButton from "../../common/components/PrimaryButton";
import SlideOver from "../../common/components/SlideOver";
import { WorkExperience } from "../../common/interfaces/resume";
import WorkHistoryCard from "./WorkHistoryCard";

interface WorkHistoryProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ experiences, onChange }) => {
  return (
    <>
      <SlideOver />

      <Card>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Work History
          </h3>

          <PrimaryButton>Add Experience</PrimaryButton>
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

      <form action="#" method="POST">
        <Card>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <TextField name="company-name" label="Company name" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <WebsiteField name="company-website" label="Company website" />
            </div>

            <div className="col-span-6">
              <TextField name="job-title" label="Job title" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <MonthYearField label="Start" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <MonthYearField label="End" />
            </div>
          </div>
        </Card>
      </form>
    </>
  );
};

export default WorkHistory;
